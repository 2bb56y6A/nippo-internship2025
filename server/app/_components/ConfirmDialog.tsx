'use client';

import React, { forwardRef } from "react";

type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  confirmButtonClassName?: string;
};

const ConfirmDialog = forwardRef<HTMLDialogElement, ConfirmDialogProps>(
  (
    {
      title,
      message,
      onConfirm,
      onCancel,
      confirmButtonLabel = "はい", 
      cancelButtonLabel = "いいえ",
      confirmButtonClassName,
      ...props
    },
    ref
  ) => {
    return (
      <dialog
        ref={ref}
        className="fixed inset-0 m-auto h-fit w-fit rounded-lg p-6 shadow-lg"
        {...props}
      >
        <h2 className="text-5xl font-bold text-black-400">{title}</h2>
        <p className="mt-2 text-3xl font-bold text-black-400">{message}</p>
        <div className="mt-4 flex justify-end gap-4">
          <button
            className={`px-4 py-2 ${confirmButtonClassName}`}
            onClick={onConfirm}
          >
            {confirmButtonLabel}
          </button>
          <button
            className="rounded bg-gray-100 px-4 py-2 hover:bg-gray-200"
            onClick={onCancel}
          >
            {cancelButtonLabel}
          </button>
        </div>
      </dialog>
    );
  }
);

ConfirmDialog.displayName = 'ConfirmDialog';

export default ConfirmDialog;