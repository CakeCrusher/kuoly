import { ApolloClient, InMemoryCache, split } from "@apollo/client";
import { WebSocketLink } from "@apollo/client/link/ws";
import { getMainDefinition } from "@apollo/client/utilities";
import { v4 as uuidv4 } from "uuid";
import { createUploadLink } from "apollo-upload-client";

const authorization = localStorage.getItem("authorization");
if (!authorization) {
  const newUuid = uuidv4();
  console.log("newUuid", newUuid);
  localStorage.setItem("authorization", newUuid);
}
console.log("authorization", authorization);

export const httpLink = createUploadLink({
  uri: window.location.origin + "/graphql",
  headers: {
    authorization: localStorage.getItem("authorization")
      ? localStorage.getItem("authorization")
      : "",
  },
});

const wsUri =
  process.env.NODE_ENV === "development"
    ? window.location.origin.replace(/^http/, "ws")
    : window.location.origin.replace(/^https/, "ws");
const wsLink = new WebSocketLink({
  uri: wsUri + "/graphql",
  options: {
    reconnect: true,
    connectionParams: {
      authToken: localStorage.getItem("authorization")
        ? localStorage.getItem("authorization")
        : "",
    },
  },
});
const splitLink = split(
  ({ query }) => {
    const definition = getMainDefinition(query);
    return (
      definition.kind === "OperationDefinition" &&
      definition.operation === "subscription"
    );
  },
  wsLink,
  // @ts-ignore
  httpLink
);

export const cache = new InMemoryCache();

export const client = new ApolloClient({
  link: splitLink,
  cache,
});

export default client;
