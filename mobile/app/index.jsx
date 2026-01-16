import { Text, View } from "react-native";
import { Link } from "expo-router";

export default function Index() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>OI.</Text>
      {/* apenas "auth é suficiente já que index é o padrão" */}
      <Link href="/(auth)"> Login </Link>
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
    fontSize: 60,
    color: 'red'
  }

};
