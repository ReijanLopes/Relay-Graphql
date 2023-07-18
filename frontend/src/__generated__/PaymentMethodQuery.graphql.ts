/**
 * @generated SignedSource<<cd9cd0554875e1a53f614390ef3a0fb0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type PaymentMethodQuery$variables = {
  debtId: string;
  userId: string;
};
export type PaymentMethodQuery$data = {
  readonly getDebt: {
    readonly cashback: number | null;
    readonly numberOfInstallments: number | null;
    readonly tax: {
      readonly value: number | null;
    } | null;
    readonly value: number | null;
  } | null;
  readonly getUser: {
    readonly _id: string | null;
    readonly name: string | null;
  } | null;
};
export type PaymentMethodQuery = {
  response: PaymentMethodQuery$data;
  variables: PaymentMethodQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "debtId"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "userId"
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "_id",
        "variableName": "userId"
      }
    ],
    "concreteType": "User",
    "kind": "LinkedField",
    "name": "getUser",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "_id",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "name",
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
        "name": "_id",
        "variableName": "debtId"
      }
    ],
    "concreteType": "Debt",
    "kind": "LinkedField",
    "name": "getDebt",
    "plural": false,
    "selections": [
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "cashback",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "numberOfInstallments",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "TaxType",
        "kind": "LinkedField",
        "name": "tax",
        "plural": false,
        "selections": [
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "PaymentMethodQuery",
    "selections": (v3/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "PaymentMethodQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "53c41f35a4ddb77e08b5921a3af2b7de",
    "id": null,
    "metadata": {},
    "name": "PaymentMethodQuery",
    "operationKind": "query",
    "text": "query PaymentMethodQuery(\n  $userId: ID!\n  $debtId: ID!\n) {\n  getUser(_id: $userId) {\n    _id\n    name\n  }\n  getDebt(_id: $debtId) {\n    value\n    cashback\n    numberOfInstallments\n    tax {\n      value\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "8cedd87550ceff444e9f2bc8e2f56c96";

export default node;
