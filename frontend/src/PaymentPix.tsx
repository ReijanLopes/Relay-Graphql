import { useMemo, useState } from "react";
import { ScrollView, SafeAreaView, Text, View } from "react-native";
import { useLazyLoadQuery, graphql } from "react-relay";

import { useSearchParams } from "react-router-native";

import Header from "./components/Header";
import Footer from "./components/Footer";
import Info from "./Info";
import QrCode from "./QrCode";

import { calculatingInstallmentValue } from "./utils";

import styles from "./styles";

import { PaymentPixQuery as PaymentPixQueryType } from "./__generated__/PaymentPixQuery.graphql";

const PaymentPixQuery = graphql`
  query PaymentPixQuery($userId: ID!, $debtId: ID!) {
    getUser(_id: $userId) {
      name
    }
    getDebt(_id: $debtId) {
      value
      ...QrCode_DebtFragment
      ...Info_DebtFragment
      tax {
        value
      }
    }
  }
`;

export default function PaymentPix() {
  const [params] = useSearchParams();
  const userId = params.get("userId") as string;
  const debtId = params.get("debtId") as string;
  const installment = Number(params.get("installment"));
  const query = useLazyLoadQuery<PaymentPixQueryType>(PaymentPixQuery, {
    userId,
    debtId,
  });
  const [qrCodeError, setQrCodeError] = useState(null);

  const name = query?.getUser?.name;
  const value = query.getDebt?.value || 0;
  const tax = query?.getDebt?.tax?.value || 0;

  const { valueOfInstallmentsString } = useMemo(
    () => calculatingInstallmentValue(value, tax, installment),
    [value, tax, installment]
  );

  return (
    <ScrollView
      style={[styles.fullWidth, styles.padding_10, styles.marginTopBottom_20]}
    >
      <SafeAreaView
        style={[
          styles.flex_1,
          styles.bgColor_white,
          styles.fullWidth,
          styles.alignItems_center,
        ]}
      >
        <Header />
        <View style={styles.marginTopBottom_20}>
          <Text
            style={[
              styles.bold,
              styles.title,
              styles.textCenter,
              styles.alignItems_center,
            ]}
          >
            {name}, pague a entrada de
          </Text>
          <Text
            style={[
              styles.bold,
              styles.title,
              styles.textCenter,
              styles.alignItems_center,
            ]}
          >
            R$ {valueOfInstallmentsString} pelo Pix
          </Text>
        </View>

        <QrCode
          variables={query?.getDebt}
          installment={installment}
          setError={setQrCodeError}
          userId={userId}
        />
        {qrCodeError ? (
          <View style={[styles.center, styles.fullWidth]}>
            <Text style={[styles.color_red, styles.fontSize_10]}>
              Ouve algum erro na criação do QrCode
            </Text>
          </View>
        ) : null}

        <Info data={query?.getDebt} installmentLength={installment + 1} />
        <Footer />
      </SafeAreaView>
    </ScrollView>
  );
}
