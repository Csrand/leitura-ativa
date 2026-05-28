import React from 'react'
import { View, StyleSheet } from 'react-native'
import { Text } from 'react-native-elements'

export default function ReflectionCard({ reflection }) {
  const mins = Math.floor(reflection.reading_time_seconds / 60)
  const date = new Date(reflection.created_at).toLocaleDateString('pt-BR')
  const modeLabel = reflection.mode === 'timer' ? 'Timer' : 'Cronômetro'

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.bookTitle}>
          {reflection.books?.title || 'Livro'}
        </Text>
        <Text style={styles.date}>{date}</Text>
      </View>
      <Text style={styles.meta}>
        {modeLabel} · {mins} min de leitura
      </Text>
      {reflection.text ? (
        <Text style={styles.text} numberOfLines={3}>
          {reflection.text}
        </Text>
      ) : (
        <Text style={styles.emptyText}>Sem anotações</Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  card: {
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  bookTitle: { fontSize: 16, fontWeight: '600' },
  date: { fontSize: 12, color: 'gray' },
  meta: { fontSize: 12, color: 'gray', marginBottom: 8 },
  text: { fontSize: 14, lineHeight: 20 },
  emptyText: { fontSize: 14, color: '#ccc', fontStyle: 'italic' },
})
