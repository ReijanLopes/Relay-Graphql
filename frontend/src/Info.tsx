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

type installment = {
  value: string;
  label: string;
  status: string | null | undefined;
};

type InfoType = {
  data: Info_DebtFragment$key;
  select: number;
  installmentLength: number;
  installmentPayment?: installment[];
};

type StepsType = {
  idx: number;
  length: number;
  selected: boolean;
  completed: boolean;
  valueOfInstallments: string;
};

const Steps = ({
  idx,
  length,
  selected,
  completed,
  valueOfInstallments,
}: StepsType) => {
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

const howWorks = [
  "1˚ - Abra o app do seu banco",
  "2˚ - Escolha pagar via pix",
  "3˚ - Copie e cole o código do pagamento ou escaneie o QR Code",
];

const List = ({ text }: { text: string }) => {
  return <Text style={styles.fontSize_12}>{text}</Text>;
};

const createOptions = (
  installmentLength: number,
  valueOfInstallmentsString: string
) => {
  return (
    Array.from({ length: installmentLength + 1 }).map((_, idx: number) => ({
      value: String(idx),
      label: `${idx}x ${valueOfInstallmentsString}`,
      status: "onTime",
    })) || []
  );
};

export default function Info({
  data,
  select = 1,
  installmentLength,
  installmentPayment,
}: InfoType) {
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
  }, [value, tax, installmentLength]);

  const renderSteps = useCallback(
    ({ status }: installment, idx: number) => {
      const completed = status == "paid";
      const selected = status != "paid" && select > 0;
      if (selected) {
        select = select - 1;
      }

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
    [textInstallments, valueOfInstallmentsString, installmentPayment]
  );

  const renderListHowWorks = useCallback(
    (text: string, idx: number) => <List key={idx} text={text} />,
    []
  );

  const renderList = useMemo(() => {
    return (installmentPayment?.length || 0) > 0
      ? installmentPayment?.map(renderSteps)
      : createOptions(installmentLength, valueOfInstallmentsString).map(
          renderSteps
        );
  }, [
    installmentLength,
    installmentPayment?.[installmentPayment?.length - 1],
    valueOfInstallmentsString,
  ]);

  const {
    container,
    containerCET,
    containerShowMore,
    containerID,
    label,
    textId,
  } = useMemo(
    () => ({
      container: [styles.fullWidth, styles.infoContainer],
      containerCET: [
        styles.justifyContent_spaceBetween,
        styles.paddingTopBottom_20,
        styles.flexDirection_row,
      ],
      containerShowMore: [
        styles.justifyContent_spaceBetween,
        styles.paddingTopBottom_20,
        styles.flexDirection_row,
      ],
      containerID: [styles.alignItems_center, styles.marginTopBottom_20],
      label: [styles.fontSize_12, styles.text_gray],
      textId: [styles.fontSize_12, styles.bold],
    }),
    []
  );

  return (
    <View style={container}>
      <View style={styles.fullWidth}>{renderList}</View>
      <Line />
      <View style={containerCET}>
        <Text>CET: {cet}%</Text>
        <Text>Total: {totalMoreTax}</Text>
      </View>

      <Line />
      <View style={containerShowMore}>
        <ShowMore title="Como Funciona" gap={5}>
          {howWorks.map(renderListHowWorks)}
        </ShowMore>
      </View>
      <Line />

      <View style={containerID}>
        <Text style={label}>Identificador:</Text>
        <Text style={textId}>{id}</Text>
      </View>
    </View>
  );
}
