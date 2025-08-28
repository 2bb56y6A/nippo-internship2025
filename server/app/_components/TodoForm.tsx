'use client';

import React from "react";
import TodoItem from "@/app/_components/TodoItem";
import { TodoStatus, TodoData} from "@/constants/todo";
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
  saveTodoAction: (formData: FormData) => Promise<void>;
  deleteTodoAction: (id: number) => Promise<void>;
};

const TodoForm = ({ initialTodos, saveTodoAction, deleteTodoAction }: TodoFormProps): JSX.Element => {

  const [todoList, setTodoList] = React.useState<TodoData[]>(initialTodos);
  const [editingTodoIndex, setEditingTodoIndex] = React.useState<number | undefined>(undefined);
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  const [editTargetTodo, setEditTargetTodo] = React.useState<TodoData | typeof newTodoTemplate>(() => {
    // この関数は初回レンダリング時に一度だけ実行されます
    return newTodoTemplate;
  });
  
  React.useEffect(() => {
    setTodoList(initialTodos);
  }, [initialTodos]);

 const onTodoSubmitted = async (submittedTodo: TodoData) => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const formData = new FormData();
    formData.append('title', submittedTodo.title);
    formData.append('description', submittedTodo.description);
    formData.append('status', submittedTodo.status.toString());

    // IDが存在する場合（更新の場合）のみ、FormDataにIDを追加
    if (submittedTodo.id) {
      formData.append('id', submittedTodo.id.toString());
    }

    
    //DBへの保存処理はサーバーアクションに任せます。
    await saveTodoAction(formData);

    // フォームを新規作成モードに戻す
    setEditingTodoIndex(undefined);
    setEditTargetTodo(newTodoTemplate);
    setIsSubmitting(false);
  };

  const onTodoEditBegining = (todo: TodoData) => {
    const idx = todoList.findIndex((item) => item.id === todo.id);
    setEditingTodoIndex(idx);
    setEditTargetTodo(todoList[idx]);
  }

   const onDeleteTodo = async (id: number) => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    //削除処理はサーバーアクションを呼び出す
    await deleteTodoAction(id);

    // フォームを新規作成モードに戻す
    setEditingTodoIndex(undefined);
    setEditTargetTodo(newTodoTemplate);
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
        isEditing={editingTodoIndex !== undefined}/>
    </>
  );
};

export default TodoForm;
