import { View, Text } from 'react-native'
import React from 'react'
import { Tabs } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import COLORS from '../../constants/colors'

export default function TabLayout() {
  return (
    <Tabs
    screenOptions={{
      headerShown: false,
      tabBarActiveTintColor: COLORS.primary,
      tabBarStyle: {
        backgroundColor: COLORS.cardBackground,
        borderTopColor: COLORS.border,
        borderTopWidth: 2,
      },
    }}

    >
        <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="home-outline" size={size} color={color} />
          )
        }}/>

        <Tabs.Screen 
        name="create"
        options={{
          title: "Post",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="add-circle-outline" size={size} color={color} />
          )
        }}/>

        <Tabs.Screen
        name="perfil"
        options={{
          title: "Perfil",
          tabBarIcon: ({color, size}) => (
            <Ionicons name="person-outline" size={size} color={color} />
          )
        }}/>

    </Tabs>
  )
}