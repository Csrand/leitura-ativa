import { openDatabaseAsync } from 'expo-sqlite'

let db = null

async function getDb() {
  if (!db) {
    db = await openDatabaseAsync('leituraativa.db')
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS books (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        title TEXT NOT NULL,
        author TEXT NOT NULL,
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
      CREATE TABLE IF NOT EXISTS reflections (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id TEXT NOT NULL,
        book_id INTEGER NOT NULL,
        reading_time INTEGER NOT NULL DEFAULT 0,
        reflection_time INTEGER NOT NULL DEFAULT 0,
        text TEXT NOT NULL DEFAULT '',
        created_at TEXT NOT NULL DEFAULT (datetime('now'))
      );
    `)
  }
  return db
}

export async function getBooks(userId) {
  const database = await getDb()
  return await database.getAllAsync(
    'SELECT * FROM books WHERE user_id = ? ORDER BY created_at DESC',
    [userId]
  )
}

export async function createBook(userId, title, author) {
  const database = await getDb()
  const result = await database.runAsync(
    'INSERT INTO books (user_id, title, author) VALUES (?, ?, ?)',
    [userId, title, author]
  )
  const book = await database.getFirstAsync(
    'SELECT * FROM books WHERE id = ?',
    [result.lastInsertRowId]
  )
  return book
}

export async function getReflections(userId, bookId) {
  const database = await getDb()
  if (bookId) {
    return await database.getAllAsync(
      `SELECT r.*, b.title as book_title, b.author as book_author
       FROM reflections r
       LEFT JOIN books b ON r.book_id = b.id
       WHERE r.user_id = ? AND r.book_id = ?
       ORDER BY r.created_at DESC`,
      [userId, bookId]
    )
  }
  return await database.getAllAsync(
    `SELECT r.*, b.title as book_title, b.author as book_author
     FROM reflections r
     LEFT JOIN books b ON r.book_id = b.id
     WHERE r.user_id = ?
     ORDER BY r.created_at DESC`,
    [userId]
  )
}

export async function saveReflection(reflection) {
  const database = await getDb()
  const result = await database.runAsync(
    `INSERT INTO reflections (user_id, book_id, reading_time, reflection_time, text)
     VALUES (?, ?, ?, ?, ?)`,
    [reflection.user_id, reflection.book_id, reflection.reading_time || 0, reflection.reflection_time || 0, reflection.text || '']
  )
  const item = await database.getFirstAsync(
    'SELECT * FROM reflections WHERE id = ?',
    [result.lastInsertRowId]
  )
  return item
}
