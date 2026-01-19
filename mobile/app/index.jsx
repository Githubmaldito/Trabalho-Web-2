import { Text, View } from "react-native";
import { Link } from "expo-router";
import useAuthStore from "../store/authStore";
import { useEffect } from "react";


export default function Index() {
  const { user, token, checkAuth } = useAuthStore();
  console.log(user, token);
  useEffect(() => {
    checkAuth();
  }, []);
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OI. {user ? `Bem-vindo, ${user.username}!` : 'Bem-vindo!'}</Text>
      {/* apenas "auth é suficiente já que index é o padrão" */}
      <Link href="/(auth)">  Login </Link>
      <Link href="/(auth)/cadastro"> Cadastro </Link>
    </View>
  );
}
const styles = {
  container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
  },
  title: {
    fontWeight: 'bold',
    alignItems: 'center',
    fontSize: 30,
    marginBottom: 50,
    color: 'red'
  }

};
