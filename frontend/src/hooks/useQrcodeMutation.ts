import { useCallback, useState } from "react";
import { useMutation } from "react-relay";
import { graphql } from "relay-runtime";

import type {
  useQrcodeMutation as useQrcodeMutationType,
  DebtInput,
  UserInput,
} from "./__generated__/useQrcodeMutation.graphql";
import { useNavigate } from "react-router-native";

const QrCodeMutation = graphql`
  mutation useQrcodeMutation($inputDebt: DebtInput, $inputUser: UserInput) {
    createAndUpdateDebt(input: $inputDebt) {
      value
      cashback
    }
    createAndUpdateUser(input: $inputUser) {
      _id
    }
  }
`;

interface Variables {
  inputDebt: DebtInput;
  inputUser: UserInput;
}

const useQrCodeMutation = (variables: Variables, url: string) => {
  const [commit] = useMutation<useQrcodeMutationType>(QrCodeMutation);
  const [error, setError] = useState<Error | null>(null);

  const navigate = useNavigate();

  const submit = useCallback(() => {
    commit({
      variables,
      onCompleted() {
        navigate(url);
      },
      onError(error) {
        setError(error);
      },
    });
  }, [variables, url]);

  return { submit, error };
};

export default useQrCodeMutation;
