import type { MessageArgsProps } from "antd";
import { App } from "antd";

let messageApi: ReturnType<typeof App.useApp>["message"];
let notificationApi: ReturnType<typeof App.useApp>["notification"];
let modalApi: ReturnType<typeof App.useApp>["modal"];

export const MessageProvider = () => {
  const { message, notification, modal } = App.useApp();
  messageApi = message;
  notificationApi = notification;
  modalApi = modal;
  return null;
};

type MessageConfig = Omit<MessageArgsProps, "type">;

// eslint-disable-next-line react-refresh/only-export-components
export const globalMessage = {
  success: (content: string | MessageConfig) => {
    if (typeof content === "string") {
      return messageApi?.success(content);
    }
    return messageApi?.success(content);
  },
  error: (content: string | MessageConfig) => {
    if (typeof content === "string") {
      return messageApi?.error(content);
    }
    return messageApi?.error(content);
  },
  warning: (content: string | MessageConfig) => {
    if (typeof content === "string") {
      return messageApi?.warning(content);
    }
    return messageApi?.warning(content);
  },
  info: (content: string | MessageConfig) => {
    if (typeof content === "string") {
      return messageApi?.info(content);
    }
    return messageApi?.info(content);
  },
  loading: (content: string | MessageConfig) => {
    if (typeof content === "string") {
      return messageApi?.loading(content);
    }
    return messageApi?.loading(content);
  },
  open: (config: MessageArgsProps) => messageApi?.open(config),
};

// eslint-disable-next-line react-refresh/only-export-components
export const globalNotification = {
  success: (config: Parameters<typeof notificationApi.success>[0]) =>
    notificationApi?.success(config),
  error: (config: Parameters<typeof notificationApi.error>[0]) =>
    notificationApi?.error(config),
  warning: (config: Parameters<typeof notificationApi.warning>[0]) =>
    notificationApi?.warning(config),
  info: (config: Parameters<typeof notificationApi.info>[0]) =>
    notificationApi?.info(config),
  open: (config: Parameters<typeof notificationApi.open>[0]) =>
    notificationApi?.open(config),
};

// eslint-disable-next-line react-refresh/only-export-components
export const globalModal = {
  confirm: (config: Parameters<typeof modalApi.confirm>[0]) =>
    modalApi?.confirm(config),
  info: (config: Parameters<typeof modalApi.info>[0]) => modalApi?.info(config),
  success: (config: Parameters<typeof modalApi.success>[0]) =>
    modalApi?.success(config),
  error: (config: Parameters<typeof modalApi.error>[0]) =>
    modalApi?.error(config),
  warning: (config: Parameters<typeof modalApi.warning>[0]) =>
    modalApi?.warning(config),
};

/**
 * 
 * import { globalModal } from "@/utils/message";

// Confirm dialog
  globalModal.confirm({
  title: "Are you sure?",
  content: "Do you want to delete this item?",
  onOk: () => {
    console.log("Confirmed");
  },
  onCancel: () => {
    console.log("Cancelled");
  },

  import { globalNotification } from "@/utils/message";

// Success notification
globalNotification.success({
  message: "Login Successful",
  description: "Welcome back! You have been successfully logged in.",
  duration: 3,
  placement: "topRight",
});
});
 */
