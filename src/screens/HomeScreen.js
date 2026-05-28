import React, { useState, useEffect, useCallback } from 'react'
import { View, StyleSheet, Alert, ScrollView } from 'react-native'
import { Text, Button, Input } from 'react-native-elements'
import { useAuthStore } from '../stores/auth-store'
import { useReadingStore } from '../stores/reading-store'
import { getBooks, createBook } from '../lib/db'
import BookList from '../components/book-list'
import BookForm from '../components/book-form'
import type { Book, ReadingMode } from '../types'

export default function HomeScreen({ navigation }) {
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)
  const startSession = useReadingStore((s) => s.startSession)

  const [books, setBooks] = useState<Book[]>([])
  const [selectedBook, setSelectedBook] = useState<Book | null>(null)
  const [mode, setMode] = useState<ReadingMode>('timer')
  const [readingMinutes, setReadingMinutes] = useState('10')
  const [showBookForm, setShowBookForm] = useState(false)

  const loadBooks = useCallback(async () => {
    if (!user) return
    const data = await getBooks(user.id)
    setBooks(data)
  }, [user])

  useEffect(() => {
    const unsubscribe = navigation.addListener('focus', loadBooks)
    return unsubscribe
  }, [loadBooks, navigation])

  useEffect(() => { loadBooks() }, [loadBooks])

  const handleCreateBook = async (title, author) => {
    if (!user) return
    const book = await createBook(user.id, title, author)
    setBooks((prev) => [book, ...prev])
    setShowBookForm(false)
  }

  const handleStart = () => {
    if (!selectedBook) {
      Alert.alert('Selecione um livro', 'Escolha um livro para começar.')
      return
    }

    const readingTimeLimit = mode === 'timer' ? parseInt(readingMinutes, 10) * 60 : 0
    if (mode === 'timer' && (isNaN(readingTimeLimit) || readingTimeLimit <= 0)) {
      Alert.alert('Tempo inválido', 'Defina um tempo válido em minutos.')
      return
    }

    startSession(mode, selectedBook, readingTimeLimit)
    navigation.navigate('Leitura')
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text h2>LeituraAtiva</Text>
        <Button title="Sair" type="clear" onPress={signOut} />
      </View>

      <Text h4 style={styles.sectionTitle}>Livros</Text>
      <BookList
        books={books}
        selectedBook={selectedBook}
        onSelect={setSelectedBook}
      />
      <Button
        title="+ Novo Livro"
        type="outline"
        onPress={() => setShowBookForm(true)}
        containerStyle={styles.button}
      />

      {showBookForm && (
        <BookForm
          onSubmit={handleCreateBook}
          onCancel={() => setShowBookForm(false)}
        />
      )}

      <Text h4 style={styles.sectionTitle}>Modo de Leitura</Text>
      <View style={styles.modeRow}>
        <Button
          title="Timer"
          type={mode === 'timer' ? 'solid' : 'outline'}
          onPress={() => setMode('timer')}
          containerStyle={styles.modeButton}
        />
        <Button
          title="Cronômetro"
          type={mode === 'cronometro' ? 'solid' : 'outline'}
          onPress={() => setMode('cronometro')}
          containerStyle={styles.modeButton}
        />
      </View>

      {mode === 'timer' && (
        <Input
          label="Tempo de leitura (minutos)"
          value={readingMinutes}
          onChangeText={setReadingMinutes}
          keyboardType="numeric"
        />
      )}

      <Button
        title="Iniciar Leitura"
        onPress={handleStart}
        containerStyle={styles.startButton}
        buttonStyle={{ paddingVertical: 14 }}
      />

      <Button
        title="Histórico"
        type="clear"
        onPress={() => navigation.navigate('Historico')}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 60 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  sectionTitle: { marginBottom: 12, marginTop: 16 },
  modeRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  modeButton: { flex: 1 },
  button: { marginTop: 8 },
  startButton: { marginTop: 24 },
})
