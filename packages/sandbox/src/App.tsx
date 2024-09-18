import "./App.css";

import { ReactFlagsProvider } from "feature-flags-react";
import type { ReactNode } from "react";

import { flagsClient } from "./flags-client";
import Page from "./pages";

function App(): ReactNode {
  return (
    <ReactFlagsProvider client={flagsClient}>
      <Page />
    </ReactFlagsProvider>
  );
}

export default App;
