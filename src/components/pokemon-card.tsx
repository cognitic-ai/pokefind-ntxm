import * as AC from "@bacons/apple-colors";
import { Image } from "expo-image";
import { Link } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Animated, { FadeIn } from "react-native-reanimated";

import { useFavorites } from "@/context/favorites-context";
import { getTypeColor, Pokemon } from "@/utils/pokemon";

interface PokemonCardProps {
  pokemon: Pokemon;
  index?: number;
}

export function PokemonCard({ pokemon, index = 0 }: PokemonCardProps) {
  const { isFavorite, toggleFavorite } = useFavorites();
  const favorite = isFavorite(pokemon.id);
  const primaryType = pokemon.types[0];
  const typeColor = getTypeColor(primaryType);

  return (
    <Animated.View entering={FadeIn.delay(index * 30).duration(300)}>
      <Link
        href={{
          pathname: "/(pokedex)/[id]",
          params: { id: pokemon.id },
        }}
        asChild
      >
        <Link.Trigger withAppleZoom>
          <Pressable
            style={{
              backgroundColor: typeColor,
              borderRadius: 16,
              borderCurve: "continuous",
              padding: 12,
              flex: 1,
              minHeight: 120,
              overflow: "hidden",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text
                  selectable
                  style={{
                    color: "rgba(255,255,255,0.6)",
                    fontSize: 12,
                    fontWeight: "600",
                  }}
                >
                  #{String(pokemon.id).padStart(3, "0")}
                </Text>
                <Text
                  style={{
                    color: "white",
                    fontSize: 16,
                    fontWeight: "700",
                    textTransform: "capitalize",
                    marginTop: 2,
                  }}
                >
                  {pokemon.name}
                </Text>
                <View style={{ marginTop: 8, gap: 4 }}>
                  {pokemon.types.map((type) => (
                    <View
                      key={type}
                      style={{
                        backgroundColor: "rgba(255,255,255,0.25)",
                        paddingHorizontal: 8,
                        paddingVertical: 2,
                        borderRadius: 10,
                        alignSelf: "flex-start",
                      }}
                    >
                      <Text
                        style={{
                          color: "white",
                          fontSize: 10,
                          fontWeight: "600",
                          textTransform: "capitalize",
                        }}
                      >
                        {type}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              <Image
                source={{
                  uri: `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${pokemon.id}.png`,
                }}
                style={{
                  width: 80,
                  height: 80,
                  position: "absolute",
                  right: -5,
                  bottom: -20,
                }}
                contentFit="contain"
              />
            </View>
            <Pressable
              onPress={(e) => {
                e.stopPropagation();
                toggleFavorite(pokemon.id);
              }}
              hitSlop={10}
              style={{
                position: "absolute",
                top: 8,
                right: 8,
                zIndex: 10,
              }}
            >
              {process.env.EXPO_OS === "ios" ? (
                <Image
                  source={favorite ? "sf:heart.fill" : "sf:heart"}
                  style={{
                    width: 22,
                    height: 22,
                    tintColor: favorite ? AC.systemRed : "rgba(255,255,255,0.7)",
                  }}
                />
              ) : (
                <Text style={{ fontSize: 20 }}>{favorite ? "❤️" : "🤍"}</Text>
              )}
            </Pressable>
          </Pressable>
        </Link.Trigger>
        <Link.Preview />
      </Link>
    </Animated.View>
  );
}
