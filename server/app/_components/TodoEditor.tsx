'use client';

import React from "react";
import { TodoData, TodoStatus } from "@/app/_types/TodoTypes";
import TodoItem from "@/app/_components/TodoItem";

type TodoEditorProps = {
  editTargetTodo: TodoData;
  onSubmit: (todo: TodoData) => void;
};

interface StatusOption {
  value: TodoStatus;
  label: string;
}

const statusOptions: StatusOption[] = [
  { value: TodoStatus.Backlog, label: '未着手' },
  { value: TodoStatus.Inprogress, label: '対応中' },
  { value: TodoStatus.Done, label: '完了' },
];

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


  const onStatusChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const selectedValue = parseInt(e.target.value, 10);
    if (!isNaN(selectedValue)) {
      const newTodo = { ...todo };
      newTodo.status = selectedValue;
      setTodo(newTodo);
    }
  };

  return (
    <div className="w-100 overflow-hidden bg-white rounded-lg shadow-md dark:bg-gray-800">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="m-2">
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
            onClick={() => onSubmit(todo)}
          >
            保存
          </button>
        </div>
      </form>
    </div>
  );
  
};

export default TodoEditor;
