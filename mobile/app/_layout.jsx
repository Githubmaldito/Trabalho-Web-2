import { Stack, useRouter, useSegments } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SafeScreen from "./components/SafeScreen";
import useAuthStore from "../store/authStore";
import { StatusBar } from "react-native";
import { useEffect } from "react";
export default function RootLayout() {
  const router = useRouter();
  // mostea onde estamos na navegação
  const segments = useSegments();
  // console.log(segments);

  const { checkAuth, user, token } = useAuthStore()

  useEffect(() => {
    checkAuth();
  }, []) 

  useEffect(() => {
    const isAuthScreen = segments[0] === "(auth)";
    const isSignedIn = user && token;
 
    //se não estiver na tela de autenticação e não estiver autenticado
    //redireciona para a tela de autenticação
    if (!isAuthScreen && !isSignedIn) {
      router.replace("/(auth)");
    } else if (isAuthScreen && isSignedIn) router.replace("/(tabs)");
  }, [segments, user, token, router])

  return (
    <SafeAreaProvider>
      <SafeScreen>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" /> 
         <Stack.Screen name="(auth)" />
        </Stack>
      </SafeScreen>
    </SafeAreaProvider>
  )
}
 