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
  // const handleSubmit = async () => {
  //   if (!title || !description || !imageBase64 || !rating) {
  //     Alert.alert('Erro', "Preencha todos os campos")
  //     return;
  //   }

  //   try {
  //     setLoading(true);

  //     console.log("Analisando token")
  //     // analyzeToken()

  //     const uriParts = image.split(".")
  //     const fileType = uriParts[uriParts.length - 1]
  //     // se nao conseguir o type, é um jpeg default
  //     const imageType = fileType ? `image/${fileType.toLowerCase()}` : "image.jpeg"

  //     const imageDataUrl = `data:${imageType};base64,${imageBase64}`

  //     console.log('🔍 DEBUG - Token completo:', token);
     
  //     const response = await fetch(`${API_URL}/books`, {
  //       method: "POST",
  //       headers: {
  //         Authorization: `Bearer ${token}`,
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({
  //         title,
  //         description,
  //         // rating: rating.toString(),
  //         rating: Number(rating),
  //         image: imageDataUrl,
  //       }),
  //     })

  //     const data = await response.json();
  //     if (!response.ok) throw new Error(data.message || "Algum erro ocorreu")

  //     Alert.alert("Sua recomendação foi postada")
  //     setTitle("")
  //     setDescription("")
  //     setRating(1)
  //     setImage(null)
  //     setImageBase64(null)
  //     router.push("/") 
  //   } catch (error) {
  //     console.error("Erro ao poster", error)
  //     Alert.alert("Erro", error.message || 'Algo deu errado ao criar seu Post')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

const handleSubmit = async () => {
  if (!title || !description || !imageBase64 || !rating) {
    Alert.alert('Erro', "Preencha todos os campos");
    return;
  }

  try {
    setLoading(true);

    console.log("=== INICIANDO POSTAGEM DEBUG ===");
    console.log("1. Token existe?", !!token);
    console.log("2. Token (20 primeiros):", token ? token.substring(0, 20) + "..." : "null");
    
    // Reduzir o tamanho da imagem para teste
    const smallImageBase64 = imageBase64.substring(0, 50000); // Primeiros 50kb apenas
    console.log("3. Imagem reduzida para:", smallImageBase64.length, "caracteres");
    
    const imageDataUrl = `data:image/jpeg;base64,${smallImageBase64}`;
    
    const payload = {
      title,
      description,
      rating: Number(rating),
      image: imageDataUrl,
    };
    
    console.log("4. Payload (sem imagem):", {
      title,
      description,
      rating: Number(rating),
      imageLength: imageDataUrl.length
    });
    
    console.log("5. URL:", `${API_URL}/books`);
    
    // FAZ A REQUISIÇÃO
    const response = await fetch(`${API_URL}/books`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    console.log("6. Status:", response.status);
    console.log("7. Status Text:", response.statusText);
    
    // PEGA COMO TEXTO PRIMEIRO
    const responseText = await response.text();
    console.log("8. Resposta COMPLETA (texto):", responseText);
    
    // Verifica se está vazia
    if (!responseText || responseText.trim() === '') {
      console.error("❌ Resposta VAZIA do servidor!");
      throw new Error("O servidor não retornou resposta. Pode ser erro no backend.");
    }
    
    // Verifica se é HTML (erro do servidor)
    if (responseText.includes('<!DOCTYPE') || responseText.includes('<html')) {
      console.error("❌ Servidor retornou HTML em vez de JSON");
      const errorMatch = responseText.match(/<title>(.*?)<\/title>/i) || 
                         responseText.match(/<h1>(.*?)<\/h1>/i);
      const errorMsg = errorMatch ? errorMatch[1] : "Erro no servidor";
      throw new Error(errorMsg);
    }
    
    // Tenta parsear JSON
    let data;
    try {
      data = JSON.parse(responseText);
      console.log("9. JSON parseado com sucesso:", data);
    } catch (parseError) {
      console.error("❌ ERRO AO PARSEAR JSON:", parseError.message);
      console.error("❌ Resposta que falhou:", responseText.substring(0, 200));
      throw new Error(`Resposta inválida do servidor: ${responseText.substring(0, 50)}`);
    }
    
    // // Verifica se a resposta é OK
    // if (!response.ok) {
    //   console.error("10. Resposta não OK. Erro:", data);
    //   throw new Error(data.message || data.error || `Erro ${response.status}`);
    // }
    
    // // Verifica se tem estrutura esperada
    // if (!data.success && !data.message) {
    //   console.warn("⚠️ Resposta sem estrutura padrão:", data);
    // }

    console.log("✅ POST BEM-SUCEDIDO!");
    Alert.alert("Sucesso!", "A sua recomendação foi postada.");
    
    // Reset
    setTitle("");
    setDescription("");
    setRating(0);
    setImage(null);
    setImageBase64(null);
    
    // Navegação com delay
    setTimeout(() => {
      router.push("/(tabs)");
    }, 1500);
    
  } catch (error) {
    console.error("🔥 ERRO DETALHADO NO CATCH:");
    console.error("Mensagem:", error.message);
    console.error("Stack:", error.stack);
    
    // Mensagens mais amigáveis
    let userMessage = error.message;
    
    if (error.message.includes('JSON')) {
      userMessage = "Erro na resposta do servidor. Tente novamente.";
    } else if (error.message.includes('Network')) {
      userMessage = "Erro de conexão. Verifique sua internet.";
    } else if (error.message.includes('token') || error.message.includes('auth')) {
      userMessage = "Problema de autenticação. Faça login novamente.";
    }
    
    Alert.alert("❌ Erro", userMessage);
  } finally {
    setLoading(false);
  }
};

  const avaliar = () => {    let stars = [];
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