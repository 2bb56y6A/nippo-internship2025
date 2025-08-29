'use client';

import React from "react";
import TodoItem from "@/app/_components/TodoItem";
import { TodoStatus, TodoData, SaveWords } from "@/constants/todo";
import TodoEditor from "@/app/_components/TodoEditor";

// 新規Todoのテンプレート
//初期値を空文字列に変更
const newTodoTemplate: Omit<TodoData, 'id'> & { id: null } = {
  id: null,
  status: TodoStatus.Backlog,
  title: "",
  description: "",
};

type TodoFormProps = {
  initialTodos: TodoData[];
  saveTodoAction: (todoData: TodoData, operation: SaveWords) => Promise<void>;
  deleteTodoAction: (id: number) => Promise<void>;
};

const TodoForm = ({ initialTodos, saveTodoAction, deleteTodoAction }: TodoFormProps): JSX.Element => {

  const [todoList, setTodoList] = React.useState<TodoData[]>(initialTodos);
  const [editingTodoIndex, setEditingTodoIndex] = React.useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const isEditing = editingTodoIndex !== undefined;
  const editTargetTodo = (isEditing && todoList[editingTodoIndex])
    ? todoList[editingTodoIndex]
    : newTodoTemplate;
  
  React.useEffect(() => {
    setTodoList(initialTodos);
  }, [initialTodos]);

 const onTodoSubmitted = async (submittedTodo: TodoData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    // 編集中かどうかに基づいて操作を決定
    const operation = isEditing ? SaveWords.isEditing : SaveWords.isAdding;

    //DBへの保存処理はサーバーアクションに任せます。
    await saveTodoAction(submittedTodo, operation);

    // フォームを新規作成モードに戻す
    setEditingTodoIndex(undefined);
    setIsSubmitting(false);
  };

  const onTodoEditBegining = (todo: TodoData) => {
    const idx = todoList.findIndex((item) => item.id === todo.id);
    setEditingTodoIndex(idx);
  }

   const onDeleteTodo = async (id: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    //削除処理はサーバーアクションを呼び出す
    await deleteTodoAction(id);

    // フォームを新規作成モードに戻す
    setEditingTodoIndex(undefined);
    setIsSubmitting(false);
  };

  return (
    <>
      { todoList && todoList.map((item, index) => (
        <TodoItem 
          key={item.id} todo={item} 
          isActive={index === editingTodoIndex}
          onEditBeginingHandler={onTodoEditBegining}
          onDeleteTodo={onDeleteTodo}
        />
      ))}
      <TodoEditor 
        editTargetTodo={editTargetTodo} 
        onSubmit={onTodoSubmitted} 
        isEditing={isEditing}/>
    </>
  );
};

export default TodoForm;
