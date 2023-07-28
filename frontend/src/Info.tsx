import { useMemo, useCallback } from "react";
import { View, Text } from "react-native";
import { Octicons } from "@expo/vector-icons";
import { graphql } from "relay-runtime";

import ShowMore from "./components/ShowMore";
import Line from "./components/Line";

import styles from "./styles";
import { useFragment } from "react-relay";

import { Info_DebtFragment$key } from "./__generated__/Info_DebtFragment.graphql";
import { calculatingInstallmentValue, formatNumberInString } from "./utils";

const textInstallments = ["entrada no Pix", "no cartão"];

const Steps = ({
  idx,
  length,
  selected,
  completed,
  valueOfInstallments,
}: {
  idx: number;
  length: number;
  selected: boolean;
  completed: boolean;
  valueOfInstallments: string;
}) => {
  return (
    <View
      style={[
        styles.justifyContent_spaceBetween,
        styles.marginBottom_15,
        styles.position_relative,
        styles.flexDirection_row,
      ]}
    >
      {idx < length - 1 ? (
        <View style={[styles.stepsLine, styles.position_absolute]} />
      ) : null}
      <View style={styles.flexDirection_row}>
        <View
          style={[
            styles.border_gray,
            styles.smallCircle,
            styles.borderWidth_2,
            selected && styles.selectedElement,
          ]}
        >
          {completed ? (
            <Octicons name="check-circle-fill" size={12} color="#00e2ae" />
          ) : null}
        </View>

        <Text>
          {idx + 1}ª {textInstallments[idx > 0 ? 1 : 0]}
        </Text>
      </View>

      <Text style={[styles.bold, styles.fontSize_14]}>
        R$ {valueOfInstallments}
      </Text>
    </View>
  );
};

const QrCodeFragment = graphql`
  fragment Info_DebtFragment on Debt {
    _id
    value
    tax {
      value
      cet
    }
  }
`;

export default function Info({
  data,
  installmentLength,
  installmentPayment = [{ value: null, label: "ontime", status: null }],
}: {
  data: Info_DebtFragment$key;
  installmentLength: number;

  installmentPayment?: Array<{
    value: string | null;
    label: string;
    status: string | null;
  }>;
}) {
  const fragmentData = useFragment<Info_DebtFragment$key>(QrCodeFragment, data);

  const id = fragmentData?._id;
  const cet = fragmentData?.tax?.cet;
  const tax = fragmentData?.tax?.value || 0;
  const value = fragmentData?.value || 0;

  const { totalMoreTax, valueOfInstallmentsString } = useMemo(() => {
    const { totalMoreTax, valueOfInstallmentsString } =
      calculatingInstallmentValue(value, tax, installmentLength);
    return {
      totalMoreTax: formatNumberInString(totalMoreTax),
      valueOfInstallmentsString,
    };
  }, []);

  const select = useMemo(() => {
    return installmentPayment?.[0].label
      ? installmentPayment?.find(({ status }) => status !== "paid")
      : { label: "ontime" };
  }, [installmentPayment?.[0].label, installmentPayment?.[0]?.status]);

  const renderSteps = useCallback(
    (_: any, idx: number) => {
      const completed = installmentPayment?.[idx]?.status === "paid";
      const selected = select?.label === installmentPayment?.[idx]?.label;

      return (
        <Steps
          key={idx}
          length={installmentLength}
          idx={idx}
          completed={completed}
          selected={completed || selected}
          valueOfInstallments={valueOfInstallmentsString}
        />
      );
    },
    [textInstallments, valueOfInstallmentsString]
  );

  return (
    <View style={[styles.fullWidth, styles.infoContainer]}>
      <View style={styles.fullWidth}>
        {Array.from({ length: installmentLength }).map(renderSteps)}
      </View>
      <Line />
      <View
        style={[
          styles.justifyContent_spaceBetween,
          styles.paddingTopBottom_20,
          styles.flexDirection_row,
        ]}
      >
        <Text>CET: {cet}%</Text>
        <Text>Total: {totalMoreTax}</Text>
      </View>

      <Line />
      <View
        style={[
          styles.justifyContent_spaceBetween,
          styles.paddingTopBottom_20,
          styles.flexDirection_row,
        ]}
      >
        <ShowMore title="Como Funciona" gap={5}>
          <Text style={styles.fontSize_12}>1˚ - Abra o app do seu banco</Text>
          <Text style={styles.fontSize_12}>2˚ - Escolha pagar via pix</Text>
          <Text style={styles.fontSize_12}>
            3˚ - Copie e cole o código do pagamento ou escaneie o QR Code
          </Text>
        </ShowMore>
      </View>
      <Line />

      <View style={[styles.alignItems_center, styles.marginTopBottom_20]}>
        <Text style={[styles.fontSize_12, styles.text_gray]}>
          Identificador:
        </Text>
        <Text style={[styles.fontSize_12, styles.bold]}>{id}</Text>
      </View>
    </View>
  );
}
