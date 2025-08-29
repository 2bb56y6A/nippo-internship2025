import { FaCheckCircle, FaTrash } from "react-icons/fa";
import React from "react";
import { TODO_STATUSES, TODO_STATUS_LABELS, TodoStatus, TodoData} from "@/constants/todo";
import ConfirmDialog from "@/app/_components/ConfirmDialog";

type TodoItemProps = {
  id: number;
  todo: TodoData;
  isActive: boolean;
  onEditBeginingHandler?: (todo: TodoData) => void;
  onDeleteTodo?: (id: number) => void;
};

const TodoItem = ({ todo, isActive, onEditBeginingHandler, onDeleteTodo }: TodoItemProps): JSX.Element => {

  let itemDesign = {
    caption: "",
    textColor: "",
    bgColor: "",
  };

  switch (todo.status) {
    case TodoStatus.Backlog:
      itemDesign.caption = TODO_STATUS_LABELS[TodoStatus.Backlog];
      itemDesign.textColor = "text-gray-500";
      itemDesign.bgColor = "bg-gray-500";
      break;
    case TodoStatus.Inprogress:
      itemDesign.caption = TODO_STATUS_LABELS[TodoStatus.Inprogress];
      itemDesign.textColor = "text-blue-500";
      itemDesign.bgColor = "bg-blue-500";
      break;
    case TodoStatus.Done:
      itemDesign.caption = TODO_STATUS_LABELS[TodoStatus.Done];
      itemDesign.textColor = "text-emerald-500";
      itemDesign.bgColor = "bg-emerald-500";
      break;
  }

  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const confirmTitle = "確認画面";
  const confirmMessage = "本当に削除しますか？";
  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();
  const onConfirm = () => {
    closeDialog();
    if (onDeleteTodo) {
      onDeleteTodo(todo.id);
    }
  };

  return (
    <div className={`flex w-full border-2 border-gray-300 max-w-sm overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800 ${isActive ? "border-red-400" : ""}`}>
      <div className={`flex items-center justify-center w-12 ${itemDesign.bgColor}`}>
        <div>
            {todo.status === TodoStatus.Done && (
              <FaCheckCircle className="w-6 h-6 text-white fill-current" />
            )}
          </div>
      </div>

      <div className="px-4 py-2 -mx-3 flex-grow">
        <div className="mx-3">
          <span className={`font-semibold ${itemDesign.textColor}`}>
            {todo.title || '(タイトルなし)'}
          </span>
          <p className="me-1 mb-0 text-gray-700">{itemDesign.caption}</p>
          <p className="text-sm text-gray-600 dark:text-gray-200">
            {todo.description || '(詳細なし)'}
          </p>
          <button
            className="flex w-15 justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => onEditBeginingHandler(todo)}
          >
            編集
          </button>
        </div>
      </div>
      <div className="px-4 py-2 -mx-3 flex items-end">
        <div className="mx-3">
          <button
            type="button"
            className="flex  w-15 justify-center rounded-md bg-gray-400 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-gray-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-gray-400"
            onClick={() => openDialog()}
          >
            <FaTrash />
          </button>
        </div>
      </div>
      <ConfirmDialog
        ref={dialogRef}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={onConfirm}
        onCancel={closeDialog}
        confirmButtonClassName="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-500"
      />
    </div>
  );
};

export default TodoItem;
