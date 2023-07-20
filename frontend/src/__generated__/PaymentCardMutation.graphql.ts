/**
 * @generated SignedSource<<41831f6d6dad55d959795613a55668ae>>
 * @lightSyntaxTransform
 * @nogrep
 */

/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ConcreteRequest, Mutation } from 'relay-runtime';
export type CardInput = {
  _id?: string | null;
  cpf?: string | null;
  createdAt?: string | null;
  cvv?: number | null;
  debts?: string | null;
  expiration?: string | null;
  name?: string | null;
  number?: string | null;
  updatedAt?: string | null;
  user?: string | null;
};
export type PaymentCardMutation$variables = {
  input?: CardInput | null;
};
export type PaymentCardMutation$data = {
  readonly mutationCard: {
    readonly _id: string | null;
  } | null;
};
export type PaymentCardMutation = {
  response: PaymentCardMutation$data;
  variables: PaymentCardMutation$variables;
};

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "Card",
    "kind": "LinkedField",
    "name": "mutationCard",
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
    "name": "PaymentCardMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "PaymentCardMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "cacheID": "ed59833a4dc3d7d158c9b5ab6430064f",
    "id": null,
    "metadata": {},
    "name": "PaymentCardMutation",
    "operationKind": "mutation",
    "text": "mutation PaymentCardMutation(\n  $input: CardInput\n) {\n  mutationCard(input: $input) {\n    _id\n  }\n}\n"
  }
};
})();

(node as any).hash = "86e4f8ef9dba052581b83499f2b0108b";

export default node;
