import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Stack, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";

import { useFavorites } from "@/context/favorites-context";
import { fetchPokemon, getTypeColor, Pokemon } from "@/utils/pokemon";

function StatBar({ label, value, max = 255 }: { label: string; value: number; max?: number }) {
  const percentage = (value / max) * 100;
  const color =
    value >= 100
      ? AC.systemGreen
      : value >= 60
      ? AC.systemYellow
      : AC.systemRed;

  return (
    <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
      <Text
        style={{
          width: 80,
          fontSize: 13,
          color: AC.secondaryLabel,
          textTransform: "capitalize",
        }}
      >
        {label}
      </Text>
      <Text
        style={{
          width: 40,
          fontSize: 14,
          fontWeight: "600",
          color: AC.label,
          fontVariant: ["tabular-nums"],
        }}
      >
        {value}
      </Text>
      <View
        style={{
          flex: 1,
          height: 8,
          backgroundColor: AC.systemGray5,
          borderRadius: 4,
          overflow: "hidden",
        }}
      >
        <Animated.View
          entering={FadeInDown.delay(200).duration(500)}
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: 4,
          }}
        />
      </View>
    </View>
  );
}

export default function PokemonDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [pokemon, setPokemon] = useState<Pokemon | null>(null);
  const [loading, setLoading] = useState(true);
  const { isFavorite, toggleFavorite } = useFavorites();

  const pokemonId = Number(id);
  const favorite = isFavorite(pokemonId);

  useEffect(() => {
    fetchPokemon(pokemonId).then((data) => {
      setPokemon(data);
      setLoading(false);
    });
  }, [pokemonId]);

  if (loading || !pokemon) {
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

  const primaryType = pokemon.types[0];
  const typeColor = getTypeColor(primaryType);

  return (
    <>
      <Stack.Screen
        options={{
          title: pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1),
          headerRight: () => (
            <Pressable onPress={() => toggleFavorite(pokemonId)} hitSlop={10}>
              {process.env.EXPO_OS === "ios" ? (
                <Image
                  source={favorite ? "sf:heart.fill" : "sf:heart"}
                  style={{
                    width: 24,
                    height: 24,
                    tintColor: favorite ? AC.systemRed : AC.systemBlue,
                  }}
                />
              ) : (
                <Text style={{ fontSize: 22 }}>{favorite ? "❤️" : "🤍"}</Text>
              )}
            </Pressable>
          ),
        }}
      />
      <ScrollView
        style={{ flex: 1, backgroundColor: AC.systemBackground }}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View
          style={{
            backgroundColor: typeColor,
            paddingTop: 20,
            paddingBottom: 60,
            alignItems: "center",
            borderBottomLeftRadius: 40,
            borderBottomRightRadius: 40,
          }}
        >
          <Text
            style={{
              color: "rgba(255,255,255,0.5)",
              fontSize: 14,
              fontWeight: "700",
            }}
          >
            #{String(pokemon.id).padStart(3, "0")}
          </Text>
          <Animated.View entering={FadeInDown.duration(400)}>
            <Image
              source={{
                uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
              }}
              style={{ width: 200, height: 200 }}
              contentFit="contain"
            />
          </Animated.View>
          <View style={{ flexDirection: "row", gap: 8, marginTop: 8 }}>
            {pokemon.types.map((type) => (
              <View
                key={type}
                style={{
                  backgroundColor: "rgba(255,255,255,0.3)",
                  paddingHorizontal: 16,
                  paddingVertical: 6,
                  borderRadius: 20,
                }}
              >
                <Text
                  style={{
                    color: "white",
                    fontWeight: "600",
                    fontSize: 14,
                    textTransform: "capitalize",
                  }}
                >
                  {type}
                </Text>
              </View>
            ))}
          </View>
        </View>

        <View style={{ padding: 20 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
              marginBottom: 24,
              padding: 16,
              backgroundColor: AC.secondarySystemBackground,
              borderRadius: 16,
              borderCurve: "continuous",
            }}
          >
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: AC.secondaryLabel, fontSize: 13 }}>Height</Text>
              <Text
                selectable
                style={{
                  color: AC.label,
                  fontSize: 18,
                  fontWeight: "600",
                  marginTop: 4,
                }}
              >
                {(pokemon.height / 10).toFixed(1)} m
              </Text>
            </View>
            <View
              style={{ width: 1, backgroundColor: AC.separator, height: "100%" }}
            />
            <View style={{ alignItems: "center" }}>
              <Text style={{ color: AC.secondaryLabel, fontSize: 13 }}>Weight</Text>
              <Text
                selectable
                style={{
                  color: AC.label,
                  fontSize: 18,
                  fontWeight: "600",
                  marginTop: 4,
                }}
              >
                {(pokemon.weight / 10).toFixed(1)} kg
              </Text>
            </View>
          </View>

          <Text
            style={{
              color: AC.label,
              fontSize: 18,
              fontWeight: "700",
              marginBottom: 16,
            }}
          >
            Base Stats
          </Text>
          <StatBar label="HP" value={pokemon.stats.hp} />
          <StatBar label="Attack" value={pokemon.stats.attack} />
          <StatBar label="Defense" value={pokemon.stats.defense} />
          <StatBar label="Sp. Atk" value={pokemon.stats.specialAttack} />
          <StatBar label="Sp. Def" value={pokemon.stats.specialDefense} />
          <StatBar label="Speed" value={pokemon.stats.speed} />

          <Text
            style={{
              color: AC.label,
              fontSize: 18,
              fontWeight: "700",
              marginTop: 24,
              marginBottom: 12,
            }}
          >
            Abilities
          </Text>
          <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
            {pokemon.abilities.map((ability) => (
              <View
                key={ability}
                style={{
                  backgroundColor: AC.secondarySystemBackground,
                  paddingHorizontal: 14,
                  paddingVertical: 8,
                  borderRadius: 12,
                  borderCurve: "continuous",
                }}
              >
                <Text
                  style={{
                    color: AC.label,
                    fontSize: 14,
                    textTransform: "capitalize",
                  }}
                >
                  {ability.replace("-", " ")}
                </Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </>
  );
}
