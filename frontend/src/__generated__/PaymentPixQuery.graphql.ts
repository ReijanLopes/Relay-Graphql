/**
 * @generated SignedSource<<daf692c979f22d30df0ed2e0a4429442>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Query } from 'relay-runtime';
export type PaymentPixQuery$variables = {
  debtId: string;
  userId: string;
};
export type PaymentPixQuery$data = {
  readonly getDebt: {
    readonly cashback: number | null;
    readonly tax: {
      readonly cet: number | null;
      readonly value: number | null;
    } | null;
    readonly value: number | null;
  } | null;
  readonly getUser: {
    readonly _id: string | null;
    readonly name: string | null;
  } | null;
};
export type PaymentPixQuery = {
  response: PaymentPixQuery$data;
  variables: PaymentPixQuery$variables;
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
    "name": "PaymentPixQuery",
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
    "name": "PaymentPixQuery",
    "selections": (v3/*: any*/)
  },
  "params": {
    "cacheID": "192137dd0e3d2d38f4f317f20e49c2ec",
    "id": null,
    "metadata": {},
    "name": "PaymentPixQuery",
    "operationKind": "query",
    "text": "query PaymentPixQuery(\n  $userId: ID!\n  $debtId: ID!\n) {\n  getUser(_id: $userId) {\n    _id\n    name\n  }\n  getDebt(_id: $debtId) {\n    value\n    cashback\n    tax {\n      value\n      cet\n    }\n  }\n}\n"
  }
};
})();

(node as any).hash = "a3daf96c5fb8af46eeccd1ff71095926";

export default node;
