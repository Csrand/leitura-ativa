import React, { useEffect } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, Button } from 'react-native-elements'
import { useReadingStore } from '../stores/reading-store'
import Timer from '../components/timer'

export default function LeituraScreen({ navigation }) {
  const { book, mode, readingSeconds, readingTimeLimit, finishReading, reset, phase } =
    useReadingStore()

  useEffect(() => {
    return () => { reset() }
  }, [])

  useEffect(() => {
    if (phase !== 'reading') return
  }, [phase])

  if (!book) {
    navigation.replace('Home')
    return null
  }

  const remaining =
    mode === 'timer'
      ? Math.max(0, readingTimeLimit - readingSeconds)
      : readingSeconds

  return (
    <View style={styles.container}>
      <Text h4 style={styles.bookTitle}>{book.title}</Text>
      <Text style={styles.author}>{book.author}</Text>

      <View style={styles.timerContainer}>
        <Timer seconds={mode === 'timer' ? remaining : readingSeconds} />
        <Text style={styles.modeLabel}>
          {mode === 'timer' ? 'TEMPO RESTANTE' : 'TEMPO DECORRIDO'}
        </Text>
      </View>

      <Button
        title="Finalizar Sessão"
        onPress={() => {
          finishReading()
          navigation.replace('Reflexao')
        }}
        buttonStyle={styles.finishButton}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  bookTitle: { textAlign: 'center', marginBottom: 4 },
  author: { textAlign: 'center', color: 'gray', marginBottom: 48 },
  timerContainer: { alignItems: 'center', marginBottom: 64 },
  modeLabel: { marginTop: 8, color: 'gray', letterSpacing: 2 },
  finishButton: {
    paddingHorizontal: 32,
    paddingVertical: 14,
    backgroundColor: '#e74c3c',
  },
})
