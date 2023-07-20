/**
 * @generated SignedSource<<34b787c557c7c5c18e1446cca42805f0>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type PaymentCardQuery$variables = {
  debtId: string;
};
export type PaymentCardQuery$data = {
  readonly getDebt: {
    readonly _id: string | null;
    readonly card: {
      readonly _id: string | null;
      readonly cpf: string | null;
      readonly cvv: number | null;
      readonly expiration: string | null;
      readonly name: string | null;
      readonly number: string | null;
    } | null;
    readonly installments: ReadonlyArray<{
      readonly expires: string | null;
      readonly idMonth: number | null;
      readonly status: string | null;
      readonly value: number | null;
    } | null> | null;
    readonly tax: {
      readonly cet: number | null;
      readonly value: number | null;
    } | null;
    readonly totalValue: number | null;
    readonly user: {
      readonly _id: string | null;
      readonly name: string | null;
    } | null;
    readonly value: number | null;
  } | null;
};
export type PaymentCardQuery = {
  response: PaymentCardQuery$data;
  variables: PaymentCardQuery$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "debtId"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "_id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "value",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v4 = [
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
      (v1/*: any*/),
      (v2/*: any*/),
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "totalValue",
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
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "cet",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "InstallmentsType",
        "kind": "LinkedField",
        "name": "installments",
        "plural": true,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "idMonth",
            "storageKey": null
          },
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "expires",
            "storageKey": null
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "UserType",
        "kind": "LinkedField",
        "name": "user",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "CardType",
        "kind": "LinkedField",
        "name": "card",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "number",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "cpf",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "expiration",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "cvv",
            "storageKey": null
          }
        ],
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
    "name": "PaymentCardQuery",
    "selections": (v4/*: any*/),
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PaymentCardQuery",
    "selections": (v4/*: any*/)
  },
  "params": {
    "cacheID": "f249ebed12f6e63e02bb3031edcfbc80",
    "id": null,
    "metadata": {},
    "name": "PaymentCardQuery",
    "operationKind": "query",
    "text": "query PaymentCardQuery(\n  $debtId: ID!\n) {\n  getDebt(_id: $debtId) {\n    _id\n    value\n    totalValue\n    tax {\n      value\n      cet\n    }\n    installments {\n      status\n      idMonth\n      value\n      expires\n    }\n    user {\n      _id\n      name\n    }\n    card {\n      _id\n      name\n      number\n      cpf\n      expiration\n      cvv\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "4f7585a61d5cf37224f40270c662f762";

export default node;
