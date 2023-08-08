import {
  Network,
  Observable,
  RequestParameters,
  Variables,
  Store,
  RecordSource,
  Environment,
  IEnvironment,
} from "relay-runtime";
import { createClient } from "graphql-ws";
import { Platform } from "react-native";

const port = process.env.REACT_APP_API_PORT || 4005;
const hostIos = process.env.HTTP_IOS;
const hostAndroid = process.env.HTTP_ANDROID;

const url =
  Platform.OS === "ios"
    ? `ws://${hostIos}:${port}/graphql`
    : `ws://${hostAndroid}:${port}/graphql`;

const wsClient = createClient({
  url,
});

function fetchOrSubscribe(
  operation: RequestParameters,
  variables: Variables
): Observable<any> {
  return Observable.create((sink) => {
    if (!operation.text) {
      return sink.error(new Error("Operation text cannot be empty"));
    }
    return wsClient.subscribe(
      {
        operationName: operation.name,
        query: operation.text,
        variables,
      },
      sink
    );
  });
}

export function createEnvironment(): IEnvironment {
  const network = Network.create(fetchOrSubscribe, fetchOrSubscribe);
  const store = new Store(new RecordSource());
  return new Environment({ store, network });
}
