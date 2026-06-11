import React, { useState, useEffect, useCallback } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, Alert, ScrollView, TextInput, ActivityIndicator } from 'react-native'
import { useAuthStore } from '../../stores/auth-store'
import { useReadingStore } from '../../stores/reading-store'
import { getBooks, createBook } from '../../lib/db'
import BookList from '../../components/book-list'
import BookForm from '../../components/book-form'

export default function HomeScreen({ onNavigate }) {
  const user = useAuthStore((s) => s.user)
  const signOut = useAuthStore((s) => s.signOut)
  const startSession = useReadingStore((s) => s.startSession)

  const [books, setBooks] = useState([])
  const [selectedBook, setSelectedBook] = useState(null)
  const [mode, setMode] = useState('timer')
  const [readingMinutes, setReadingMinutes] = useState('10')
  const [showBookForm, setShowBookForm] = useState(false)

  const loadBooks = useCallback(async () => {
    if (!user) return
    const data = await getBooks(user.id)
    setBooks(data)
  }, [user])

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
    onNavigate('Leitura')
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>LeituraAtiva</Text>
        <TouchableOpacity onPress={signOut}>
          <Text style={styles.link}>Sair</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Livros</Text>
      <BookList
        books={books}
        selectedBook={selectedBook}
        onSelect={setSelectedBook}
      />
      <TouchableOpacity style={styles.outlineButton} onPress={() => setShowBookForm(true)}>
        <Text style={styles.outlineButtonText}>+ Novo Livro</Text>
      </TouchableOpacity>

      {showBookForm && (
        <BookForm
          onSubmit={handleCreateBook}
          onCancel={() => setShowBookForm(false)}
        />
      )}

      <Text style={styles.sectionTitle}>Modo de Leitura</Text>
      <View style={styles.modeRow}>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'timer' && styles.modeButtonActive]}
          onPress={() => setMode('timer')}
        >
          <Text style={[styles.modeButtonText, mode === 'timer' && styles.modeButtonTextActive]}>Timer</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.modeButton, mode === 'cronometro' && styles.modeButtonActive]}
          onPress={() => setMode('cronometro')}
        >
          <Text style={[styles.modeButtonText, mode === 'cronometro' && styles.modeButtonTextActive]}>Cronômetro</Text>
        </TouchableOpacity>
      </View>

      {mode === 'timer' && (
        <View>
          <Text style={styles.label}>Tempo de leitura (minutos)</Text>
          <TextInput
            style={styles.input}
            value={readingMinutes}
            onChangeText={setReadingMinutes}
            keyboardType="numeric"
          />
        </View>
      )}

      <TouchableOpacity style={styles.primaryButton} onPress={handleStart}>
        <Text style={styles.primaryButtonText}>Iniciar Leitura</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => onNavigate('Historico')}>
        <Text style={[styles.link, { marginTop: 16 }]}>Histórico</Text>
      </TouchableOpacity>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 60 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24,
  },
  appTitle: { fontSize: 24, fontWeight: 'bold' },
  link: { color: '#2089dc', fontSize: 16 },
  sectionTitle: { fontSize: 18, fontWeight: '600', marginBottom: 12, marginTop: 16 },
  modeRow: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  modeButton: {
    flex: 1, padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#2089dc', alignItems: 'center',
  },
  modeButtonActive: { backgroundColor: '#2089dc' },
  modeButtonText: { color: '#2089dc', fontWeight: '600' },
  modeButtonTextActive: { color: '#fff' },
  label: { fontSize: 14, color: '#666', marginBottom: 6 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16,
    marginBottom: 16, backgroundColor: '#fff',
  },
  outlineButton: {
    padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#2089dc',
    alignItems: 'center', marginTop: 8,
  },
  outlineButtonText: { color: '#2089dc', fontWeight: '600' },
  primaryButton: {
    backgroundColor: '#2089dc', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 24,
  },
  primaryButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
