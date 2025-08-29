import { Link } from "expo-router";
import { View, Text, Button } from "react-native";

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Blackjack</Text>
      <Link href="/jogo" asChild>
        <Button title="Iniciar Jogo" />
      </Link>
    </View>
  );
}
