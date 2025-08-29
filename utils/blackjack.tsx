import { comprarUma, criarDeck, comprarDuas } from "../services/cartas";

export type Estado = "Jogando" | "Parado" | "Estourou" | "Blackjack";

export interface Carta {
  code: string;
  value: string;
  suit: string;
  image: string;
}

export interface Jogador {
  mao: Carta[];
  pontuacao: number;
  estado: Estado;
}


export async function embaralhar(): Promise<string> {
  const res = await criarDeck();
  return res.deck_id;
}

export async function comprarDuasCartas(deckId: string): Promise<Carta[]> {
  const res = await comprarDuas(deckId);

  return res.cards.map((c: Carta) => ({
    code: c.code,
    value: c.value || "0",
    suit: c.suit || "",
    image: c.image || "",
  }));
}

export async function comprarECalcular(deckId: string, maoAtual: Carta[]): Promise<Jogador> {
  try {
    const res = await comprarUma(deckId);
    const novaCartaAPI = res.cards[0];

    const novaCarta: Carta = {
      code: novaCartaAPI.code,
      value: novaCartaAPI.value || "0",
      suit: novaCartaAPI.suit || "",
      image: novaCartaAPI.image || "",
    };

    const novaMao = [...maoAtual, novaCarta];
    const pontuacao = calcularPontuacao(novaMao);

    let estado: Estado = "Jogando";
    if (pontuacao > 21) estado = "Estourou";
    else if (pontuacao === 21) estado = "Blackjack";

    return {
      mao: novaMao,
      pontuacao,
      estado,
    };
  } catch (error) {
    console.error("Erro ao comprar e calcular:", error);
    throw error;
  }
}

export function parar(maoAtual: Carta[]): Jogador {
  const pontuacao = calcularPontuacao(maoAtual);

  return {
    mao: maoAtual,
    pontuacao,
    estado: "Parado",
  };
}

export function calcularPontuacao(mao: Carta[]): number {
  let total = 0;
  let ases = 0;

  mao.forEach((carta) => {
    const valor = carta.value;
    if (["KING", "QUEEN", "JACK"].includes(valor)) total += 10;
    else if (valor === "ACE") {
      ases += 1;
      total += 11;
    } else total += parseInt(valor);
  });

  while (total > 21 && ases > 0) {
    total -= 10;
    ases -= 1;
  }

  return total;
}
