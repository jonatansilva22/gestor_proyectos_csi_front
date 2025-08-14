import { toast, type ToastOptions } from "react-toastify";

// Generate a stable toastId from type + message (basic hashing)
const getToastId = (type: string, msg: string) => `${type}:${msg}`;

const showOnce = (
  type: "success" | "error" | "info" | "warning",
  msg: string,
  options?: ToastOptions
) => {
  const id = options?.toastId ?? getToastId(type, msg);
  if (id && toast.isActive(id)) return; // prevent duplicates while active

  const base: ToastOptions = { toastId: id };

  switch (type) {
    case "success":
      toast.success(msg, { ...base, ...options });
      break;
    case "error":
      toast.error(msg, { ...base, ...options });
      break;
    case "info":
      toast.info(msg, { ...base, ...options });
      break;
    case "warning":
      toast.warning(msg, { ...base, ...options });
      break;
  }
};

export const notifySuccess = (msg: string, options?: ToastOptions) =>
  showOnce("success", msg, options);

export const notifyError = (msg: string, options?: ToastOptions) =>
  showOnce("error", msg, options);

export const notifyInfo = (msg: string, options?: ToastOptions) =>
  showOnce("info", msg, options);

export const notifyWarning = (msg: string, options?: ToastOptions) =>
  showOnce("warning", msg, options);
