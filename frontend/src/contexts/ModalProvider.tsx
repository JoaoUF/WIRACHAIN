import { Modal } from "antd";
import type { ComponentType } from "react";
import React, { useCallback, useRef, useState } from "react";
import ModalContext, { type OpenOptions } from "./ModalContextInstance";

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [openOptions, setOpenOptions] = useState<OpenOptions | null>(null);
  const resolverRef = useRef<{
    resolve: (v?: any) => void;
    reject: (e?: any) => void;
  } | null>(null);

  const close = useCallback(() => {
    setOpenOptions(null);
    if (resolverRef.current) {
      resolverRef.current.resolve(undefined);
      resolverRef.current = null;
    }
  }, []);

  const open = useCallback((opts: OpenOptions) => {
    if (resolverRef.current) {
      resolverRef.current.resolve(undefined);
      resolverRef.current = null;
    }
    setOpenOptions(opts);
    return new Promise<any>((resolve, reject) => {
      resolverRef.current = { resolve, reject };
    });
  }, []);

  const handleInnerFinish = useCallback(
    async (
      innerOnFinish: ((...args: any[]) => any) | undefined,
      values: any
    ) => {
      if (!openOptions) return;
      if (openOptions.onFinish) {
        await openOptions.onFinish(values);
      }
      if (typeof innerOnFinish === "function") {
        await innerOnFinish(values);
      }
      setOpenOptions(null);
      if (resolverRef.current) {
        resolverRef.current.resolve(values);
        resolverRef.current = null;
      }
    },
    [openOptions]
  );

  return (
    <ModalContext.Provider
      value={{
        open,
        close,
        isOpen: Boolean(openOptions),
      }}
    >
      {children}

      {openOptions ? (
        <Modal
          title={openOptions.title}
          open={Boolean(openOptions)}
          okText={openOptions.create ? "Add" : "Update"}
          okButtonProps={{ autoFocus: true, htmlType: "submit" }}
          onCancel={() => {
            setOpenOptions(null);
            if (resolverRef.current) {
              resolverRef.current.resolve(undefined);
              resolverRef.current = null;
            }
          }}
          footer={null}
          confirmLoading={openOptions.onFinishState}
          destroyOnHidden
          {...openOptions.modalProps}
        >
          {React.createElement(openOptions.component as ComponentType<any>, {
            ...openOptions.props,
            onFinish: (values: any, innerOnFinish?: (...args: any[]) => any) =>
              handleInnerFinish(innerOnFinish || undefined, values),
            modalClose: close,
          })}
        </Modal>
      ) : null}
    </ModalContext.Provider>
  );
}
