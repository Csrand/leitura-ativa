import React from 'react'
import { View, Text, StyleSheet } from 'react-native'

export default function Timer({ seconds }) {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  const display = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`

  return (
    <View style={styles.container}>
      <Text style={styles.time}>{display}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { alignItems: 'center' },
  time: { fontSize: 64, fontWeight: '200', letterSpacing: 4 },
})
