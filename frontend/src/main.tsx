import "./global.css";

import { StyleProvider } from "@ant-design/cssinjs";
import { App as AntApp, ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { MessageProvider } from "./contexts/MessageProvider";
import { ModalProvider } from "./contexts/ModalProvider";
import { store } from "./redux";
import { router } from "./routers";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <StyleProvider layer>
        <ConfigProvider>
          <AntApp>
            <MessageProvider />
            <ModalProvider>
              <RouterProvider router={router} />
            </ModalProvider>
          </AntApp>
        </ConfigProvider>
      </StyleProvider>
    </Provider>
  </StrictMode>
);
