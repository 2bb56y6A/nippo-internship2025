import TodoForm from "@/app/_components/TodoForm";
import { SaveWords, TodoData, TodoStatus } from "@/constants/todo";
import { Pool } from "pg";
import { revalidatePath } from 'next/cache';
import ResetButton from "./_components/ResetButton";

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
  async function saveTodo(todo: TodoData, operation: SaveWords) {
    'use server';

    const { id, title, description, status } = todo;
    const client = await pool.connect();
    try {
      if (operation === SaveWords.isEditing) {
      // 編集操作の場合、IDは必須
      if (!id) {
        throw new Error('編集操作にはIDが必要です。');
      }
      // 更新処理
      await client.query(
        'UPDATE todo_items SET title = $1, description = $2, state = $3 WHERE todo_id = $4',
        [title, description, status, id]
      );
    } else {
      // operation === SaveWords.isAdding
      // 追加処理
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

 async function resetData() {
  'use server';

  const client = await pool.connect();
    try {
    // TRUNCATEで全件削除とIDのシーケンスリセットを同時に行う
    // その後、初期データを挿入する
      await client.query(`
        TRUNCATE TABLE public.todo_items RESTART IDENTITY;
        INSERT INTO public.todo_items (state, title, description) VALUES
        (0, 'はじめていない', 'これはまだ着手していないタスクです。'),    
        (1, 'いまやってる', 'これは現在対応中のタスクです。'),
        (2, '終わった', 'これは対応が完了したタスクです。');
      `);
    } catch (error) {
      console.error("Database Error:", error);
    } finally {
    client.release();
    } 
    revalidatePath('/');
  }

  return (
    <>
      <div className="flex items-center">
        <h1 className="text-5xl font-bold text-black-400">
          <span className="text-red-500">To</span>
          <span className="text-blue-500">Do</span>
          リスト
        </h1>
        <div className="ml-2">
          <ResetButton resetDataAction={resetData} />
        </div>
      </div>
      <TodoForm
        initialTodos={data}
        saveTodoAction={saveTodo}
        deleteTodoAction={deleteTodo}
      />
    </>
  );
}
