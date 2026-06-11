import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { useAuthStore } from '../../stores/auth-store'
import { useReadingStore } from '../../stores/reading-store'
import { saveReflection } from '../../lib/db'
import Timer from '../../components/timer'

export default function ReflexaoScreen({ onNavigate }) {
  const user = useAuthStore((s) => s.user)
  const {
    phase, book, mode, readingSeconds,
    reflectionSeconds, reflectionTarget, reflectionText,
    setReflectionText, finishReflecting, reset,
  } = useReadingStore()

  const [saving, setSaving] = useState(false)

  if (!book || !user) {
    onNavigate('Home')
    return null
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      await saveReflection({
        user_id: user.id,
        book_id: book.id,
        mode: mode,
        reading_time_seconds: readingSeconds,
        reflection_time_seconds: reflectionTarget,
        text: reflectionText,
      })
      Alert.alert('Salvo', 'Sua reflexão foi salva.', [
        { text: 'OK', onPress: () => {
          reset()
          onNavigate('Home')
        }},
      ])
    } catch (err) {
      Alert.alert('Erro', err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.bookTitle}>{book.title}</Text>

      {phase === 'reflecting' && (
        <>
          <View style={styles.reflectContainer}>
            <Text style={styles.reflectIcon}>🧠</Text>
            <Text style={styles.reflectText}>Reflita sobre o que leu</Text>
            <Timer seconds={reflectionTarget - reflectionSeconds} />
            <Text style={styles.reflectSubtext}>
              Tempo de reflexão: {Math.ceil(reflectionTarget / 60)} min
            </Text>
          </View>
          <TouchableOpacity onPress={finishReflecting}>
            <Text style={styles.link}>Pular reflexão</Text>
          </TouchableOpacity>
        </>
      )}

      {phase === 'writing' && (
        <>
          <Text style={styles.writeLabel}>Escreva sobre o que refletiu</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Seus pensamentos..."
            value={reflectionText}
            onChangeText={setReflectionText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
          />
          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
            {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Salvar</Text>}
          </TouchableOpacity>
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  bookTitle: { fontSize: 20, fontWeight: '600', textAlign: 'center', marginBottom: 32 },
  reflectContainer: { alignItems: 'center', marginBottom: 24 },
  reflectIcon: { fontSize: 64, marginBottom: 16 },
  reflectText: { fontSize: 22, fontWeight: '600', textAlign: 'center', marginBottom: 24 },
  reflectSubtext: { marginTop: 8, color: 'gray' },
  link: { color: '#2089dc', textAlign: 'center', fontSize: 16 },
  writeLabel: { fontSize: 16, marginBottom: 16, textAlign: 'center' },
  textInput: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16,
    minHeight: 120, backgroundColor: '#fff', marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#2089dc', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 16,
  },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
})
