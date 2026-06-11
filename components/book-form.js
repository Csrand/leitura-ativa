import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ActivityIndicator } from 'react-native'

export default function BookForm({ onSubmit, onCancel }) {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!title.trim()) return
    setLoading(true)
    try {
      await onSubmit(title.trim(), author.trim())
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Título do livro"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Autor (opcional)"
        value={author}
        onChangeText={setAuthor}
      />
      <View style={styles.buttons}>
        <TouchableOpacity style={styles.smallButton} onPress={handleSubmit} disabled={loading}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.smallButtonText}>Salvar</Text>}
        </TouchableOpacity>
        <TouchableOpacity onPress={onCancel}>
          <Text style={styles.cancelText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12, borderRadius: 8, borderWidth: 1, borderColor: '#ddd', marginTop: 8,
  },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 10, fontSize: 16,
    marginBottom: 12, backgroundColor: '#fff',
  },
  buttons: { flexDirection: 'row', justifyContent: 'flex-end', alignItems: 'center', gap: 12 },
  smallButton: {
    backgroundColor: '#2089dc', paddingHorizontal: 20, paddingVertical: 10, borderRadius: 8,
    minWidth: 100, alignItems: 'center',
  },
  smallButtonText: { color: '#fff', fontWeight: '600' },
  cancelText: { color: '#2089dc', fontSize: 16 },
})
