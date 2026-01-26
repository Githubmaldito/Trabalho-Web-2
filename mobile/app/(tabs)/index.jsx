import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import useAuthStore from "../../store/authStore";
import { Image } from "expo-image";
import { useEffect, useState } from "react";
import styles from "../../assets/styles/home.styles";
import { API_URL } from "../../constants/api";
import { Ionicons } from "@expo/vector-icons";
import COLORS from "../../constants/colors";

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// formatar data
const formatPublishDate = (dateString) => {
  if (!dateString) return "Data desconhecida";

  try {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Agora mesmo";
    if (diffMins < 60) return `Há ${diffMins} minuto${diffMins > 1 ? 's' : ''}`;
    if (diffHours < 24) return `Há ${diffHours} hora${diffHours > 1 ? 's' : ''}`;
    if (diffDays < 7) return `Há ${diffDays} dia${diffDays > 1 ? 's' : ''}`;

    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  } catch (error) {
    return "Data desconhecida";
  }
};

export default function Home() {
  const { token } = useAuthStore();
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [expandedBooks, setExpandedBooks] = useState({});

  const fetchBooks = async (pageNum = 1, refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else if (pageNum === 1) {
        setLoading(true);
      }

      const response = await fetch(`${API_URL}/books?page=${pageNum}&limit=2`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Falha ao acessar os livros");
      }

      const data = await response.json();

      const booksData = data.livros || [];

      // Remover livros duplicados usando o código modelo
      const uniqueBooks = refresh || pageNum === 1
        ? booksData
        : Array.from(new Set([...books, ...booksData].map((book) => book._id)))
          .map((id) => [...books, ...booksData].find((book) => book._id === id));

      setBooks(uniqueBooks);
      setHasMore(pageNum < (data.totalPages || 1));
      setPage(pageNum);

    } catch (error) {
      console.error("Erro ao carregar livros:", error);
    } finally {
      if (refresh) {
        await sleep(800);
        setRefreshing(false);
      } else {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleLoadMore = async () => {
    if (hasMore && !loading && !refreshing) {
      await fetchBooks(page + 1);
    }
  };

  const toggleDescription = (bookId) => {
    setExpandedBooks(prev => ({
      ...prev,
      [bookId]: !prev[bookId]
    }));
  };

  const renderRatingStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <Ionicons
          key={i}
          name={i <= rating ? "star" : "star-outline"}
          size={16}
          color={i <= rating ? "#f4b400" : COLORS.textSecondary}
          style={{ marginRight: 2 }}
        />
      );
    }
    return stars;
  };

  const renderItem = ({ item }) => {
    if (!item) return null;

    const user = item.user || {};
    const username = user.username;
    const profileImage = user.profileImage || "https://via.placeholder.com/50";
    const imageUrl = item.image || "https://via.placeholder.com/300";
    const title = item.title;
    const description = item.description;
    const rating = item.rating;
    const bookId = item._id;
    const isExpanded = expandedBooks[bookId];
    const isLongDescription = description.length > 50;

    return (
      <View style={styles.bookCard}>
        <View style={styles.bookHeader}>
          <View style={styles.userInfo}>
            <Image source={{ uri: profileImage }} style={styles.avatar} />
            <Text style={styles.username}>{username}</Text>
          </View>
        </View>

        <View style={styles.bookImageContainer}>
          <Image source={{ uri: imageUrl }} style={styles.bookImage} contentFit="cover" />
        </View>

        <View style={styles.bookDetails}>
          <Text style={styles.bookTitle}>{title}</Text>

          <View style={styles.ratingContainer}>
            {renderRatingStars(rating)}
            <Text style={{ marginLeft: 5, color: COLORS.textSecondary, fontSize: 14 }}>
              {rating}/5
            </Text>
          </View>

          <View>
            <Text
              style={styles.caption}
              numberOfLines={isExpanded ? undefined : 3}
            >
              {description}
            </Text>

            {isLongDescription && (
              <TouchableOpacity
                onPress={() => toggleDescription(bookId)}
                activeOpacity={0.7}
                style={{ marginTop: 2 }}
              >
                <Text style={{
                  color: COLORS.primary,
                  fontWeight: '500',
                  fontSize: 14,
                }}>
                  {isExpanded ? 'Mostrar menos' : 'Ler mais'}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {item.createdAt && (
            <Text style={styles.date}>
              Postado em {formatPublishDate(item.createdAt)}
            </Text>
          )}
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={books}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
//recarregr a pagina
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={() => fetchBooks(1, true)}
            colors={[COLORS.primary]}
            tintColor={COLORS.primary}
          />
        }
        onEndReached={handleLoadMore}
        onEndReachedThreshold={0.1}
        ListHeaderComponent={
          <View style={styles.header}>
  {/* pensar em um tituilo */}
            <Text style={styles.headerTitle}>Placeholder</Text>
            <Text style={styles.headerSubtitle}>Descubra ótimas leituras da comunidade 👇</Text>
          </View>
        }
        ListFooterComponent={
          hasMore && books.length > 0 ? (
            <ActivityIndicator
              style={styles.footerLoader}
              size="small"
              color={COLORS.primary}
            />
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Ionicons name="book-outline" size={60} color={COLORS.textSecondary} />
            <Text style={styles.emptyText}>Nenhuma recomendação ainda</Text>
            <Text style={styles.emptySubtext}>Seja o primeiro a compartilhar um livro!</Text>
          </View>
        }
      />
    </View>
  );
}