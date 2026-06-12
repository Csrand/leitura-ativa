import React, { useState } from 'react'
import { View, StatusBar } from 'react-native'
import HomeScreen from './src/screens/HomeScreen'
import LeituraScreen from './src/screens/LeituraScreen'
import ReflexaoScreen from './src/screens/ReflexaoScreen'
import HistoricoScreen from './src/screens/HistoricoScreen'

export default function App() {
  const [screen, setScreen] = useState('Home')
  const [navParams, setNavParams] = useState({})

  const navigate = (name, params = {}) => {
    setScreen(name)
    setNavParams(params)
  }

  const screens = {
    Home: <HomeScreen onNavigate={navigate} />,
    Leitura: <LeituraScreen onNavigate={navigate} params={navParams} />,
    Reflexao: <ReflexaoScreen onNavigate={navigate} />,
    Historico: <HistoricoScreen onNavigate={navigate} />,
  }

  return (
    <View style={{ flex: 1 }}>
      <StatusBar barStyle="dark-content" />
      {screens[screen]}
    </View>
  )
}
