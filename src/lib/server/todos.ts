import db from './db';

export interface Todo {
  id: number;
  user_id: string;
  title: string;
  content: string;
  is_done: number;
  created_at: number;
}

export function createTodo(userId: string, title: string, content: string): number {
  const insert = db.prepare(
    'INSERT INTO todos (user_id, title, content, is_done, created_at) VALUES (?, ?, ?, 0, ?)'
  );
  const info = insert.run(userId, title, content, Date.now());
  return info.lastInsertRowid as number;
}

export function getTodos(
  userId: string,
  filterDone: 'all' | 'done' | 'not_done' = 'all',
  searchQuery: string = ''
): Todo[] {
  let query = 'SELECT * FROM todos WHERE user_id = ?';
  const params: any[] = [userId];

  if (filterDone === 'done') {
    query += ' AND is_done = 1';
  } else if (filterDone === 'not_done') {
    query += ' AND is_done = 0';
  }

  // Parse search query
  const words = searchQuery
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length >= 3);

  if (words.length > 0) {
    const conditions = words.map(() => '(title LIKE ? OR content LIKE ?)');
    query += ` AND (${conditions.join(' AND ')})`;
    words.forEach((word) => {
      params.push(`%${word}%`, `%${word}%`);
    });
  }

  query += ' ORDER BY created_at DESC';

  const stmt = db.prepare(query);
  return stmt.all(...params) as Todo[];
}

export function getTodo(id: number, userId: string): Todo | undefined {
  const stmt = db.prepare('SELECT * FROM todos WHERE id = ? AND user_id = ?');
  return stmt.get(id, userId) as Todo | undefined;
}

export function updateTodo(
  id: number,
  userId: string,
  title: string,
  content: string,
  isDone: number
) {
  const stmt = db.prepare(
    'UPDATE todos SET title = ?, content = ?, is_done = ? WHERE id = ? AND user_id = ?'
  );
  stmt.run(title, content, isDone, id, userId);
}

export function deleteTodo(id: number, userId: string) {
  const stmt = db.prepare('DELETE FROM todos WHERE id = ? AND user_id = ?');
  stmt.run(id, userId);
}
