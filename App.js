import React, { useEffect, useState } from 'react'
import { ActivityIndicator, View, StatusBar } from 'react-native'
import { useAuthStore } from './stores/auth-store'
import LoginScreen from './src/screens/LoginScreen'
import CadastroScreen from './src/screens/CadastroScreen'
import HomeScreen from './src/screens/HomeScreen'
import LeituraScreen from './src/screens/LeituraScreen'
import ReflexaoScreen from './src/screens/ReflexaoScreen'
import HistoricoScreen from './src/screens/HistoricoScreen'

export default function App() {
  const { user, loading, initialize } = useAuthStore()
  const [ready, setReady] = useState(false)
  const [screen, setScreen] = useState(null)
  const [navParams, setNavParams] = useState({})

  useEffect(() => {
    initialize().then(() => setReady(true))
  }, [])

  const navigate = (name, params = {}) => {
    setScreen(name)
    setNavParams(params)
  }

  if (loading || !ready) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    )
  }

  const currentScreen = screen || (user ? 'Home' : 'Login')

  const screens = {
    Login: <LoginScreen onNavigate={navigate} />,
    Cadastro: <CadastroScreen onNavigate={navigate} />,
    Home: <HomeScreen onNavigate={navigate} />,
    Leitura: <LeituraScreen onNavigate={navigate} params={navParams} />,
    Reflexao: <ReflexaoScreen onNavigate={navigate} />,
    Historico: <HistoricoScreen onNavigate={navigate} />,
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      {screens[currentScreen] || screens.Login}
    </View>
  )
}
