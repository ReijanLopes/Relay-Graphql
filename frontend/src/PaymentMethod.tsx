import React, { useCallback, useMemo, useState } from "react";
import {
  ScrollView,
  SafeAreaView,
  View,
  Text,
  Pressable,
  Dimensions,
} from "react-native";
import { useLazyLoadQuery, graphql } from "react-relay";
import { useNavigate, useSearchParams } from "react-router-native";
import { Octicons } from "@expo/vector-icons";

import Header from "./components/Header";
import Footer from "./components/Footer";

import { useDebounce, formatNumberInString, calculatedTotal } from "./utils";

import styles from "./styles";

import {
  PaymentMethodQuery as PaymentMethodQueryType,
  PaymentMethodQuery$data,
} from "./__generated__/PaymentMethodQuery.graphql";
import useValidation from "./hooks/useValidation";

const PaymentMethodQuery = graphql`
  query PaymentMethodQuery($userId: ID!, $debtId: ID!) {
    user(_id: $userId) {
      _id
      name
    }
    debt(_id: $debtId) {
      value
      cashback
      numberOfInstallments
      tax {
        value
      }
    }
  }
`;

const screenHeight = Dimensions.get("window").height;
const height = screenHeight - 220;

const immediateRefund = (value: number, cashback: number) => {
  return Math.floor((value / 100) * cashback).toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
};

const Flag = ({
  title,
  text,
  bgColor,
}: {
  title: string;
  text: string;
  bgColor: string;
}) => {
  return (
    <View
      style={[
        styles.flexDirection_row,
        styles.flag,
        styles.bgColor_darkBlue,
        styles.position_relative,
      ]}
    >
      <Text
        style={[
          styles.bold,
          styles.marginR_5,
          styles.color_white,
          styles.fontSize_12,
        ]}
      >
        {title}
      </Text>
      <Text style={[styles.color_white, styles.fontSize_12]}>{text}</Text>
      <View
        style={[
          styles.triangle,
          styles.bgColor_white,
          styles.position_absolute,
          styles.size_20,
          { backgroundColor: bgColor },
        ]}
      ></View>
    </View>
  );
};

type SelectPaymentType = {
  flag?: { title: string; text: string } | null;
  select: number | null;
  borderRadius?: any;
  setSelect: React.Dispatch<React.SetStateAction<number | null>>;
  cashback?: number | null;
  onNavigate?: () => void;
  valueTotal?: string;
  titleCategory?: React.ReactNode | null;
  installmentValue: string;
  quantityInstallments: number;
};

const SelectPayment = ({
  flag,
  select,
  cashback,
  setSelect,
  onNavigate,
  valueTotal,
  borderRadius,
  titleCategory,
  installmentValue,
  quantityInstallments,
}: SelectPaymentType) => {
  const handleClickDebounce = useDebounce(() => {
    onNavigate ? onNavigate() : null;
  }, 500);

  const selected = select === quantityInstallments;

  return (
    <Pressable
      style={[
        styles.borderWidth_1,
        styles.selectPaymentContainer,
        styles.fullWidth,
        styles.position_relative,
        selected && styles.selectedElement,
        borderRadius.start,
        borderRadius.end,
        {
          zIndex: selected ? 1 : 0,
          marginTop: quantityInstallments === 2 ? 25 : -1,
        },
      ]}
      onPress={() => {
        setSelect(quantityInstallments);
        handleClickDebounce();
      }}
    >
      {titleCategory && (
        <View style={[styles.titleCategoryContainer, styles.position_absolute]}>
          {titleCategory}
        </View>
      )}
      <View
        style={[styles.flexDirection_row, styles.justifyContent_spaceBetween]}
      >
        <Text style={styles.fontSize_18}>
          <Text style={styles.bold}>{quantityInstallments}x</Text> R${" "}
          {installmentValue}
        </Text>
        <View
          style={[
            styles.size_20,
            styles.center,
            selected
              ? undefined
              : { ...styles.border_gray, ...styles.borderWidth_1 },
          ]}
        >
          {selected ? (
            <Octicons name="check-circle-fill" size={18} color="#00e2ae" />
          ) : null}
        </View>
      </View>
      {cashback ? (
        <Text style={[styles.fontSize_12, styles.cashback]}>
          Ganhe {cashback}% de Cashback
        </Text>
      ) : null}
      {valueTotal ? (
        <Text style={[styles.fontSize_12, styles.color_B9B8B9]}>
          Total: R$ {valueTotal}
        </Text>
      ) : null}
      {flag?.title ? (
        <Flag
          title={flag?.title}
          text={flag?.text}
          bgColor={selected ? "#f0fcf8" : "#FFFF"}
        />
      ) : null}
    </Pressable>
  );
};

const title = ["Pix", "Pix Parcelado"];
export default function PaymentMethod() {
  const [params] = useSearchParams();
  const [select, setSelect] = useState<number | null>(null);
  const navigate = useNavigate();
  const userId = params.get("userId") || "64b83a4d339c9a6a82a5e8fe"; // Adicione seu valor padrão aqui
  const debtId = params.get("debtId") || "64b1ab19ffc4fcdd475daff9"; // Adicione seu valor padrão aqui

  const query = useLazyLoadQuery<PaymentMethodQueryType>(PaymentMethodQuery, {
    userId,
    debtId,
  });

  const { isValid } = useValidation(
    {
      debtId,
      userId,
      ...query.debt,
      ...query.user,
    },
    [userId, debtId]
  );

  const name = query.user?.name;
  const value = query?.debt?.value || 0;
  const numberOfInstallments = query?.debt?.numberOfInstallments || 0;
  const tax = query?.debt?.tax?.value || 0;
  const cashback = query?.debt?.cashback || 0;

  const renderList = useCallback(
    (idx: number) => {
      const installments = idx + 1;

      const borderRadius = useMemo(() => {
        const start =
          installments === 1 || installments === 2
            ? styles.borderStartRadius
            : {};

        const end =
          installments === 1 || installments === 7
            ? styles.borderEndRadius
            : {};

        return { start, end };
      }, [idx]);

      const { totalString, quantityInstallments, refund } = useMemo(() => {
        const total =
          installments === 1 ? value : calculatedTotal(value, tax, idx);

        const totalString =
          installments !== 1 ? formatNumberInString(total) : undefined;

        const quantityInstallments = formatNumberInString(
          installments === 1 ? value : total / installments
        );

        const refund = immediateRefund(value, cashback);
        return { totalString, quantityInstallments, refund };
      }, [tax, idx, value]);

      const flag = useMemo(() => {
        const flagObject = {
          0: {
            title: `🤑 ${refund}`,
            text: "de volta no seu Pix na hora",
          },
          3: {
            title: `-${Math.ceil((1 + tax / 100) ** 3)} % de juros`,
            text: "Melhor opção de parcelamento",
          },
        };

        return cashback || installments !== 1 ? flagObject[idx] : null;
      }, [refund, tax]);

      const cashbackPercentage = useMemo(() => {
        return installments === 1 ? cashback * 100 : undefined;
      }, []);

      return (
        <SelectPayment
          borderRadius={borderRadius}
          key={idx}
          titleCategory={
            title[idx] ? (
              <View style={styles.titleCategory}>
                <Text style={styles.bold}>{title[idx]}</Text>
              </View>
            ) : null
          }
          installmentValue={quantityInstallments}
          valueTotal={totalString}
          quantityInstallments={installments}
          cashback={cashbackPercentage}
          flag={flag}
          select={select}
          setSelect={setSelect}
          onNavigate={() => {
            isValid
              ? navigate(
                  `/pix?userId=${userId}&debtId=${debtId}&installment=${idx}`
                )
              : null;
          }}
        />
      );
    },
    [select]
  );

  const {
    scrollView,
    main,
    titleContainer,
    titleStyle,
    paymentOptionsContainer,
    errorContainer,
  } = useMemo(
    () => ({
      scrollView: [styles.marginTopBottom_20, styles.fullWidth, styles.flex_1],
      main: [
        styles.flex_1,
        styles.bgColor_white,
        styles.fullWidth,
        styles.alignItems_center,
        styles.minH_full,
      ],
      titleContainer: [styles.marginTopBottom_20, styles.center],
      titleStyle: [styles.bold, styles.title, styles.textCenter],
      paymentOptionsContainer: [styles.fullWidth, styles.padding_10],
      errorContainer: [styles.center, styles.flex_1],
    }),
    []
  );

  return (
    <ScrollView style={scrollView}>
      <SafeAreaView style={main}>
        <Header />
        <View style={titleContainer}>
          {isValid && (
            <Text style={titleStyle}>{name}, como você quer pagar?</Text>
          )}
        </View>
        {isValid ? (
          <View style={paymentOptionsContainer}>
            {Array.from({ length: numberOfInstallments }).map((_, idx) =>
              renderList(idx)
            )}
          </View>
        ) : (
          <View style={errorContainer}>
            <Text style={styles.bold}>Lamentamos, mas ocorreu um erro</Text>
          </View>
        )}
        <Footer />
      </SafeAreaView>
    </ScrollView>
  );
}
