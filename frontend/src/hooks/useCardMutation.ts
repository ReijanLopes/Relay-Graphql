import { useCallback, useState } from "react";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";

import type {
  PaymentCardMutation as PaymentCardMutationType,
  InstallmentsInput,
  CardInput,
  DebtInput,
} from "../__generated__/PaymentCardMutation.graphql";
import { useNavigate } from "react-router-native";

const PaymentCardMutation = graphql`
  mutation useCardMutation($inputCard: CardInput, $inputDebt: DebtInput) {
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
  selectedPlots: number = 0
) => {
  return installments?.map(({ status, ...res }) => {
    if (status != "paid" && selectedPlots > 0) {
      selectedPlots = selectedPlots - 1;
      return { ...res, status: "paid" };
    }
    return { ...res, status };
  });
};

const transformInstallment = (
  installmentLength?: number,
  installments?: readonly (InstallmentsInput | null)[] | null
) => {
  const install = createInstallment(installments, installmentLength);
  const HowManyInstallmentsWerePaid =
    install?.filter((item) => item.status === "onTime").length || 0;
  return { install, HowManyInstallmentsWerePaid };
};

const useCardMutation = (
  defaultInstallments: readonly (InstallmentsInput | null)[] | null | undefined
) => {
  const [commit, isInFlight] =
    useMutation<PaymentCardMutationType>(PaymentCardMutation);
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
        installments
      );
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
            card: defaultNumber == number ? idCard : null,
          },
        },
        onCompleted(item) {
          setInstallments(item?.mutationDebt?.installments || []);
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
