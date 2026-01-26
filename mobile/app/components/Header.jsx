import { View, Text } from 'react-native'
import useAuthStore from '../../store/authStore'
import React from 'react'
import { Image } from 'expo-image'
import styles from '../../assets/styles/perfil.styles'
const Header = () => {
    const {user} = useAuthStore()

  return (
    <View style={styles.profileHeader}>
        <Image source={{uri: user.profileImage}} style={styles.profileImage}/>


    </View>
  )
}

export default Header