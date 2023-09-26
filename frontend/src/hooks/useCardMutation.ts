import { useCallback, useState } from "react";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";

import type {
  useCardMutation as useCardMutationType,
  InstallmentsInput,
  CardInput,
  DebtInput,
} from "./__generated__/useCardMutation.graphql";
import { useNavigate } from "react-router-native";

const PaymentCardMutation = graphql`
  mutation useCardMutation($inputCard: CardInput, $inputDebt: DebtInput) {
    createAndUpdateCard(input: $inputCard) {
      _id
    }
    createAndUpdateDebt(input: $inputDebt) {
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

type Variables = CardInput &
  DebtInput & {
    installmentLength?: number;
    defaultNumber?: string | null;
    idCard?: string | null;
    idUser?: string | null;
    idDebt?: string | null;
  };

const createInstallment = (
  installments?: readonly (InstallmentsInput | null)[] | null,
  selectedPlots: number = 0,
  number?: string | null
) => {
  return installments?.map(({ status, cardNumber, ...res }) => {
    if (status != "paid" && selectedPlots > 0) {
      selectedPlots = selectedPlots - 1;
      return { ...res, status: "paid", cardNumber: number };
    }
    return { ...res, status, cardNumber };
  });
};

const transformInstallment = (
  installmentLength?: number,
  installments?: readonly (InstallmentsInput | null)[] | null,
  cardNumber?: string | null
) => {
  const install = createInstallment(
    installments,
    installmentLength,
    cardNumber
  );
  const HowManyInstallmentsWerePaid =
    install?.filter((item) => item.status === "onTime").length || 0;
  return { install, HowManyInstallmentsWerePaid };
};

const useCardMutation = (
  defaultInstallments: readonly (InstallmentsInput | null)[] | null | undefined
) => {
  const [commit, isInFlight] =
    useMutation<useCardMutationType>(PaymentCardMutation);
  const [error, setError] = useState<Error | null>(null);
  const [installments, setInstallments] = useState(defaultInstallments || []);

  const navigate = useNavigate();

  const submit = useCallback(
    ({
      cvv,
      number,
      defaultNumber,
      installmentLength,
      idCard,
      idUser,
      idDebt,
      ...values
    }: Variables) => {
      const { HowManyInstallmentsWerePaid, install } = transformInstallment(
        installmentLength,
        installments,
        number
      );

      const cardValidation = defaultNumber == number ? { card: idCard } : null;
      commit({
        variables: {
          inputCard: {
            ...values,
            cvv: Number(cvv),
            _id: defaultNumber == number ? idCard : null,
            user: idUser,
            debts: idDebt,
          },
          inputDebt: {
            _id: idDebt,
            installments: install,
            ...cardValidation,
          },
        },
        onCompleted(item) {
          setInstallments(item?.createAndUpdateDebt?.installments || []);
          if (HowManyInstallmentsWerePaid <= 0) {
            navigate("/confirmed");
          }
        },
        onError(error) {
          setError(error);
        },
      });
    },
    [isInFlight, installments, defaultInstallments]
  );

  return { submit, error, installments, isInFlight };
};

export default useCardMutation;
