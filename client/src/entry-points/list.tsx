import React from "react";
import ReactDOM from "react-dom";
import { Catalogue } from "../pages";
import { ApolloProvider } from "@apollo/client";
import client from "../graphql/clientConfig";

import "react-datepicker/dist/react-datepicker.css";
import "bootstrap/dist/css/bootstrap.css";
import "../index.css";

ReactDOM.hydrate(
  <ApolloProvider client={client}>
    <React.StrictMode>
      <Catalogue />
    </React.StrictMode>
  </ApolloProvider>,
  document.getElementById("root"),
);
