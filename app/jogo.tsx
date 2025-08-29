import React, { useEffect, useState } from "react";
import { View, Text, Button, StyleSheet, ScrollView, Image } from "react-native";
import { comprarECalcular, parar, Carta, embaralhar, comprarDuasCartas, calcularPontuacao} from "../utils/blackjack";
import { gerarPerfisJogadores } from "./../utils/rick";

interface Jogador {
  mao: Carta[];
  pontuacao: number;
  estado: "Jogando" | "Parado" | "Estourou" | "Blackjack";
  nome: string;
  profileImage: string;
}

export default function Jogo() {
  const [deckId, setDeckId] = useState<string | null>(null);
  const [jogadores, setJogadores] = useState<Jogador[]>([]);
  const [vez, setVez] = useState<number>(0);
  const [vencedores, setVencedores] = useState<string[]>([]);

  useEffect(() => {
    async function init() {
      const deck = await embaralhar();
      setDeckId(deck);

      const perfis = await gerarPerfisJogadores();

      const jogadoresIniciais: Jogador[] = await Promise.all(
        perfis.map(async (perfil) => {
          const cartas = await comprarDuasCartas(deck);
          const pontuacao = calcularPontuacao(cartas);
          return {
            mao: cartas,
            pontuacao,
            estado: pontuacao === 21 ? "Blackjack" : "Jogando",
            nome: perfil.nome,
            profileImage: perfil.profileImage,
          };
        })
      );

      setJogadores(jogadoresIniciais);
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
  }, [vez, jogadores, deckId]);
  

  async function comprarCarta(index: number) {
    const jogador = jogadores[index];
    const atualizado = await comprarECalcular(deckId as string, jogador);

    const novos = [...jogadores];
    novos[index] = atualizado;
    setJogadores(novos);

    if (atualizado.estado === "Estourou" || atualizado.estado === "Blackjack") {
      proximoJogador();
    }
  }

  function pararJogador(index: number) {
    const jogador = jogadores[index];
    const atualizado = parar(jogador);

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
    const validos = jogadores
      .map((j, idx) => ({ ...j, idx }))
      .filter((j) => j.pontuacao <= 21);

    if (validos.length === 0) {
      setVencedores(["Ninguém"]);
      return;
    }

    const maior = Math.max(...validos.map((j) => j.pontuacao));

    const ganhadores = validos
      .filter((j) => j.pontuacao === maior)
      .map((j) => `Jogador ${j.idx + 1}`);

    setVencedores(ganhadores);
  }
  jogadores.forEach(j => console.log(j.nome, j.profileImage));

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }} style={styles.container}>
      <Text style={styles.titulo}>Blackjack</Text>

      {jogadores.map((j, idx) => (
        <View key={idx} style={styles.jogadorBox}>
          <Text style={styles.jogadorTitulo}>
            {j.nome} {idx === 0 ? "(Você)" : ""}
          </Text>
          <Image
            source={{ uri: j.profileImage }}
            style={{ width: 60, height: 60, borderRadius: 30, marginBottom: 5 }}
          />
          <Text>Pontuação: {j.pontuacao}</Text>
          <Text>Estado: {j.estado}</Text>

          <ScrollView horizontal>
            {j.mao.map((c, i) => (
              <Image
                key={i}
                source={{ uri: c.image }}
                style={{ width: 60, height: 90, marginRight: 5 }}
              />
            ))}
          </ScrollView>

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
        <Text style={styles.vencedor}>
          🏆 Vencedor(es): {vencedores.join(", ")}
        </Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  titulo: { fontSize: 22, fontWeight: "bold", marginBottom: 20 },
  jogadorBox: { marginBottom: 15, padding: 10, borderWidth: 1, borderRadius: 8 },
  jogadorTitulo: { fontSize: 18, fontWeight: "bold" },
  acoes: { flexDirection: "row", justifyContent: "space-around", marginTop: 10 },
  vencedor: { fontSize: 20, marginTop: 20 },
});
