import { View, Text, Alert, LogoutB, FlatList } from 'react-native'
import Logout from '../components/Logout'
import { useEffect, useState } from 'react'
import { useRouter } from 'expo-router'
import { TouchableOpacity } from 'react-native'
import Header from '../components/Header'
import useAuthStore from '../../store/authStore'
import styles from '../../assets/styles/perfil.styles'
import React from 'react'
import { API_URL } from '../../constants/api'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'
import { Image } from 'expo-image'


const Perfil = () => {

  const { token } = useAuthStore()
  const [books, setBooks] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(true)
  // const {logout} = useAuthStore()
  const router = useRouter()

  const fetchData = async () => {
    try {
      setIsLoading(true)

      const response = await fetch(`${API_URL}/books`, {
        headers: { Authorization: `Bearer ${token}` },
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

  const renderBook = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>

      </View>
    </View>
  )


  return (
    <View style={styles.container}>

      <Header />
      <Logout />

      <View style={styles.bookHeader}>
        <Text style={styles.booksTitle}>Suas leituras</Text>

        <FlatList
          data={books}
          renderItem={renderBook}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.booksList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name='book-outline' size={60} color={COLORS.textSecondary} />
              <Text styles={styles.emptyText}>Você ainda não postou nada.</Text>
              <TouchableOpacity style={styles.addButton} onPress={() => router.push("/create")}>
                <Text style={styles.addButtonText}>Compartilhe sua leitura.</Text>
              </TouchableOpacity>
            </View>
          }
        />

      </View>
    </View>
  )
}

export default Perfil