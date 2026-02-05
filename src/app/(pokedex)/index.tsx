import * as AC from "@bacons/apple-colors";
import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  Text,
  View,
} from "react-native";

import { PokemonCard } from "@/components/pokemon-card";
import { TypeFilter } from "@/components/type-filter";
import useSearch from "@/hooks/use-search";
import {
  fetchPokemonList,
  Pokemon,
  PokemonType,
} from "@/utils/pokemon";

export default function PokedexScreen() {
  const [pokemon, setPokemon] = useState<Pokemon[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTypes, setSelectedTypes] = useState<PokemonType[]>([]);
  const search = useSearch({ placeholder: "Search Pokémon" });

  useEffect(() => {
    fetchPokemonList(151).then((data) => {
      setPokemon(data);
      setLoading(false);
    });
  }, []);

  const handleToggleType = useCallback((type: PokemonType) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  }, []);

  const handleClearFilters = useCallback(() => {
    setSelectedTypes([]);
  }, []);

  const filteredPokemon = useMemo(() => {
    let result = pokemon;

    if (search) {
      const searchLower = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(searchLower) ||
          String(p.id).includes(searchLower)
      );
    }

    if (selectedTypes.length > 0) {
      result = result.filter((p) =>
        p.types.some((type) => selectedTypes.includes(type as PokemonType))
      );
    }

    return result;
  }, [pokemon, search, selectedTypes]);

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
        <Text style={{ color: AC.secondaryLabel, marginTop: 16, fontSize: 16 }}>
          Loading Pokémon...
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: AC.systemBackground }}
      contentInsetAdjustmentBehavior="automatic"
    >
      <TypeFilter
        selectedTypes={selectedTypes}
        onToggleType={handleToggleType}
        onClearFilters={handleClearFilters}
      />

      <View
        style={{
          flexDirection: "row",
          flexWrap: "wrap",
          padding: 8,
          gap: 12,
        }}
      >
        {filteredPokemon.map((p, index) => (
          <View key={p.id} style={{ width: "47%", minWidth: 150, flexGrow: 1 }}>
            <PokemonCard pokemon={p} index={index} />
          </View>
        ))}
      </View>

      {filteredPokemon.length === 0 && (
        <View
          style={{
            padding: 40,
            alignItems: "center",
          }}
        >
          <Text style={{ fontSize: 48, marginBottom: 12 }}>🔍</Text>
          <Text
            style={{
              color: AC.secondaryLabel,
              fontSize: 17,
              textAlign: "center",
            }}
          >
            No Pokémon found
          </Text>
          <Text
            style={{
              color: AC.tertiaryLabel,
              fontSize: 14,
              textAlign: "center",
              marginTop: 4,
            }}
          >
            Try adjusting your search or filters
          </Text>
        </View>
      )}
    </ScrollView>
  );
}
