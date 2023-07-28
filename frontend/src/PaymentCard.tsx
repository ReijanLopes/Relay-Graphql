import { useMemo, useState } from "react";
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

import styles from "./styles";

import type { PaymentCardQuery as PaymentCardQueryType } from "./__generated__/PaymentCardQuery.graphql";
import type { PaymentCardMutation as PaymentCardMutationType } from "./__generated__/PaymentCardMutation.graphql";

const PaymentCardQuery = graphql`
  query PaymentCardQuery($debtId: ID!) {
    getDebt(_id: $debtId) {
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

const PaymentCardMutation = graphql`
  mutation PaymentCardMutation($input: CardInput) {
    mutationCard(input: $input) {
      _id
    }
  }
`;

const textErrors = {
  name: "Nome é necessário",
  number: "Número do cartão é necessário",
  cpf: "CPF é necessário",
  expiration: "Data de expiração é necessário",
  cvv: "Código de segurança é necessário",
};

type Error = {
  errorSubmit?: string;
  name: string;
  cpf: string;
  number: string;
  cvv: string;
  expiration: string;
};

export default function PaymentCard() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const debtId = params.get("debtId");

  const [error, setError] = useState<Error | null>(null);

  const query = useLazyLoadQuery<PaymentCardQueryType>(PaymentCardQuery, {
    debtId,
  });
  const [commit, isInFlight] =
    useMutation<PaymentCardMutationType>(PaymentCardMutation);

  const installment = query?.getDebt?.installments || [];

  const { installmentFilter, installmentPayment } = useMemo(() => {
    const installmentPayment =
      installment.map(({ idMonth, value, status }) => ({
        value: String(idMonth),
        label: `${idMonth}x ${formatNumberInString(value)}`,
        status,
      })) || [];

    const installmentFilter = installmentPayment.filter(
      ({ status }: { status: string }) => (status != "Paid" ? status : null)
    );

    return { installmentFilter, installmentPayment };
  }, [installment]);

  const name = query?.getDebt?.user?.name;
  const expiration = query?.getDebt?.card?.expiration;
  const portion = installment?.length || 0;

  const { title, expirationString } = useMemo(() => {
    const expirationString = formatExpiringInDate(Number(expiration));
    const title =
      portion > 1
        ? `pague a parcela ${portion}x no cartão`
        : `pague o restante em ${portion}x no cartão`;

    return { title, expirationString };
  }, [portion, expiration]);

  return (
    <ScrollView
      style={[styles.fullWidth, styles.padding_10, styles.marginTopBottom_20]}
    >
      <SafeAreaView
        style={[
          styles.bgColor_white,
          styles.flex_1,
          styles.fullWidth,
          styles.alignItems_center,
        ]}
      >
        <Header />
        <View
          style={[styles.marginTopBottom_20, styles.fullWidth, styles.center]}
        >
          <Text
            style={[
              styles.bold,
              styles.title,
              styles.textCenter,
              styles.alignItems_center,
            ]}
          >
            {name}, {title}
          </Text>
        </View>

        <Formik
          initialValues={{
            name: query?.getDebt?.card?.name,
            cpf: query?.getDebt?.card?.cpf,
            number: query?.getDebt?.card?.number,
            expiration: expirationString,
            cvv: query?.getDebt?.card?.cvv,
            installment: installment,
          }}
          validate={(values) => {
            for (const key in values) {
              if (!values?.[key]) {
                setError((e) => ({ ...e, [key]: textErrors?.[key] }));
              }
            }
          }}
          onSubmit={({ installment, ...values }) => {
            commit({
              variables: {
                input: {
                  ...values,
                  _id: query?.getDebt?.card?._id,
                  user: query?.getDebt?.user?._id,
                  debts: query?.getDebt?._id,
                },
              },
              onCompleted() {
                navigate("/confirmed");
              },
              onError(error) {
                setError((e) => ({ ...e, errorSubmit: error }));
              },
            });
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values }) => (
            <View style={[styles.gap_20, styles.fullWidth]}>
              <TextInput
                value={values?.name}
                placeholder="Digite o nome completo"
                label="Nome completo"
                onChange={handleChange("name")}
                onBlur={handleBlur("name")}
                error={error?.name}
              />
              <TextInput
                value={values?.cpf}
                placeholder="Digite o CPF"
                label="CPF"
                onChange={handleChange("cpf")}
                onBlur={handleBlur("cpf")}
                mask={maskCPF}
                error={error?.cpf}
              />
              <TextInput
                value={values?.number}
                placeholder="Exemplo: 000.000.000-00"
                label="Número de cartão"
                onChange={handleChange("number")}
                onBlur={handleBlur("number")}
                mask={maskCardNumber}
                error={error?.number}
              />
              <View
                style={[
                  styles.gap_20,
                  styles.justifyContent_spaceBetween,
                  styles.fullWidth,
                  styles.flexDirection_row,
                ]}
              >
                <TextInput
                  width="45%"
                  value={values?.expiration}
                  placeholder="Exemplo: 00/00"
                  label="Vencimento"
                  onChange={handleChange("expiration")}
                  onBlur={handleBlur("expiration")}
                  mask={maskValidate}
                  error={error?.expiration}
                />
                <TextInput
                  width="45%"
                  value={values?.cvv ? String(values.cvv) : ""}
                  placeholder="Exemplo: 000"
                  label="CVV"
                  onChange={handleChange("cvv")}
                  onBlur={handleBlur("cvv")}
                  mask={maskCVV}
                  error={error?.cvv}
                />
              </View>

              <Select
                options={installmentFilter}
                label="Parcelas"
                onChange={handleChange("installment")}
                onBlur={handleBlur("installment")}
              />
              <Pressable
                style={[
                  styles.bgColor_darkBlue,
                  styles.center,
                  styles.buttonFormCard,
                ]}
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
        {error?.errorSubmit ? (
          <View style={[styles.center, styles.fullWidth]}>
            <Text style={styles.color_red}>Houve algum erro</Text>
          </View>
        ) : null}

        <Info
          data={query?.getDebt}
          installmentPayment={installmentPayment}
          installmentLength={installment.length}
        />
        <Footer />
      </SafeAreaView>
    </ScrollView>
  );
}
