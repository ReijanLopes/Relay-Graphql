import React, { useState, useEffect, useMemo, useCallback } from "react";
import "core-js/stable";
import { graphql, useFragment, useMutation } from "react-relay";
import { useOpenPix, Charge } from "@openpix/react";
import QRCode from "react-native-qrcode-svg";
import { useNavigate } from "react-router-native";

import { View, Text, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";

import {
  formatDate_DDMMYYYYHHMM,
  useDebounce,
  calculatingInstallmentValue,
} from "./utils";

import styles from "./styles";

import type { QrCode_DebtFragment$key as QrCode_DebtFragmentType } from "./__generated__/QrCode_DebtFragment.graphql";
import useQrCodeMutation from "./hooks/useQrcodeMutation";

const QrCodeFragment = graphql`
  fragment QrCode_DebtFragment on Debt {
    _id
    value
    cashback
    tax {
      value
    }
  }
`;

const createInstallment = (
  installment: number,
  valueOfInstallments: number
) => {
  const date = new Date();
  const currentMonth = date.getMonth();
  date.setDate(5);

  return Array.from({ length: installment + 1 }).map((_, idx: number) => ({
    status: idx === 0 ? "paid" : "onTime",
    idMonth: idx + 1,
    value: valueOfInstallments,
    expires: String(new Date(date.setMonth(currentMonth + (idx + 1)))),
  }));
};

const CustomQrCode = ({ brcode }: { brcode: any }) => (
  <>
    {brcode ? (
      <QRCode size={250} value={brcode} />
    ) : (
      <View style={styles.padding_30}>
        <Text style={styles.textCenter}>
          Houve algum erro na geração do QRcode
        </Text>
      </View>
    )}
  </>
);

type QrCodeType = {
  variables: QrCode_DebtFragmentType;
  setError: React.Dispatch<any>;
  installment: number;
  userId: string;
};

const QrCode = ({ variables, setError, installment, userId }: QrCodeType) => {
  const [charge, setCharge] = useState<Charge | null>(null);

  const fragmentData = useFragment<QrCode_DebtFragmentType>(
    QrCodeFragment,
    variables
  );
  const { _id: debtId, tax, cashback, value } = fragmentData;

  const url = useMemo(() => {
    return installment === 0
      ? "/confirmed"
      : `/card?userId=${userId}&debtId=${debtId}`;
  }, [installment, userId, debtId]);

  const { valueOfInstallments, totalMoreTax, installments } = useMemo(() => {
    const { valueOfInstallments, totalMoreTax } = calculatingInstallmentValue(
      value || 0,
      tax?.value || 0,
      installment
    );
    const installments = createInstallment(installment, valueOfInstallments);

    return { valueOfInstallments, totalMoreTax, installments };
  }, [value, tax, installment]);

  const cashDesk = useMemo(
    () => (installment === 0 ? totalMoreTax * (cashback || 0) : 0),
    [installment]
  );

  const { submit, error } = useQrCodeMutation(
    {
      inputDebt: {
        _id: debtId,
        totalValue: totalMoreTax,
        installments,
        user: userId,
      },
      inputUser: {
        _id: userId,
        debts: debtId,
        cashDesk: cashDesk,
      },
    },
    url
  );

  useEffect(() => {
    setError(error);
  }, [error]);

  const { chargeCreate } = useOpenPix({
    appID: process.env.APP_ID,
    submit,
  });

  const newCharge = useCallback(() => {
    const { charge, error } = chargeCreate({
      correlationID: debtId,
      value: valueOfInstallments,
      comment: "Donate",
    });

    setCharge(charge);

    if (error) {
      setError(error);
    } else if (charge) {
      handleExpires();
    }
  }, [chargeCreate, debtId, valueOfInstallments, setError]);

  useEffect(() => {
    newCharge();
  }, [newCharge]);

  const handleExpires = useDebounce(() => {
    newCharge();
  }, charge?.expiresIn);

  const timeRemainingInSeconds = useMemo(() => {
    return charge?.expiresIn
      ? formatDate_DDMMYYYYHHMM(charge?.expiresIn)
      : "00/00/0000 - 00:00";
  }, [charge?.expiresIn]);

  const copyToClipboard = useCallback(() => {
    const text = charge?.brcode
      ? charge?.brcode
      : "Copiar o QrCode não foi possível";
    Clipboard.setStringAsync(text);
  }, [charge?.brcode]);

  const {
    container,
    containerQrCode,
    buttonCopyQrCode,
    textCopy,
    containerTerm,
    title,
    text,
  } = useMemo(
    () => ({
      container: [styles.center, styles.fullWidth],
      containerQrCode: [
        styles.border_gray,
        styles.center,
        styles.QrCodeContainer,
        styles.borderWidth_2,
      ],
      textCopy: [styles.color_white, styles.fontSize_14, styles.marginR_5],
      buttonCopyQrCode: [
        styles.flag,
        styles.flexDirection_row,
        styles.bgColor_darkBlue,
        styles.center,
        styles.marginTop_10,
      ],
      containerTerm: [
        styles.marginTopBottom_20,
        styles.center,
        styles.fullWidth,
      ],
      title: [styles.fontSize_12, styles.text_gray],
      text: [styles.fontSize_12, styles.bold],
    }),
    []
  );

  return (
    <View style={container}>
      <View style={containerQrCode}>
        <CustomQrCode brcode={charge?.brcode} />
      </View>

      <Pressable
        style={buttonCopyQrCode}
        onPress={() => {
          submit();
          copyToClipboard();
        }}
      >
        <Text style={textCopy}>Clique para copiar QR CODE</Text>
        <MaterialIcons name="file-copy" size={18} color="white" />
      </Pressable>

      <View style={containerTerm}>
        <Text style={title}>Prazo de pagamento:</Text>
        <Text style={text}>{timeRemainingInSeconds}</Text>
      </View>
    </View>
  );
};

export default QrCode;
