
// ============== 型定義 (from _types) ==============
export enum TodoStatus {
  Backlog = 0,
  Inprogress = 1,
  Done = 2,
};

export type TodoData = {
  id: number;
  status: TodoStatus;
  title: string;
  description: string;
};


// ============== 定数 (from constants) ==============
export const TODO_STATUSES = [
  { value: TodoStatus.Backlog, label: '未着手' },
  { value: TodoStatus.Inprogress, label: '対応中' },
  { value: TodoStatus.Done, label: '完了' }
];

export const TODO_STATUS_LABELS = {
  [TodoStatus.Backlog]: '未着手',
  [TodoStatus.Inprogress]: '対応中',
  [TodoStatus.Done]: '完了'
};