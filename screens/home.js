import React from "react";
import { View, Text, Button, StyleSheet } from "react-native";

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Blackjack</Text>
      <Button title="Jogar" onPress={() => navigation.navigate("blackjack")} />
      <View style={{ marginTop: 20 }}>
        <Button title="Sair" color="red" onPress={() => alert("Fechar app não é suportado direto")} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#5C4033", justifyContent: "center", alignItems: "center" },
  title: { fontSize: 32, fontWeight: "bold", color: "white", marginBottom: 40 },
});
