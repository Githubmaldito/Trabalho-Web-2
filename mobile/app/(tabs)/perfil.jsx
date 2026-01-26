import { View, Text, Alert, LogoutB } from 'react-native'
import { useEffect, useState } from 'react'
import {useRouter} from 'expo-router'
import { TouchableOpacity } from 'react-native'
import Header from '../components/Header'
import useAuthStore from '../../store/authStore'
import styles from '../../assets/styles/perfil.styles'
import React from 'react'
import { API_URL } from '../../constants/api'


const Perfil = () => {

  const {token} = useAuthStore()
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(true)
  // const {logout} = useAuthStore()
  const router = useRouter()

  const fetchData = async () => {
    try {
      setIsLoading(true)

      const response = await fetch(`${API_URL}/books/user`, {
        headers: {Authorization: `Bearer ${token}`},
      })

      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Erro ao obter os livros")
      
      setBooks(data) 

    } catch (error) {
      console.log("Erro ao obter livos console", error)
      Alert.alert("Erro", "falho ao pegar dados. Tente novamente mais tarde")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <View style={styles.container}>

      <Header />
      
    </View>
  )
}

export default Perfil