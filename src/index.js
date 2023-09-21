import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux"; // Import Redux Provider
import { PersistGate } from "redux-persist/integration/react"; // Import PersistGate
import store, { persistor } from "./store/Store"; // Import your Redux store and persistor
import App from "App";

// Hr Management Dashboard React Context Provider
import { SoftUIControllerProvider } from "context";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <BrowserRouter>
        <SoftUIControllerProvider>
          <App />
        </SoftUIControllerProvider>
      </BrowserRouter>
    </PersistGate>
  </Provider>
);
