import React, { useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { Text, Input, Button } from 'react-native-elements'
import { useAuthStore } from '../stores/auth-store'

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const signIn = useAuthStore((s) => s.signIn)

  const handleLogin = async () => {
    setLoading(true)
    try {
      await signIn(email, password)
    } catch (err) {
      Alert.alert('Erro', err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text h2 style={styles.title}>LeituraAtiva</Text>
      <Input
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        keyboardType="email-address"
      />
      <Input
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button
        title="Entrar"
        onPress={handleLogin}
        loading={loading}
        containerStyle={styles.button}
      />
      <Button
        title="Criar conta"
        type="clear"
        onPress={() => navigation.navigate('Cadastro')}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { textAlign: 'center', marginBottom: 32 },
  button: { marginVertical: 8 },
})
