'use client';

import React from "react";
import TodoItem from "@/app/_components/TodoItem";
import { TodoStatus, TodoData} from "@/constants/todo";
import TodoEditor from "@/app/_components/TodoEditor";

// 新規Todoのテンプレート
const newTodoTemplate = {
  status: TodoStatus.Backlog,
  title: "Newタスク",
  description: "タスクの説明文",
};

const TodoForm = ({ children }): JSX.Element => {

  const [todoList, setTodoList] = React.useState<TodoData[]>(children);
  const [editingTodoIndex, setEditingTodoIndex] = React.useState<number | undefined>(undefined);
  
  // useStateの遅延初期化を使い、初回レンダリング時のみ実行
  const [editTargetTodo, setEditTargetTodo] = React.useState<TodoData>(() => {
    const initialId = todoList.length > 0 ? Math.max(...todoList.map(t => t.id)) + 1 : 1;
    return {
      ...newTodoTemplate,
      id: initialId,
    };
  });

  const onTodoSubmitted = (submittedTodo: TodoData) => {
    //更新後の新しい配列
    let updatedList;
    
    if (editingTodoIndex !== undefined) {
      // 更新処理
      updatedList = todoList.map((item, index) =>
        index === editingTodoIndex ? submittedTodo : item
      );
    } else {
      // 新規追加処理
      updatedList = [...todoList, submittedTodo];
    }

    setTodoList(updatedList);
    // 新しいIDを計算して新規Todoのテンプレートを更新
    const maxId = updatedList.length > 0 ? Math.max(...updatedList.map(t => t.id)) : 0;
    const nextNewTodo = {
      ...newTodoTemplate,
      id: maxId + 1,
    };

    setEditTargetTodo(nextNewTodo);
    setEditingTodoIndex(undefined);
  };

  const onTodoEditBegining = (todo: TodoData) => {
    const idx = todoList.findIndex((item) => item.id === todo.id);
    setEditingTodoIndex(idx);
    setEditTargetTodo(todoList[idx]);
  }

   const onDeleteTodo = (id: number) => {
    setTodoList((prevTodoList) => {
      // 対象のidでないTodoを残す
      return prevTodoList.filter((todo) => {
        return todo.id !== id;
      });
    });
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
        isEditing={editingTodoIndex !== undefined}/>
    </>
  );
};

export default TodoForm;
