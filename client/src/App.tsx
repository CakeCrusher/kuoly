import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home, Catalogue, CatalogueSelect, Api } from "./pages";
import { useQuery } from "@apollo/client";
import { MY_CATALOGUES } from "./graphql/schemas";
import { apolloHookErrorHandler } from "./utils/functions";

import "./App.less";
import { useMarkedForDeletion, useRemoveMFD } from "./state/store";
import { cache } from "./graphql/clientConfig";
import { Layout } from "./Layout";

const App = () => {
  const { removeMFD, setRemoveMFD } = useRemoveMFD();
  const { markedForDeletion, setMarkedForDeletion } = useMarkedForDeletion();
  const myCatalogues = useQuery(MY_CATALOGUES);
  apolloHookErrorHandler("App.tsx", myCatalogues.error);

  useEffect(() => {
    // handling undo and clearing of undo list
    if (
      removeMFD &&
      markedForDeletion.find(
        (mfd: MarkedForDeletion) => mfd.id === removeMFD.id
      )
    ) {
      const currentMFD = markedForDeletion.find(
        (mfd: MarkedForDeletion) => mfd.id === removeMFD.id
      )!;

      if (removeMFD.isUndo) {
        currentMFD.dependentCacheItems.forEach((dci: DependentCacheItems) => {
          cache.writeFragment(dci);
        });
      } else {
      }

      setMarkedForDeletion(
        markedForDeletion.filter(
          (mfd: MarkedForDeletion) => mfd.id !== removeMFD.id
        )
      );

      setRemoveMFD(null);
    }
  }, [removeMFD, setRemoveMFD, markedForDeletion, setMarkedForDeletion]);
  return (
    <div className="app">
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/api" element={<Api />} />
            <Route path="/catalogues" element={<CatalogueSelect />} />
            <Route path="/ctg/:corresponding_id/*" element={<Catalogue />} />
          </Routes>
        </Layout>
      </Router>
    </div>
  );
};

export default App;
