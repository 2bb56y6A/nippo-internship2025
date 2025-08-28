import TodoForm from "@/app/_components/TodoForm";
import { TodoData, TodoStatus } from "@/app/_types/TodoTypes";
import { Pool } from "pg";
import { revalidatePath } from 'next/cache';

async function LoadTodoItemsFromDB() {

  const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'db',
    port: 5432,
    database: 'todolist',
  });

  const client = await pool.connect();
  const ret = await client.query('select * from todo_items', []);
  await client.release(true);
  return ret.rows;

}

export default async function Home() {

  const dbData = await LoadTodoItemsFromDB();
  const data: TodoData[] = dbData.map((todoItem) => {
    return {
      id: todoItem.todo_id,
      status: todoItem.state,
      title: todoItem.title,
      description: todoItem.description,
    }
  });

  // ToDoを追加または更新するための関数
  async function saveTodo(formData: FormData) {
    'use server'; // この関数がサーバーでのみ実行されることを示す

    const pool = new Pool({ /* DB接続設定 */ });
    const client = await pool.connect();

    try {
      // フォームから送信されたデータを取得
      const id = formData.get('id') as string | null;
      const title = formData.get('title') as string;
      const description = formData.get('description') as string;
      const status = Number(formData.get('status'));

      if (id) {
        // IDがあれば更新処理
        await client.query(
          'UPDATE todo_items SET title = $1, description = $2, state = $3 WHERE todo_id = $4',
          [title, description, status, id]
        );
      } else {
        // IDがなければ新規追加処理
        await client.query(
          'INSERT INTO todo_items (title, description, state) VALUES ($1, $2, $3)',
          [title, description, status]
        );
      }
    } catch (error) {
      console.error("Database Error:", error);
    } finally {
      await client.release(true);
    }

    // ---【重要】---
    // データベース更新後、このページのデータを再取得して画面を更新するようNext.jsに指示
    revalidatePath('/');
  }

  return (
    <>
      <h1 className="text-5xl font-bold text-black-400">
        <span className="text-red-500">To</span>
        <span className="text-blue-500">Do</span>
        リスト
      </h1>
      <TodoForm initialTodos={data} saveTodoAction={saveTodo} />
    </>
  );
}
