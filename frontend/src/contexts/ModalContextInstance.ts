// context instance only — no React components exported from this file
import type { ModalProps } from "antd";
import type { ComponentType, ReactNode } from "react";
import { createContext } from "react";

/**
 * Keep types and the context creation here.
 * This file must NOT export any React components (no JSX).
 * Save as .ts (not .tsx) to avoid Fast Refresh treating it as component file.
 */

export type OpenOptions<T = any> = {
  title?: ReactNode;
  create: boolean;
  component: ComponentType<T>;
  props?: T;
  modalProps?: ModalProps;
  onFinish?: (values: any) => Promise<any> | any;
  onFinishState?: boolean;
};

export type ModalContextValue = {
  open: (opts: OpenOptions) => Promise<any>;
  close: () => void;
  isOpen: boolean;
};

export const ModalContext = createContext<ModalContextValue | null>(null);

export default ModalContext;
