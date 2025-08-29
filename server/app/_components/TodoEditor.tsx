'use client';

import React from "react";
import TodoItem from "@/app/_components/TodoItem";
import { TODO_STATUSES, TODO_STATUS_LABELS, SAVE_BUTTON_LABELS, TodoStatus, TodoData, SaveWords} from "@/constants/todo";
import ConfirmDialog from "@/app/_components/ConfirmDialog";

type TodoEditorProps = {
  editTargetTodo: TodoData;
  onSubmit: (todo: TodoData) => void;
  isEditing: boolean;
};

interface StatusOption {
  value: TodoStatus;
  label: string;
}

const statusOptions: StatusOption[] = TODO_STATUSES;

const TodoEditor = ({ editTargetTodo, onSubmit, isEditing }): JSX.Element => {
  if (!editTargetTodo) {
    return <p>loading...</p>
  };

  const [todo, setTodo] = React.useState<TodoData>(editTargetTodo);

  React.useEffect(() => {
    setTodo(editTargetTodo);
  }, [editTargetTodo]);

  const onTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTodo = { ...todo };
    newTodo.title = e.target.value;
    setTodo(newTodo);
  };

  const onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTodo = { ...todo };
    newTodo.description = e.target.value;
    setTodo(newTodo);
  };


  const onStatusChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const selectedValue = parseInt(e.target.value, 10);
    if (!isNaN(selectedValue)) {
      const newTodo = { ...todo };
      newTodo.status = selectedValue;
      setTodo(newTodo);
    }
  };
  
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  const confirmTitle = "確認画面";
  const confirmMessage = isEditing ? "ToDoリストを変更しますか？" : "ToDoリストに追加しますか？";
  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();
  const onConfirm = () => {
    closeDialog();
    onSubmit(todo);
  };

  const saveButtonText = isEditing ? SAVE_BUTTON_LABELS[SaveWords.isEditing] : SAVE_BUTTON_LABELS[SaveWords.isAdding];

  return (
    <div className="w-100 overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="m-2">
          <label className="text-gray-400">状態</label>
          <div>
            <select
              value={String(todo.status)}
              onChange={onStatusChangeHandler}
              className="inline-block w-auto rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="m-2">
          <label className="text-gray-400">タイトル</label>
          <input
            type="text"
            value={todo.title}
            onChange={onTitleChange}
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>

        <div className="m-2">
          <label className="text-gray-400">詳細</label>
          <input
            type="text"
            value={todo.description}
            onChange={onDescriptionChange}
            className="block w-full rounded-md border-0 py-1.5 px-2 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          />
        </div>

        <div className="m-2">
          <button
            type="submit"
            className="flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            onClick={() => openDialog()}
          >
            {saveButtonText}
          </button>
        </div>
      </form>
      <ConfirmDialog
        ref={dialogRef}
        title={confirmTitle}
        message={confirmMessage}
        onConfirm={onConfirm}
        onCancel={closeDialog}
        confirmButtonClassName="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
      />
    </div>
  );
  
};

export default TodoEditor;