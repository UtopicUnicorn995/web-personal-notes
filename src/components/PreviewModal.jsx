import { createPortal } from "react-dom";

const modalRoot = document.getElementById("modal-root");

function PreviewModal({ note, onClose }) {
  if (!note) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-10 flex items-center justify-center bg-gray-500/75"
      role="dialog"
      aria-modal="true"
      aria-labelledby="preview-modal-title"
    >
      <div
        className="relative w-full h-full sm:w-[80%] sm:h-[80%] bg-white rounded-lg overflow-hidden flex flex-col transform transition-all duration-300 ease-in-out"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center p-4 border-b border-gray-200">
          <h2
            className="text-xl font-semibold text-gray-900"
            id="preview-modal-title"
          >
            {note.title || "Untitled Note"}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close preview"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6 text-gray-600"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="prose prose-sm sm:prose max-w-none">
            <p className="whitespace-pre-wrap text-gray-800">
              {note.content || "No content"}
            </p>
          </div>
        </div>
      </div>
    </div>,
    modalRoot
  );
}

export default PreviewModal;
