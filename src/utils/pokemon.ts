export interface Pokemon {
  id: number;
  name: string;
  types: string[];
  height: number;
  weight: number;
  stats: {
    hp: number;
    attack: number;
    defense: number;
    specialAttack: number;
    specialDefense: number;
    speed: number;
  };
  abilities: string[];
}

export const POKEMON_TYPES = [
  "normal",
  "fire",
  "water",
  "electric",
  "grass",
  "ice",
  "fighting",
  "poison",
  "ground",
  "flying",
  "psychic",
  "bug",
  "rock",
  "ghost",
  "dragon",
  "dark",
  "steel",
  "fairy",
] as const;

export type PokemonType = (typeof POKEMON_TYPES)[number];

export const TYPE_COLORS: Record<PokemonType, string> = {
  normal: "#A8A878",
  fire: "#F08030",
  water: "#6890F0",
  electric: "#F8D030",
  grass: "#78C850",
  ice: "#98D8D8",
  fighting: "#C03028",
  poison: "#A040A0",
  ground: "#E0C068",
  flying: "#A890F0",
  psychic: "#F85888",
  bug: "#A8B820",
  rock: "#B8A038",
  ghost: "#705898",
  dragon: "#7038F8",
  dark: "#705848",
  steel: "#B8B8D0",
  fairy: "#EE99AC",
};

export function getTypeColor(type: string): string {
  return TYPE_COLORS[type as PokemonType] || "#A8A878";
}

export async function fetchPokemonList(limit = 151): Promise<Pokemon[]> {
  const response = await fetch(
    `https://pokeapi.co/api/v2/pokemon?limit=${limit}`
  );
  const data = await response.json();

  const pokemonPromises = data.results.map(
    async (pokemon: { url: string }, index: number) => {
      const detailResponse = await fetch(pokemon.url);
      const detail = await detailResponse.json();
      return transformPokemonData(detail);
    }
  );

  return Promise.all(pokemonPromises);
}

export async function fetchPokemon(id: number): Promise<Pokemon> {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();
  return transformPokemonData(data);
}

function transformPokemonData(data: any): Pokemon {
  return {
    id: data.id,
    name: data.name,
    types: data.types.map((t: any) => t.type.name),
    height: data.height,
    weight: data.weight,
    stats: {
      hp: data.stats[0].base_stat,
      attack: data.stats[1].base_stat,
      defense: data.stats[2].base_stat,
      specialAttack: data.stats[3].base_stat,
      specialDefense: data.stats[4].base_stat,
      speed: data.stats[5].base_stat,
    },
    abilities: data.abilities.map((a: any) => a.ability.name),
  };
}
