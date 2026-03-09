import { useEffect, useRef } from "react";
import { createPortal } from "react-dom";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  message: string;
  type?: "error" | "success";
}

export const Modal = ({ isOpen, onClose, title, message, type = "error" }: ModalProps) => {
  const modalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(e.target as Node)) {
      onClose();
    }
  };

  const modalContent = (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 backdrop-blur-sm animate-in fade-in duration-200"
      onClick={handleBackdropClick}
      style={{ isolation: "isolate" }}
    >
      <div
        ref={modalRef}
        className="w-full max-w-md mx-4 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl transform animate-in zoom-in-95 duration-200 overflow-hidden"
        style={{ zIndex: 10000 }}
      >
        <div className={`p-6 ${type === "error" ? "bg-red-50 dark:bg-red-900/20" : "bg-green-50 dark:bg-green-900/20"}`}>
          <div className="flex items-center gap-4">
            <div className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center ${
              type === "error" ? "bg-red-100 dark:bg-red-900/50" : "bg-green-100 dark:bg-green-900/50"
            }`}>
              {type === "error" ? (
                <svg className="w-6 h-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              ) : (
                <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              )}
            </div>
            <h3 className={`text-lg font-semibold ${
              type === "error" ? "text-red-800 dark:text-red-200" : "text-green-800 dark:text-green-200"
            }`}>
              {title}
            </h3>
          </div>
        </div>

        <div className="p-6">
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
            {message}
          </p>
        </div>

        <div className="px-6 pb-6">
          <button
            onClick={onClose}
            className={`w-full py-3 px-4 rounded-xl font-semibold transition-all duration-200 ${
              type === "error"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-green-600 hover:bg-green-700 text-white"
            }`}
          >
            {type === "error" ? "Completar campos" : "Aceptar"}
          </button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalContent, document.body);
};
