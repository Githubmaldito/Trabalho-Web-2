import { View, Text, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React from 'react'
import styles from '../../assets/styles/login.styles'
import { useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
// o import precisa esyar entre chcveds
import { Link } from 'expo-router';
import COLORS from '../../constants/colors';

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const handleLogin = () => {
    // Lógica de login aqui
  }


  return (
    <View style={styles.container}>
      {/* imagem do login */}
      <View style={styles.topIllustration}>
        <Image
          source={require('../../assets/images/livro-login.png')}
          style={styles.illustrationImage}
          resizeMode="contain"
        />
      </View>
      {/* form de login */}
      <View style={styles.card}>
        <View style={styles.formContainer}>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              {/* ícone de email */}
              <Ionicons
                name='mail-outline'
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Digite o seu email"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>


          </View>
          {/* input de senha */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Senha</Text>
            <View style={styles.inputContainer}>
              <Ionicons
                name='lock-closed-outline'
                size={20}
                color={COLORS.primary}
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                placeholder="Digite a sua senha"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <Ionicons
                name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                size={20}
                color={COLORS.primary}
                onPress={() => setShowPassword(!showPassword)}
              />

            </View>
          </View>

          <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Caso não tenha uma conta</Text>
            <Link href="/cadastro" asChild>
              <TouchableOpacity>
                <Text style={styles.link}>pode se cadastrar aqui</Text>
              </TouchableOpacity>

            </Link>
          </View>
        </View>
      </View>
    </View>
  )
}
export default Login