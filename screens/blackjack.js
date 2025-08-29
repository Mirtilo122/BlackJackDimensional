import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, Image  } from "react-native";
import { criarDeck } from "../services/cartas";
import { comprarECalcular, parar } from "./../utils/blackjack";
import { gerarPerfisJogadores } from "./../utils/rick";

export default function Jogo() {
  const [deckId, setDeckId] = useState(null);
  const [jogadores, setJogadores] = useState([]);
  const [vez, setVez] = useState(0);
  const [vencedores, setVencedores] = useState([]);

  useEffect(() => {
    async function init() {
      const deck = await criarDeck();
      const perfis = await gerarPerfisJogadores();

      setDeckId(deck.deck_id);

      const inicial = perfis.map((perfil) => ({
        mao: [],
        pontuacao: 0,
        estado: "Jogando",
        nome: perfil.nome,
        imagem: perfil.profileImage,
      }));

      setJogadores(inicial);
    }
    init();
  }, []);

  useEffect(() => {
    if (deckId && vez > 0 && vez < jogadores.length) {
      const bot = jogadores[vez];
      if (bot.estado === "Jogando") {
        if (bot.pontuacao < 16) {
          setTimeout(() => comprarCarta(vez), 1000);
        } else {
          pararJogador(vez);
        }
      }
    }
  }, [vez, jogadores]);

  async function comprarCarta(index) {
    const jogador = jogadores[index];
    const atualizado = await comprarECalcular(deckId, jogador.mao);

    const novos = [...jogadores];
    novos[index] = atualizado;
    setJogadores(novos);

    if (atualizado.estado === "Estourou" || atualizado.estado === "Blackjack") {
      proximoJogador();
    }
  }

  function pararJogador(index) {
    const jogador = jogadores[index];
    const atualizado = parar(jogador.mao);

    const novos = [...jogadores];
    novos[index] = atualizado;
    setJogadores(novos);

    proximoJogador();
  }

  function proximoJogador() {
    if (vez < jogadores.length - 1) {
      setVez(vez + 1);
    } else {
      verificarVencedor();
    }
  }

  function verificarVencedor() {
    const validos = jogadores.filter(
      (j) => j.estado !== "Estourou"
    );

    if (validos.length === 0) {
      setVencedores(["Ninguém"]);
      return;
    }

    const maior = Math.max(...validos.map((j) => j.pontuacao));
    const ganhadores = validos
      .map((j, idx) => ({ nome: `Jogador ${idx + 1}`, ...j }))
      .filter((j) => j.pontuacao === maior);

    setVencedores(ganhadores.map((g) => g.nome));
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} style={styles.container}>
      <Text style={styles.titulo}> 
        Blackjack
      </Text>

      {jogadores.map((j, idx) => (
        <View key={idx} style={{ marginBottom: 15, padding: 10, borderWidth: 1, borderRadius: 8 }}>
          <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 5 }}>
            <Image 
              source={{ uri: j.imagem }} 
              style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }} 
            />
            <Text style={{ fontSize: 18, fontWeight: "bold" }}>
              {j.nome} {idx === 0 ? "(Você)" : ""}
            </Text>
          </View>

          <Text>Pontuação: {j.pontuacao}</Text>
          <Text>Estado: {j.estado}</Text>
          <Text>
            Cartas: {j.mao.map((c) => c.image).join(", ")}
          </Text>

          {vez === idx && idx === 0 && j.estado === "Jogando" && (
            <View style={styles.acoes}>
              <Button title="Comprar" onPress={() => comprarCarta(idx)} />
              <View style={{ width: 10 }} />
              <Button title="Parar" onPress={() => pararJogador(idx)} />
            </View>
          )}
        </View>
      ))}

      {vencedores.length > 0 && (
        <Text style={{ fontSize: 20, marginTop: 20 }}>
          🏆 Vencedor(es): {vencedores.join(", ")}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  acoes: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
});
