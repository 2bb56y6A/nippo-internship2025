'use client';

import React, { forwardRef } from "react";

// Propsの定義は変更なし
type ConfirmDialogProps = {
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  confirmButtonClassName?: string;
};

// forwardRefの修正
const ConfirmDialog = forwardRef<HTMLDialogElement, ConfirmDialogProps>(
  (
    {
      title,
      message,
      onConfirm,
      onCancel,
      // 不足していたpropsを追加
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
        // classNameを具体的に指定
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
  } // ここにあった不要な `};` を削除
);

ConfirmDialog.displayName = 'ConfirmDialog';

export default ConfirmDialog;