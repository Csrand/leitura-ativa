import React, { useState, useCallback, useEffect } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Alert } from 'react-native'
import { useAuthStore } from '../../stores/auth-store'
import { getReflections } from '../../lib/db'
import ReflectionCard from '../../components/reflection-card'

export default function HistoricoScreen({ onNavigate }) {
  const user = useAuthStore((s) => s.user)
  const [reflections, setReflections] = useState([])
  const [loading, setLoading] = useState(true)

  const loadReflections = useCallback(async () => {
    if (!user) return
    setLoading(true)
    try {
      const data = await getReflections(user.id)
      setReflections(data)
    } catch (err) {
      Alert.alert('Erro', err.message)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => { loadReflections() }, [loadReflections])

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => onNavigate('Home')}>
          <Text style={styles.link}>Voltar</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Histórico</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading && <Text style={styles.empty}>Carregando...</Text>}

      {!loading && reflections.length === 0 && (
        <Text style={styles.empty}>Nenhuma reflexão salva ainda.</Text>
      )}

      {reflections.map((r) => (
        <ReflectionCard key={r.id} reflection={r} />
      ))}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  container: { padding: 16, paddingTop: 60 },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24,
  },
  title: { fontSize: 22, fontWeight: 'bold' },
  link: { color: '#2089dc', fontSize: 16 },
  empty: { textAlign: 'center', color: 'gray', marginTop: 60, fontSize: 16 },
})
