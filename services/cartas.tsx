// services/cartas.ts
export const API_BASE = "https://deckofcardsapi.com/api/deck";

export interface CartaAPI {
  code: string;
  value: string;
  suit: string;
  image: string;
}

export interface DeckResponse {
  success: boolean;
  deck_id: string;
  shuffled: boolean;
  remaining: number;
}

export interface ComprarResponse {
  success: boolean;
  cards: CartaAPI[];
  deck_id: string;
  remaining: number;
}

export async function criarDeck(): Promise<DeckResponse> {
  try {
    const res = await fetch(`${API_BASE}/new/shuffle/?deck_count=6`);
    return await res.json();
  } catch (error) {
    console.error("Erro ao criar deck:", error);
    throw error;
  }
}

export async function comprarUma(deckId: string): Promise<ComprarResponse> {
  try {
    const res = await fetch(`${API_BASE}/${deckId}/draw/?count=1`);
    return await res.json();
  } catch (error) {
    console.error("Erro ao comprar 1 carta:", error);
    throw error;
  }
}

export async function comprarDuas(deckId: string): Promise<ComprarResponse> {
  try {
    const res = await fetch(`${API_BASE}/${deckId}/draw/?count=2`);
    return await res.json();
  } catch (error) {
    console.error("Erro ao comprar 2 cartas:", error);
    throw error;
  }
}
