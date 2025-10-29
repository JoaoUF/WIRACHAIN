import "./global.css";

import { StyleProvider } from "@ant-design/cssinjs";
import { App as AntApp, ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { AuthProvider } from "./contexts";
import { store } from "./redux";
import { router } from "./routers";
import { MessageProvider } from "./utils/message";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <StyleProvider layer>
          <ConfigProvider>
            <AntApp>
              <MessageProvider />
              <RouterProvider router={router} />
            </AntApp>
          </ConfigProvider>
        </StyleProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
