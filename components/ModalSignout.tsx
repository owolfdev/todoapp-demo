import React, { useState } from "react";

interface ModalProps {
  setShowModal: (value: boolean) => void;
  theFunction: () => void;
  message: string;
  label: string;
  path: string;
}

const Modal: React.FC<ModalProps> = ({
  setShowModal,
  theFunction,
  message,
  label,
  path,
}) => {
  const [title, setTitle] = useState<string | null>(null);
  const handler = () => {
    theFunction();
    setShowModal(false);
  };

  const handleCancel = () => {
    setShowModal(false);
  };

  return (
    <div className="fixed top-0 left-0 z-50 flex items-center justify-center w-full h-full bg-black bg-opacity-50">
      <div className="p-8 bg-white rounded-lg">
        <h2 className="mb-4 text-lg font-bold text-black">{message}</h2>
        <div className="flex justify-center">
          <button
            className="px-4 py-2 mr-2 font-bold text-gray-800 bg-gray-300 rounded hover:bg-gray-400"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-600"
            onClick={handler}
          >
            {label}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
