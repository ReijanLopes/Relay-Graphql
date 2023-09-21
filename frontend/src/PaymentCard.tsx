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

import styles from "./styles";

import type { PaymentCardQuery as PaymentCardQueryType } from "./__generated__/PaymentCardQuery.graphql";
import type {
  PaymentCardMutation as PaymentCardMutationType,
  InstallmentsInput,
  CardInput,
} from "./__generated__/PaymentCardMutation.graphql";

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
  mutation PaymentCardMutation($inputCard: CardInput, $inputDebt: DebtInput) {
    mutationCard(input: $inputCard) {
      _id
    }
    mutationDebt(input: $inputDebt) {
      _id
      installments {
        status
        idMonth
        value
        expires
      }
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
  installment: {
    error: "As parcelas que serão pagas nesse cartão são obrigatórias",
    validate: /^.*$/,
  },
};

const createInstallment = (
  installments: InstallmentsInput[],
  selectedPlots: number
) => {
  return installments.map(({ status, ...res }) => {
    if (status != "paid" && selectedPlots > 0) {
      selectedPlots = selectedPlots - 1;
      return { ...res, status: "paid" };
    }
    return { ...res, status };
  });
};

type Key = "name" | "number" | "cpf" | "expiration" | "cvv" | "installments";

type Values = CardInput & {
  installments?: ReadonlyArray<InstallmentsInput | null> | null;
};

const validationErrors = (values: Values) => {
  const errors = {};
  const keys = Object.keys(validate);
  keys.map((key: Key) => {
    const validating =
      key != "installments"
        ? validate?.[key]?.validate?.test(values?.[key])
        : values?.[key].length;
    if (!values?.[key] || !validating) {
      errors[key] = validate?.[key]?.error;
    }
  });

  return errors;
};

const createOptions = (installments: InstallmentsInput[]) => {
  return (
    installments.map(({ idMonth, value, status }) => ({
      value: String(idMonth),
      label: `${idMonth}x ${formatNumberInString(value || 0)}`,
      status,
    })) || []
  );
};

const formattingPlots = (
  installments: InstallmentsInput[],
  filter?: string
) => {
  if (filter) {
    const installmentsFilter = installments.filter(
      (item) => item.status !== filter
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
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const debtId = String(params.get("debtId"));

  const query = useLazyLoadQuery<PaymentCardQueryType>(PaymentCardQuery, {
    debtId,
  });
  const [commit, isInFlight] =
    useMutation<PaymentCardMutationType>(PaymentCardMutation);

  const [errorSubmit, setErrorSubmit] = useState<Error | null>(null);
  const [installments, setInstallments] = useState(
    query?.getDebt?.installments || []
  );

  const name = query?.getDebt?.user?.name;

  const portion = installments?.length || 0;

  const cardLength = query?.getDebt?.card
    ? query?.getDebt?.card?.length - 1
    : 0;
  const cpf = query?.getDebt?.card?.[cardLength]?.cpf;
  const cardNumber = query?.getDebt?.card?.[cardLength]?.number;
  const cvv = query?.getDebt?.card?.[cardLength]?.cvv;
  const expiration = query?.getDebt?.card?.[cardLength]?.expiration;
  const idCard = query?.getDebt?.card?.[cardLength]?._id;

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

  const transformInstallment = useCallback(
    (installment: number) => {
      const install = createInstallment(installments, installment);
      const HowManyInstallmentsWerePaid = install.filter(
        (item) => item.status === "onTime"
      ).length;
      return { install, HowManyInstallmentsWerePaid };
    },
    [installments]
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
            number: cardNumber,
            expiration: expirationString,
            cvv: cvv,
            installment: installments?.length,
          }}
          validate={(values) => {
            const errors = validationErrors(values);

            return errors;
          }}
          onSubmit={({ cvv, installment, number, ...values }) => {
            const { HowManyInstallmentsWerePaid, install } =
              transformInstallment(installment);
            commit({
              variables: {
                inputCard: {
                  ...values,
                  cvv: Number(cvv),
                  _id: cardNumber == number ? idCard : null,
                  user: query?.getDebt?.user?._id,
                  debts: query?.getDebt?._id,
                },
                inputDebt: {
                  _id: query?.getDebt?._id,
                  installments: install,
                  card: cardNumber == number ? idCard : null,
                },
              },
              onCompleted(item) {
                setInstallments(item?.mutationDebt?.installments || []);
                HowManyInstallmentsWerePaid <= 0
                  ? navigate("/confirmed")
                  : null;
              },
              onError(error) {
                setErrorSubmit(error);
              },
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
                onChange={handleChange("installment")}
                onBlur={handleBlur("installment")}
                error={errors?.installment}
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
        {errorSubmit ? (
          <View style={containerError}>
            <Text style={styles.color_red}>Houve algum erro</Text>
          </View>
        ) : null}

        <Info
          data={query?.getDebt}
          installmentPayment={installmentPayment}
          installmentLength={installments.length}
        />
        <Footer />
      </SafeAreaView>
    </ScrollView>
  );
}
