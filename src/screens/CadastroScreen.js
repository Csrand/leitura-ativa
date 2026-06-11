import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native'
import { useAuthStore } from '../../stores/auth-store'

export default function CadastroScreen({ onNavigate }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const signUp = useAuthStore((s) => s.signUp)

  const handleSignUp = async () => {
    setLoading(true)
    try {
      await signUp(email, password)
      Alert.alert('Conta criada', 'Verifique seu email para confirmar.')
    } catch (err) {
      Alert.alert('Erro', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Criar Conta</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <TouchableOpacity style={styles.button} onPress={handleSignUp} disabled={loading}>
        {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.buttonText}>Cadastrar</Text>}
      </TouchableOpacity>
      <TouchableOpacity onPress={() => onNavigate('Login')}>
        <Text style={styles.link}>Já tenho conta</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { fontSize: 28, fontWeight: 'bold', textAlign: 'center', marginBottom: 32 },
  input: {
    borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 12, fontSize: 16,
    marginBottom: 16, backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#2089dc', padding: 14, borderRadius: 8, alignItems: 'center', marginVertical: 8,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  link: { color: '#2089dc', textAlign: 'center', marginTop: 16, fontSize: 16 },
})
