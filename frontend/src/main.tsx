import "./global.css";

import { StyleProvider } from "@ant-design/cssinjs";
import { App as AntApp, ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { AuthLoading } from "./componenets";
import { AuthProvider } from "./contexts";
import { MessageProvider } from "./contexts/MessageProvider";
import { store } from "./redux";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <StyleProvider layer>
          <ConfigProvider>
            <AntApp>
              <MessageProvider />
              <AuthLoading />
            </AntApp>
          </ConfigProvider>
        </StyleProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
