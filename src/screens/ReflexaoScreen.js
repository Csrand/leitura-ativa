import React, { useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { Text, Input, Button } from 'react-native-elements'
import { useAuthStore } from '../stores/auth-store'
import { useReadingStore } from '../stores/reading-store'
import { saveReflection } from '../lib/db'
import Timer from '../components/timer'

export default function ReflexaoScreen({ navigation }) {
  const user = useAuthStore((s) => s.user)
  const {
    phase,
    book,
    mode,
    readingSeconds,
    reflectionSeconds,
    reflectionTarget,
    reflectionText,
    setReflectionText,
    finishReflecting,
    reset,
  } = useReadingStore()

  const [saving, setSaving] = useState(false)

  if (!book || !user) {
    navigation.replace('Home')
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
          navigation.replace('Home')
        }},
      ])
    } catch (err) {
      Alert.alert('Erro', err.message)
    } finally {
      setSaving(false)
    }
  }

  const handleSkipReflection = () => {
    finishReflecting()
  }

  return (
    <View style={styles.container}>
      <Text h4 style={styles.bookTitle}>{book.title}</Text>

      {phase === 'reflecting' && (
        <>
          <View style={styles.reflectContainer}>
            <Text h1 style={styles.reflectIcon}>🧠</Text>
            <Text h3 style={styles.reflectText}>Reflita sobre o que leu</Text>
            <Timer seconds={reflectionTarget - reflectionSeconds} />
            <Text style={styles.reflectSubtext}>
              Tempo de reflexão: {Math.ceil(reflectionTarget / 60)} min
            </Text>
          </View>
          <Button
            title="Pular reflexão"
            type="clear"
            onPress={handleSkipReflection}
          />
        </>
      )}

      {phase === 'writing' && (
        <>
          <Text style={styles.writeLabel}>Escreva sobre o que refletiu</Text>
          <Input
            placeholder="Seus pensamentos..."
            value={reflectionText}
            onChangeText={setReflectionText}
            multiline
            numberOfLines={6}
            inputStyle={styles.textInput}
          />
          <Button
            title="Salvar"
            onPress={handleSave}
            loading={saving}
            containerStyle={styles.saveButton}
          />
        </>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  bookTitle: { textAlign: 'center', marginBottom: 32 },
  reflectContainer: { alignItems: 'center', marginBottom: 24 },
  reflectIcon: { fontSize: 64, marginBottom: 16 },
  reflectText: { textAlign: 'center', marginBottom: 24 },
  reflectSubtext: { marginTop: 8, color: 'gray' },
  writeLabel: { fontSize: 16, marginBottom: 16, textAlign: 'center' },
  textInput: { minHeight: 120, textAlignVertical: 'top' },
  saveButton: { marginTop: 16 },
})
