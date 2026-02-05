import * as AC from "@bacons/apple-colors";
import { Pressable, ScrollView, Text, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";

import { getTypeColor, POKEMON_TYPES, PokemonType } from "@/utils/pokemon";

interface TypeFilterProps {
  selectedTypes: PokemonType[];
  onToggleType: (type: PokemonType) => void;
  onClearFilters: () => void;
}

export function TypeFilter({
  selectedTypes,
  onToggleType,
  onClearFilters,
}: TypeFilterProps) {
  return (
    <View style={{ paddingVertical: 8 }}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {selectedTypes.length > 0 && (
          <Animated.View entering={FadeIn} exiting={FadeOut}>
            <Pressable
              onPress={onClearFilters}
              style={{
                backgroundColor: AC.systemGray5,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
              }}
            >
              <Text style={{ color: AC.systemRed, fontWeight: "600", fontSize: 13 }}>
                Clear
              </Text>
            </Pressable>
          </Animated.View>
        )}
        {POKEMON_TYPES.map((type) => {
          const isSelected = selectedTypes.includes(type);
          return (
            <Pressable
              key={type}
              onPress={() => onToggleType(type)}
              style={{
                backgroundColor: isSelected
                  ? getTypeColor(type)
                  : AC.systemGray5,
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 20,
                borderWidth: isSelected ? 0 : 1,
                borderColor: AC.separator,
              }}
            >
              <Text
                style={{
                  color: isSelected ? "white" : AC.label,
                  fontWeight: "600",
                  fontSize: 13,
                  textTransform: "capitalize",
                }}
              >
                {type}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}
