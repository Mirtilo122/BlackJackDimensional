export interface Character {
  id: number;
  name: string;
  image: string;
}

export async function obterCharacter(id: number): Promise<Character> {
  try {
    const res = await fetch(`https://rickandmortyapi.com/api/character/${id}`);
    if (!res.ok) throw new Error("Erro ao obter personagem");
    const data = await res.json();
    return {
      id: data.id,
      name: data.name,
      image: data.image,
    };
  } catch (err) {
    console.error(err);
    return { id, name: "Desconhecido", image: "" };
  }
}