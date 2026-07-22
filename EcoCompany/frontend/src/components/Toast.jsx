import { useEffect } from "react";

export default function Toast({ toast, onClose }) {
  useEffect(() => {
    if (!toast) return undefined;
    const timeout = window.setTimeout(onClose, 4200);
    return () => window.clearTimeout(timeout);
  }, [toast, onClose]);

  if (!toast) return null;

  return (
    <div className="toast-region" aria-live="polite">
      <div className={`toast${toast.type === "error" ? " error" : ""}`} role="status">
        {toast.message}
      </div>
    </div>
  );
}
