import { obterCharacter } from "../services/rick";

export interface JogadorPerfil {
  nome: string;
  profileImage: string;
}

export async function gerarPerfisJogadores(): Promise<JogadorPerfil[]> {
  const jogador1 = await obterCharacter(1);

  const ids: number[] = [];
  while (ids.length < 3) {
    const id = Math.floor(Math.random() * 299) + 2;
    if (!ids.includes(id)) ids.push(id);
  }

  const bots = await Promise.all(ids.map((id) => obterCharacter(id)));

  return [
    { nome: jogador1.name, profileImage: jogador1.image },
    ...bots.map((b) => ({ nome: b.name, profileImage: b.image })),
  ];
}
