import React from 'react'
import { View, StyleSheet, TouchableOpacity } from 'react-native'
import { Text } from 'react-native-elements'

export default function BookList({ books, selectedBook, onSelect }) {
  if (books.length === 0) {
    return <Text style={styles.empty}>Nenhum livro cadastrado.</Text>
  }

  return (
    <View style={styles.container}>
      {books.map((book) => (
        <TouchableOpacity
          key={book.id}
          style={[
            styles.card,
            selectedBook?.id === book.id && styles.selected,
          ]}
          onPress={() => onSelect(book)}
        >
          <Text style={styles.title}>{book.title}</Text>
          {book.author ? <Text style={styles.author}>{book.author}</Text> : null}
        </TouchableOpacity>
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 8 },
  empty: { textAlign: 'center', color: 'gray', marginVertical: 16 },
  card: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#f9f9f9',
  },
  selected: {
    borderColor: '#2089dc',
    backgroundColor: '#e8f4fd',
  },
  title: { fontSize: 16, fontWeight: '600' },
  author: { fontSize: 13, color: 'gray', marginTop: 2 },
})
