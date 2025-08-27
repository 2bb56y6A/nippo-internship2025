'use client';

import React from "react";
import { TodoData, TodoStatus } from "@/app/_types/TodoTypes";
import TodoItem from "@/app/_components/TodoItem";



type TodoEditorProps = {
  editTargetTodo: TodoData;
  onSubmit: (todo: TodoData) => void;
};

const TodoEditor = ({ editTargetTodo, onSubmit }): JSX.Element => {
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

  // ダイアログ要素を特定するための参照
  const dialogRef = React.useRef<HTMLDialogElement>(null);
  // ダイアログ内に表示するキャプション
  const confirmTitle = "確認画面";
  const confirmMessage = "ToDoリストに追加しますか？";
  // ダイアログボタンクリック時の制御処理
  const openDialog = () => dialogRef.current?.showModal();
  const closeDialog = () => dialogRef.current?.close();

  return (
    <div className="w-100 overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
      <form onSubmit={(e) => e.preventDefault()}>
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
            保存
          </button>
        </div>

        
        <div>
          <dialog 
            ref={dialogRef}
            className="fixed inset-0 m-auto w-fit h-fit p-6 rounded-lg shadow-lg">
            <h2 className="text-5xl font-bold text-black-400">
              {confirmTitle}
            </h2>
            <p className="text-3xl font-bold text-black-400">
              {confirmMessage}
            </p>
            
            <div className="mt-4 flex justify-end gap-4">
              <button 
                className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-500"
                onClick={() => { closeDialog(); onSubmit(todo); } }
                >
                  はい
                </button>

                <button 
                className="px-4 py-2 bg-gray-100 rounded hover:bg-gray-200"
                onClick={() => { closeDialog(); } }
                >
                  いいえ  
                </button></div>
            </dialog>

        </div>
      </form>
    </div>
  );
  
};

export default TodoEditor;