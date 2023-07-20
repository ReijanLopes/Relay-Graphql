/**
 * @generated SignedSource<<2709e24e42827cbd6171a9f7150cd56e>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type DebtInput = {
  _id?: string | null;
  card?: string | null;
  cashback?: number | null;
  cet?: number | null;
  createdAt?: string | null;
  installments?: ReadonlyArray<InstallmentsInput | null> | null;
  numberOfInstallments?: number | null;
  tax?: string | null;
  totalValue?: number | null;
  updatedAt?: string | null;
  user?: string | null;
  value?: number | null;
};
export type InstallmentsInput = {
  createdAt?: string | null;
  expires?: string | null;
  idMonth?: number | null;
  status?: string | null;
  updatedAt?: string | null;
  value?: number | null;
};
export type UserInput = {
  _id?: string | null;
  cards?: string | null;
  cashDesk?: number | null;
  createdAt?: string | null;
  debts?: string | null;
  email?: string | null;
  name?: string | null;
  updatedAt?: string | null;
};
export type QrCodeMutation$variables = {
  inputDebt?: DebtInput | null;
  inputUser?: UserInput | null;
};
export type QrCodeMutation$data = {
  readonly mutationDebt: {
    readonly cashback: number | null;
    readonly value: number | null;
  } | null;
  readonly mutationUser: {
    readonly _id: string | null;
  } | null;
};
export type QrCodeMutation = {
  response: QrCodeMutation$data;
  variables: QrCodeMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "inputDebt"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "inputUser"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "inputDebt"
      }
    ],
    "concreteType": "Debt",
    "kind": "LinkedField",
    "name": "mutationDebt",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "value",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "cashback",
        "storageKey": null
      }
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "inputUser"
      }
    ],
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "mutationUser",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "_id",
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "QrCodeMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "QrCodeMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "3adc45bfe2e9a5ca51e6c4233d4ca59a",
    "id": null,
    "metadata": {},
    "name": "QrCodeMutation",
    "operationKind": "mutation",
    "text": "mutation QrCodeMutation(\n  $inputDebt: DebtInput\n  $inputUser: UserInput\n) {\n  mutationDebt(input: $inputDebt) {\n    value\n    cashback\n  }\n  mutationUser(input: $inputUser) {\n    _id\n  }\n}\n"
  }
};
})();

(node as any).hash = "ff2f8a5b8f735258e6083bf86072485e";

export default node;
