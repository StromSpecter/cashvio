import { toast as sonnerToast } from 'sonner'

// Centralized toast helper. Swap underlying lib here only if needed.
export const toast = {
  success: (msg, opts) => sonnerToast.success(msg, opts),
  error: (msg, opts) => sonnerToast.error(msg, opts),
  warning: (msg, opts) => sonnerToast.warning(msg, opts),
  info: (msg, opts) => sonnerToast.info(msg, opts),
  promise: (promise, msgs, opts) => sonnerToast.promise(promise, msgs, opts),
  dismiss: (id) => sonnerToast.dismiss(id),
  loading: (msg, opts) => sonnerToast.loading(msg, opts),
}
