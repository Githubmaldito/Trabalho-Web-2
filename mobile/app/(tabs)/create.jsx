import { View, Text, ScrollView, TextInput, TouchableOpacity, Image, Platform, Alert, ActivityIndicator, KeyboardAvoidingView } from 'react-native'
import { useState } from 'react'
import { useRouter } from 'expo-router'
import styles from '../../assets/styles/create.styles'
import { Ionicons, Ionicosns } from '@expo/vector-icons'
import COLORS from '../../constants/colors'
import * as ImagePicker from 'expo-image-picker'
import useAuthStore from '../../store/authStore'
import { API_URL } from '../../constants/api'
import * as FileSystem from 'expo-file-system';

const Create = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [rating, setRating] = useState(0)
  const [image, setImage] = useState(null);//mostrar a imagem 
  const [imageBase64, setImageBase64] = useState(null)//converte a imagem para base64 pra que os computadores compartilhem pela internet 
  const [loading, setLoading] = useState(false);

  const router = useRouter()
  const { token } = useAuthStore()

  // analisar token
  const analyzeToken = (token) => {
  if (!token) {
    console.log('❌ Token é null ou undefined');
    return;
  }
  
  console.log('🔍 ANALISANDO TOKEN:');
  console.log('Comprimento total:', token.length);
  console.log('Primeiros 50 chars:', token.substring(0, 50));
  console.log('Últimos 50 chars:', token.substring(token.length - 50));
  
  // Verifica se é um JWT válido (deve ter 3 partes separadas por ponto)
  const parts = token.split('.');
  console.log('Número de partes:', parts.length);
  
  if (parts.length === 3) {
    try {
      // Decodifica o payload (parte do meio)
      const payload = JSON.parse(atob(parts[1]));
      console.log('📋 Payload decodificado:', payload);
      
      // Verifica expiração
      if (payload.exp) {
        const expDate = new Date(payload.exp * 1000);
        const now = new Date();
        console.log('⏰ Expira em:', expDate.toLocaleString());
        console.log('🕐 Agora é:', now.toLocaleString());
        console.log('⏳ Já expirou?', now > expDate);
        
        if (now > expDate) {
          console.log('🚨 TOKEN EXPIRADO!');
        }
      }
      
      if (payload.iat) {
        const iatDate = new Date(payload.iat * 1000);
        console.log('📅 Criado em:', iatDate.toLocaleString());
      }
      
      console.log('👤 User ID no token:', payload.id || payload._id || payload.userId);
      
    } catch (e) {
      console.log('❌ Erro ao decodificar payload:', e.message);
    }
  } else {
    console.log('❌ Token não está no formato JWT (deveria ter 3 partes)');
  }
};
  // console.log("SEU T|OKEN È", token)
  const pickImage = async () => {
    try {
      // permissões
      if (Platform.OS !== 'web') {
        // nome grande da poura 
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('É preciso de permissão para acessar as imagens.');
          return;
        }
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        // dixq tá depreciada mas nã otá dando porbliema
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.7,
        base64: true,
      });
      if (!result.canceled) {
        setImage(result.assets[0].uri);

        // se a img for em base64

        if (result.assets[0].base64) {
          setImageBase64(result.assets[0].base64);
        } else {
          // senao consverte pra base64
          const base64 = await FileSystem.readAsStringAsync(result.assets[0].uri, {
            encoding: 'base64'
          });
          setImageBase64(base64)

        }
      }
    } catch (error) {
      Alert.alert('Erro', 'Ocorreu um erro ao selecionar a imagem.');
    }
  }
  const handleSubmit = async () => {
    if (!title || !description || !imageBase64 || !rating) {
      Alert.alert('Erro', "Preencha todos os campos")
      return;
    }

    try {
      setLoading(true);

      console.log("Analisando token")
      analyzeToken()

      const uriParts = image.split(".")
      const fileType = uriParts[uriParts.length - 1]
      // se nao conseguir o type, é um jpeg default
      const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image.jpeg"

      const imageDataUrl = `data:${imageType};base64,${imageBase64}`

      console.log('🔍 DEBUG - Token completo:', token);
      console.log('🔍 DEBUG - Header que será enviado:', {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json"
      });
      const response = await fetch(`${API_URL}/books`, {
        method: "POST",
        headers: {
          Authorization: `Olá, ${token}`,
          "Content-Type": "applicaton/json",
        },
        body: JSON.stringify({
          title,
          description,
          rating: rating.toString(),
          image: imageDataUrl,
        }),
      })

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Algum erro ocorreu")

      Alert.alert("Sua recomendação foi postada")
      setTitle("")
      setDescription("")
      setRating(1)
      setImage(null)
      setImageBase64(null)
      router.push("/")
    } catch (error) {
      console.error("Erro ao poster", error)
      Alert.alert("Erro", error.message || 'Algo deu errado ao criar seu Post')
    } finally {
      setLoading(false)
    }
  }
  const avaliar = () => {
    let stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <TouchableOpacity key={i} onPress={() => setRating(i)}>
          <Ionicons
            name={i <= rating ? "star" : "star-outline"}
            size={30} color={i <= rating ? COLORS.primary : COLORS.gray}
            style={styles.starIcon}
          />
        </TouchableOpacity>
      )
    }
    return stars;
  }

  return (
    // isso faz com que o teclado nao sobreponha o texto
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView style={styles.scrollViewStyle}>
        <View style={styles.card}>
          {/* header do post */}
          <View style={styles.header}>
            <Text style={styles.title}>Adicionar recomendação</Text>
            <Text style={styles.subtitle}>Compartilhe sua experiência</Text>
          </View>
          {/* form do post */}
          <View style={styles.form}>
            {/* outro header */}
            <View>
              <View style={styles.formGroup}>
                <Text style={styles.label}>Título</Text>
                <View style={styles.inputContainer}>
                  <Ionicons
                    name="book-outline"
                    size={20}
                    color={COLORS.gray}
                    style={styles.inputIcon}
                  />
                  <TextInput
                    style={styles.input}
                    placeholder="Digite o título do livro"
                    value={title}
                    // tinha esquecido disso. n tava dando certo
                    onChangeText={setTitle}
                    placeholderTextColor={COLORS.placeholderTextColorr}
                  />
                </View>
              </View>
            </View>
            {/* rating */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Nota</Text>
              <View style={styles.ratingContainer}>
                {/*avaliação*/}
                {avaliar()}
              </View>
            </View>
            {/* Imagem */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Imagem</Text>
              <TouchableOpacity style={styles.imagePicker} onPress={pickImage}>
                {image ? (
                  <Image source={{ uri: image }} style={styles.previewImage} />
                ) : (
                  <View style={styles.placeholderContainer}>
                    <Ionicons
                      name="image-outline" size={40} color={COLORS.textSecondary} />
                    <Text style={styles.placeholderText}>Selecionar imagem</Text>
                  </View>
                )}
              </TouchableOpacity>
            </View>
            {/* descrição */}
            <View style={styles.formGroup}>
              <Text style={styles.label}>Descrição</Text>
              <TextInput
                style={styles.textArea}
                placeholder="Descreva a sua experiência com o livro"
                placeholderTextColor={COLORS.placeholderTextColor}
                multiline
                onChangeText={setDescription}
              // numberOfLines={5}
              />
            </View>
            {/* botão de enviar */}
            <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <>
                  <Ionicons
                    name="cloud-upload-outline"
                    size={20}
                    color={COLORS.white}
                    style={styles.buttonIcon}
                  />
                  <Text style={styles.buttonText}>Compartilhar</Text>
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

export default Create