import { supabase } from './supabase'

export async function getBooks(userId) {
  const { data, error } = await supabase
    .from('books')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function createBook(userId, title, author) {
  const { data, error } = await supabase
    .from('books')
    .insert({ user_id: userId, title, author })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getReflections(userId, bookId) {
  let query = supabase
    .from('reflections')
    .select('*, books(title, author)')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })

  if (bookId) query = query.eq('book_id', bookId)

  const { data, error } = await query
  if (error) throw error
  return data
}

export async function saveReflection(reflection) {
  const { data, error } = await supabase
    .from('reflections')
    .insert(reflection)
    .select()
    .single()

  if (error) throw error
  return data
}
