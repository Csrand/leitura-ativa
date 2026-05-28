import React, { useState } from 'react'
import { View, StyleSheet, Alert } from 'react-native'
import { Text, Input, Button } from 'react-native-elements'
import { useAuthStore } from '../stores/auth-store'

export default function CadastroScreen({ navigation }) {
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
      <Text h2 style={styles.title}>Criar Conta</Text>
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
        title="Cadastrar"
        onPress={handleSignUp}
        loading={loading}
        containerStyle={styles.button}
      />
      <Button
        title="Já tenho conta"
        type="clear"
        onPress={() => navigation.goBack()}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 24 },
  title: { textAlign: 'center', marginBottom: 32 },
  button: { marginVertical: 8 },
})
