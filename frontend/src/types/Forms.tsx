export type FormProps<T> = {
  onFinish: (values: Partial<T>) => Promise<void> | void;
  initialValues?: Partial<T> | null;
};
