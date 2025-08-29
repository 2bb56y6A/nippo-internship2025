'use client';

import React from "react";
import { FaSync } from "react-icons/fa";
import ConfirmDialog from "@/app/_components/ConfirmDialog"; // 新しいコンポーネントをインポート

type ResetButtonProps = {
  resetDataAction: () => Promise<void>;
};

const ResetButton = ({ resetDataAction }: ResetButtonProps): JSX.Element => {
  const [isPending, startTransition] = React.useTransition();
  const dialogRef = React.useRef<HTMLDialogElement>(null);

  const confirmTitle = "確認画面";
  const confirmMessage = "本当にリセットしますか？";

  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  const handleReset = () => {
    startTransition(async () => {
      await resetDataAction();
    });
  };

  const onConfirm = () => {
    closeDialog();
    handleReset();
  };

  return (
    <>
      <button
        onClick={openDialog}
        disabled={isPending}
        className="flex items-center justify-center gap-2 rounded-md bg-orange-500 px-4 py-2 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-orange-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        <FaSync />
        {isPending ? "リセット中..." : "リセット"}
      </button>
      <ConfirmDialog
        ref={dialogRef}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={onConfirm}
        onCancel={closeDialog}
        confirmButtonClassName="px-4 py-2 bg-orange-500 text-white rounded hover:bg-orange-400"
      />
    </>
  );
};

export default ResetButton;