'use client';

import React from "react";
import TodoItem from "@/app/_components/TodoItem";
import { TodoStatus, TodoData} from "@/constants/todo";
import TodoEditor from "@/app/_components/TodoEditor";

type TodoFormProps = {
  initialTodos: TodoData[];
  // page.tsxから渡されるServer Actionの型を定義
  saveTodoAction: (formData: FormData) => Promise<void>;
};


const TodoForm = ({ initialTodos, saveTodoAction }: TodoFormProps): JSX.Element => {

  const [todoList, setTodoList] = React.useState<TodoData[]>(initialTodos);
  const newTodo: TodoData = React.useMemo(() => {
    const maxId = todoList.length === 0 ? 0 : Math.max(...todoList.map(todo => todo.id));
    return {
      id: maxId + 1, // クライアント側で一意なIDを生成
      status: TodoStatus.Backlog,
      title: "Newタスク",
      description: "タスクの説明文",
    };
}, [todoList]);

  const [editingTodoIndex, setEditingTodoIndex] = React.useState<number>(undefined);
  const [editTargetTodo, setEditTargetTodo] = React.useState<TodoData>(newTodo);

   // initialTodos プロパティの変更を監視し、todoList ステートを更新
  React.useEffect(() => {
    setTodoList(initialTodos);
  }, [initialTodos]);
  
  // 編集ターゲットがリセットされたときに、新しいnewTodoで更新する
  React.useEffect(() => {
    if (editingTodoIndex === undefined) {
      setEditTargetTodo(newTodo);
    }
  }, [editingTodoIndex, newTodo]);

  const onTodoSubmitted = async (todo: TodoData) => {
    // FormDataオブジェクトを作成
    const formData = new FormData();
    formData.append('title', todo.title);
    formData.append('description', todo.description);
    formData.append('status', todo.status.toString());
    
    // 既存のToDoを編集している場合はIDを追加
    if (editingTodoIndex !== undefined) {
      formData.append('id', todo.id.toString());
    }

    // Server Action を呼び出してデータを保存
    await saveTodoAction(formData);

    // 編集状態をリセット
    // revalidatePath('/') により親コンポーネントが再レンダリングされ、
    // todoList が自動的に更新されるため、クライアント側でのリスト操作は不要
    setEditingTodoIndex(undefined);
  }

  const onTodoEditBegining = (todo: TodoData) => {
    const idx = todoList.findIndex((item) => item.id === todo.id);
    setEditingTodoIndex(idx);
    setEditTargetTodo(todoList[idx]);
  }

   const ondeleteTodo = (id: number) => {
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
          ondeleteTodo={ondeleteTodo}
        />
      ))}
      <TodoEditor 
        editTargetTodo={editTargetTodo} 
        onSubmit={onTodoSubmitted}
      />
    </>
  );
};

export default TodoForm;
