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

      const response = await fetch(`${API_URL}/books/user`, {
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

  const deleteBook = async(bookId) => {
    try {
      const response = await fetch(`${API_URL}/books/${bookId}`, {
        method: "DELETE",
        headers: {Authorization: `Bearer ${token}`},
      })
      const data = await response.json()
      if (!response.ok) throw new Error(data.message || "Ocorreu um erro ao tenter excluir a postagem")
        setBooks(books.filter((book) => book._id !== bookId))

      Alert.alert("Tudo certo!", "Sua postagem foi excluida.")
      } catch (error) {
        Alert.alert("Erro", error.message || "Sua postagem não pôde ser excluida")
    }
  }

  const confirmDelete = (bookId) => {
    Alert.alert("Atenção", "Tem certeza que quer excluir essa postagem?", [
      {text: "Cancelar", style: "cancel"},
      {text: "Excluir", style: "destructive", onPress: () => deleteBook(bookId)}
    ])
  }

  const renderBook = ({ item }) => (
    <View style={styles.bookItem}>
      <Image source={item.image} style={styles.bookImage} />
      <View style={styles.bookInfo}>
        <Text style={styles.bookTitle}>{item.title}</Text>
        <View style={styles.ratingContainer}>{renderStars(item.rating)}</View>

        <Text style={styles.bookDetails} numberOfLines={2}> {item.description}</Text>
      </View>

      <TouchableOpacity style={styles.deleteButton} onPress={() => confirmDelete(item._id)}>
        <Ionicons name='trash-outline' size={24} color={COLORS.primary}/>
      </TouchableOpacity>
    </View>
  )



  const renderStars = (rating) => {
    const stars = []
    for (let i = 1; i <= 5; i++)
    stars.push(
      <Ionicons 
      key={i}
      name={i <= rating ? 'star' : "star-outline"}
      size={16}
      color={i <= rating ? '#d5d20b' : COLORS.textSecondary}
      style={{marginRight: 3}}

      />
    )
    // tem que retornar a funcao imbecil
    return stars;
  }

  return (
    <View style={styles.container}>

      <Header />
      <Logout />

      <View style={styles.bookHeader}>
        <Text style={styles.booksTitle}>Suas leituras</Text>
        {/* <Text style={styles.booksCount} >   {books.length} livros</Text> */}
        <FlatList
          data={books}
          renderItem={renderBook}
          keyExtractor={(item) => item._id}
          contentContainerStyle={styles.booksList}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Ionicons name='book-outline' size={40} color={COLORS.textSecondary} />
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
