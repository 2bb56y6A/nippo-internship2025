'use client';

import React from "react";
import { FaSync } from "react-icons/fa";

type ResetButtonProps = {
  resetDataAction: () => Promise<void>;
};

const ResetButton = ({ resetDataAction }: ResetButtonProps): JSX.Element => {
  const [isPending, startTransition] = React.useTransition();
  // ダイアログ要素への参照を作成
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  
  // ダイアログに表示するテキスト
  const confirmTitle = "確認画面";
  const confirmMessage = "本当にリセットしますか？";

  // ダイアログを開閉する関数
  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  const handleReset = () => {
    startTransition(async () => {
      await resetDataAction();
    });
  };

  return (
    <>
      <button
        onClick={openDialog}
        disabled={isPending}
        className="flex items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:opacity-50 disabled:cursor-not-allowed"
      >
      <FaSync />
      {isPending ? "リセット中..." : "リセット"}
      </button>
      <dialog 
        ref={dialogRef}
        className="fixed inset-0 m-auto w-fit h-fit p-6 rounded-lg shadow-lg"
      >
        <h2 className="text-5xl font-bold text-black-400">
          {confirmTitle}
        </h2>
        <p className="text-3xl font-bold text-black-400">
          {confirmMessage}
        </p>
        
        <div className="mt-4 flex justify-end gap-4">
          <button 
            className="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-400"
            onClick={() => { closeDialog(); handleReset(); } }
          >
            はい
          </button>
          <button 
            className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
            onClick={closeDialog}
          >
            いいえ
          </button>
        </div>
      </dialog>
    </>
  );
};

export default ResetButton;