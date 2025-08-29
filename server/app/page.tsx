import TodoForm from "@/app/_components/TodoForm";
import { TodoData, TodoStatus } from "@/constants/todo";
import { Pool } from "pg";
import { revalidatePath } from 'next/cache';

const pool = new Pool({
    user: 'postgres',
    password: 'postgres',
    host: 'db',
    port: 5432,
    database: 'todolist',
  });

async function LoadTodoItemsFromDB() {
  const client = await pool.connect();
  try {
    // ID順で取得することで、表示順を安定させます
    const ret = await client.query('SELECT * FROM todo_items ORDER BY todo_id ASC');
    return ret.rows;
  } finally {
    // client.release(true) の `true` は非推奨のため削除
    client.release();
  }
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
    'use server';

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

    // データベース更新後、このページのデータを再取得して画面を更新するようNext.jsに指示
    revalidatePath('/');
  }

  // ToDoを削除するための関数
  async function deleteTodo(id: number) {
    'use server';

    if (!id) return; // IDがない場合は何もしない

    const client = await pool.connect();
    try {
      await client.query('DELETE FROM todo_items WHERE todo_id = $1', [id]);
    } catch (error) {
      console.error("Database Error:", error);
    } finally {
      client.release();
    }
    revalidatePath('/');
  }


  return (
    <>
      <h1 className="text-5xl font-bold text-black-400">
        <span className="text-red-500">To</span>
        <span className="text-blue-500">Do</span>
        リスト
      </h1>
      <TodoForm
        initialTodos={data}
        saveTodoAction={saveTodo}
        deleteTodoAction={deleteTodo}
      />
    </>
  );
}
