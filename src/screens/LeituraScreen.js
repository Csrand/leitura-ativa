import React, { useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native'
import { useReadingStore } from '../../stores/reading-store'
import Timer from '../../components/timer'

export default function LeituraScreen({ onNavigate }) {
  const { book, mode, readingSeconds, readingTimeLimit, finishReading, reset, phase } =
    useReadingStore()

  useEffect(() => {
    return () => { reset() }
  }, [])

  if (!book) {
    onNavigate('Home')
    return null
  }

  const remaining =
    mode === 'timer'
      ? Math.max(0, readingTimeLimit - readingSeconds)
      : readingSeconds

  return (
    <View style={styles.container}>
      <Text style={styles.bookTitle}>{book.title}</Text>
      <Text style={styles.author}>{book.author}</Text>

      <View style={styles.timerContainer}>
        <Timer seconds={mode === 'timer' ? remaining : readingSeconds} />
        <Text style={styles.modeLabel}>
          {mode === 'timer' ? 'TEMPO RESTANTE' : 'TEMPO DECORRIDO'}
        </Text>
      </View>

      <TouchableOpacity style={styles.finishButton} onPress={() => {
        finishReading()
        onNavigate('Reflexao')
      }}>
        <Text style={styles.finishButtonText}>Finalizar Sessão</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 24 },
  bookTitle: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 4 },
  author: { fontSize: 14, color: 'gray', textAlign: 'center', marginBottom: 48 },
  timerContainer: { alignItems: 'center', marginBottom: 64 },
  modeLabel: { marginTop: 8, color: 'gray', letterSpacing: 2, fontSize: 12 },
  finishButton: {
    paddingHorizontal: 32, paddingVertical: 14, backgroundColor: '#e74c3c', borderRadius: 8,
  },
  finishButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
