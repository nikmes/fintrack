function ToastContainer({ toasts = [], onDismiss }) {
  if (toasts.length === 0) {
    return null;
  }

  return (
    <div className="toast-region" aria-live="polite" aria-atomic="false">
      {toasts.map((toast) => (
        <div
          className={`toast toast-${toast.type || "info"}`}
          key={toast.id}
          role={toast.type === "error" ? "alert" : "status"}
        >
          <div className="toast-icon" aria-hidden="true">
            {toast.type === "error" ? "!" : toast.type === "success" ? "OK" : "i"}
          </div>

          <p>{toast.message}</p>

          <button
            type="button"
            className="toast-close"
            onClick={() => onDismiss(toast.id)}
            aria-label="Dismiss notification"
          >
            x
          </button>
        </div>
      ))}
    </div>
  );
}

export default ToastContainer;
