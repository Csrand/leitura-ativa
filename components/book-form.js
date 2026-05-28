import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Input, Button } from 'react-native-elements'

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
      <Input
        placeholder="Título do livro"
        value={title}
        onChangeText={setTitle}
      />
      <Input
        placeholder="Autor (opcional)"
        value={author}
        onChangeText={setAuthor}
      />
      <View style={styles.buttons}>
        <Button
          title="Salvar"
          onPress={handleSubmit}
          loading={loading}
          containerStyle={styles.button}
        />
        <Button
          title="Cancelar"
          type="clear"
          onPress={onCancel}
          containerStyle={styles.button}
        />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginTop: 8,
  },
  buttons: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8 },
  button: { minWidth: 100 },
})
