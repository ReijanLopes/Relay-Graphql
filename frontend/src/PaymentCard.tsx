import { useCallback, useMemo, useState } from "react";
import { ScrollView, SafeAreaView, View, Text, Pressable } from "react-native";
import { useLazyLoadQuery, graphql, useMutation } from "react-relay";
import { Formik } from "formik";
import { useSearchParams, useNavigate } from "react-router-native";

import Header from "./components/Header";
import Footer from "./components/Footer";
import TextInput from "./components/TextInput";
import Select from "./components/Select";
import Info from "./Info";
import {
  maskCPF,
  maskCardNumber,
  maskValidate,
  formatNumberInString,
  maskCVV,
  formatExpiringInDate,
} from "./utils";

import useCardMutation from "./hooks/useCardMutation";

import styles from "./styles";

import type { PaymentCardQuery as PaymentCardQueryType } from "./__generated__/PaymentCardQuery.graphql";
import type {
  PaymentCardMutation as PaymentCardMutationType,
  InstallmentsInput,
  CardInput,
} from "./__generated__/PaymentCardMutation.graphql";

const PaymentCardQuery = graphql`
  query PaymentCardQuery($debtId: ID!) {
    debt(_id: $debtId) {
      _id
      value
      tax {
        value
      }
      installments {
        status
        idMonth
        value
        expires
      }
      user {
        _id
        name
      }
      card {
        _id
        name
        number
        cpf
        expiration
        cvv
      }
      ...Info_DebtFragment
    }
  }
`;

const validate = {
  name: {
    error: "Nome é necessário",
    validate: /^[A-Za-z ]+$/,
  },
  number: {
    error: "Número do cartão é necessário",
    validate: /^\d{4}\.\d{4}\.\d{4}\.\d{4}$/,
  },
  cpf: {
    error: "CPF é necessário",
    validate: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/,
  },
  expiration: {
    error: "Data de expiração é necessário",
    validate: /^\d{2}\/\d{2}$/,
  },
  cvv: { error: "Código de segurança é necessário", validate: /^\d{3}$/ },
  installmentLength: {
    error: "As parcelas que serão pagas nesse cartão são obrigatórias",
    validate: /^.*$/,
  },
};

type Key =
  | "name"
  | "number"
  | "cpf"
  | "expiration"
  | "cvv"
  | "installmentLength";

type Values = CardInput & {
  installments?: ReadonlyArray<InstallmentsInput | null> | null;
};

const validationErrors = (values: Values) => {
  const errors = {};
  const keys = Object.keys(validate) as Key[];
  keys.map((key) => {
    const validating =
      key != "installmentLength"
        ? validate?.[key]?.validate?.test(values?.[key])
        : values?.[key].length;
    if (!values?.[key] || !validating) {
      errors[key] = validate?.[key]?.error;
    }
  });

  return errors;
};

const createOptions = (installments: readonly (InstallmentsInput | null)[]) => {
  return (
    installments.map((item) => ({
      value: String(item?.idMonth),
      label: `${item?.idMonth}x ${formatNumberInString(item?.value || 0)}`,
      status: item?.status,
    })) || []
  );
};

const formattingPlots = (
  installments: readonly (InstallmentsInput | null)[],
  filter?: string
) => {
  if (filter) {
    const installmentsFilter = installments.filter(
      (item) => item?.status !== filter
    );
    const unpaid = installments?.length - installmentsFilter?.length;

    const res = installmentsFilter.map((item) => {
      const { idMonth, ...res } = item;
      return { ...res, idMonth: idMonth ? idMonth - unpaid : 0 };
    });
    return createOptions(res);
  }

  return createOptions(installments);
};

export default function PaymentCard() {
  const [params] = useSearchParams();
  const debtId = String(params.get("debtId"));

  const query = useLazyLoadQuery<PaymentCardQueryType>(PaymentCardQuery, {
    debtId,
  });

  const { installments, submit, isInFlight, error } = useCardMutation(
    query?.debt?.installments
  );

  const name = query?.debt?.user?.name;

  const portion = installments?.length || 0;

  const cardLength = query?.debt?.card ? query?.debt?.card?.length - 1 : 0;
  const cpf = query?.debt?.card?.[cardLength]?.cpf;
  const number = query?.debt?.card?.[cardLength]?.number;
  const cvv = query?.debt?.card?.[cardLength]?.cvv;
  const expiration = query?.debt?.card?.[cardLength]?.expiration;
  const idCard = query?.debt?.card?.[cardLength]?._id;
  const idUser = query?.debt?.user?._id;
  const idDebt = query?.debt?._id;

  const installmentFilter = formattingPlots(installments, "paid");
  const installmentPayment = formattingPlots(installments);

  const { title, expirationString } = useMemo(() => {
    const expirationString = formatExpiringInDate(Number(expiration));
    const title =
      portion > 1
        ? `pague a parcela ${portion - 1}x no cartão`
        : `pague o restante em ${portion - 1}x no cartão`;

    return { title, expirationString };
  }, [portion, expiration]);

  const {
    main,
    container,
    containerTitle,
    titleStyle,
    containerCvvAndExpiration,
    containerInputs,
    containerError,
    buttonSubmit,
  } = useMemo(
    () => ({
      main: [styles.fullWidth, styles.padding_10, styles.marginTopBottom_20],
      container: [
        styles.bgColor_white,
        styles.flex_1,
        styles.fullWidth,
        styles.alignItems_center,
      ],
      containerTitle: [
        styles.marginTopBottom_20,
        styles.fullWidth,
        styles.center,
      ],
      titleStyle: [
        styles.bold,
        styles.title,
        styles.textCenter,
        styles.alignItems_center,
      ],
      containerCvvAndExpiration: [
        styles.gap_20,
        styles.justifyContent_spaceBetween,
        styles.fullWidth,
        styles.flexDirection_row,
      ],
      containerInputs: [styles.gap_20, styles.fullWidth],
      containerError: [styles.center, styles.fullWidth],
      buttonSubmit: [
        styles.bgColor_darkBlue,
        styles.center,
        styles.buttonFormCard,
      ],
    }),
    []
  );

  return (
    <ScrollView style={main}>
      <SafeAreaView style={container}>
        <Header />
        <View style={containerTitle}>
          <Text style={titleStyle}>
            {name}, {title}
          </Text>
        </View>

        <Formik
          initialValues={{
            name,
            cpf,
            number,
            expiration: expirationString,
            cvv: cvv,
            installmentLength: installments?.length,
          }}
          validate={(values) => {
            return validationErrors(values);
          }}
          onSubmit={(values) => {
            submit({
              ...values,
              idCard,
              idUser,
              idDebt,
              defaultNumber: number,
            });
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors }) => (
            <View style={containerInputs}>
              <TextInput
                value={values?.name}
                placeholder="Digite o nome completo"
                label="Nome completo"
                onChange={handleChange("name")}
                onBlur={handleBlur("name")}
                error={errors?.name}
              />
              <TextInput
                value={values?.cpf}
                placeholder="Digite o CPF"
                label="CPF"
                onChange={handleChange("cpf")}
                onBlur={handleBlur("cpf")}
                mask={maskCPF}
                error={errors?.cpf}
              />
              <TextInput
                value={values?.number}
                placeholder="Exemplo: 000.000.000-00"
                label="Número de cartão"
                onChange={handleChange("number")}
                onBlur={handleBlur("number")}
                mask={maskCardNumber}
                error={errors?.number}
              />
              <View style={containerCvvAndExpiration}>
                <TextInput
                  width="45%"
                  value={values?.expiration}
                  placeholder="Exemplo: 00/00"
                  label="Vencimento"
                  onChange={handleChange("expiration")}
                  onBlur={handleBlur("expiration")}
                  mask={maskValidate}
                  error={errors?.expiration}
                />
                <TextInput
                  width="45%"
                  value={values?.cvv ? String(values.cvv) : ""}
                  placeholder="Exemplo: 000"
                  label="CVV"
                  onChange={handleChange("cvv")}
                  onBlur={handleBlur("cvv")}
                  mask={maskCVV}
                  error={errors?.cvv}
                />
              </View>

              <Select
                options={installmentFilter}
                defaultValue={
                  installmentFilter?.[installmentFilter?.length - 1]
                }
                label="Parcelas"
                onChange={handleChange("installmentLength")}
                onBlur={handleBlur("installmentLength")}
                error={errors?.installmentLength}
              />
              <Pressable
                style={buttonSubmit}
                onPress={() => {
                  handleSubmit();
                }}
              >
                <Text style={styles.color_white}>
                  {isInFlight ? "Carregando..." : "Pagar"}{" "}
                </Text>
              </Pressable>
            </View>
          )}
        </Formik>
        {error ? (
          <View style={containerError}>
            <Text style={styles.color_red}>Houve algum erro</Text>
          </View>
        ) : null}

        <Info
          data={query?.debt}
          installmentPayment={installmentPayment}
          installmentLength={installments.length}
        />
        <Footer />
      </SafeAreaView>
    </ScrollView>
  );
}
