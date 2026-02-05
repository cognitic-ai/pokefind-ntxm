import * as AC from "@bacons/apple-colors";
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

import { PokemonCard } from "@/components/pokemon-card";
import { useFavorites } from "@/context/favorites-context";
import { fetchPokemon, Pokemon } from "@/utils/pokemon";

export default function FavoritesScreen() {
  const { favorites } = useFavorites();
  const [pokemonList, setPokemonList] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (favorites.length === 0) {
      setPokemonList([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    Promise.all(favorites.map((id) => fetchPokemon(id))).then((data) => {
      setPokemonList(data);
      setLoading(false);
    });
  }, [favorites]);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: AC.systemBackground,
        }}
      >
        <ActivityIndicator size="large" color={AC.systemBlue} />
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: AC.systemBackground,
          padding: 40,
        }}
      >
        <Text style={{ fontSize: 64, marginBottom: 16 }}>💔</Text>
        <Text
          style={{
            color: AC.label,
            fontSize: 20,
            fontWeight: "600",
            textAlign: "center",
            marginBottom: 8,
          }}
        >
          No Favorites Yet
        </Text>
        <Text
          style={{
            color: AC.secondaryLabel,
            fontSize: 15,
            textAlign: "center",
            marginBottom: 24,
          }}
        >
          Tap the heart on any Pokémon to add them to your favorites
        </Text>
        <Link href="/(pokedex)" asChild>
          <Pressable
            style={{
              backgroundColor: AC.systemBlue,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 12,
              borderCurve: "continuous",
            }}
          >
            <Text style={{ color: "white", fontWeight: "600", fontSize: 16 }}>
              Browse Pokédex
            </Text>
          </Pressable>
        </Link>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: AC.systemBackground }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={{ padding: 16 }}>
        <Text style={{ color: AC.secondaryLabel, fontSize: 14, marginBottom: 12 }}>
          {favorites.length} {favorites.length === 1 ? "Pokémon" : "Pokémon"} in your collection
        </Text>
      </View>

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          padding: 8,
          gap: 12,
        }}
      >
        {pokemonList.map((p, index) => (
          <View key={p.id} style={{ width: "47%", minWidth: 150, flexGrow: 1 }}>
            <PokemonCard pokemon={p} index={index} />
          </View>
        ))}
      </View>
    </ScrollView>
  );
}
