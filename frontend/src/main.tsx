import "./global.css";

import { StyleProvider } from "@ant-design/cssinjs";
import { ConfigProvider } from "antd";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";
import { RouterProvider } from "react-router";
import { AuthProvider } from "./contexts";
import { store } from "./redux";
import { router } from "./routers";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Provider store={store}>
      <AuthProvider>
        <StyleProvider layer>
          <ConfigProvider>
            <RouterProvider router={router} />
          </ConfigProvider>
        </StyleProvider>
      </AuthProvider>
    </Provider>
  </StrictMode>
);
