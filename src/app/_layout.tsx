import { ThemeProvider } from "@/components/theme-provider";
import { FavoritesProvider } from "@/context/favorites-context";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import { Tabs as WebTabs } from "expo-router/tabs";
import { NativeTabs } from "expo-router/unstable-native-tabs";
import { Platform, useWindowDimensions } from "react-native";

export default function Layout() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <TabsLayout />
      </FavoritesProvider>
    </ThemeProvider>
  );
}

function TabsLayout() {
  if (process.env.EXPO_OS === "web") {
    return <WebTabsLayout />;
  } else {
    return <NativeTabsLayout />;
  }
}

function WebTabsLayout() {
  const { width } = useWindowDimensions();
  const isMd = width >= 768;
  const isLg = width >= 1024;

  return (
    <WebTabs
      screenOptions={{
        headerShown: false,
        ...(isMd
          ? {
              tabBarPosition: "left",
              tabBarVariant: "material",
              tabBarLabelPosition: isLg ? undefined : "below-icon",
            }
          : {
              tabBarPosition: "bottom",
            }),
      }}
    >
      <WebTabs.Screen
        name="(pokedex)"
        options={{
          title: "Pokédex",
          tabBarIcon: (props) => (
            <MaterialIcons {...props} name="catching-pokemon" />
          ),
        }}
      />
      <WebTabs.Screen
        name="(favorites)"
        options={{
          title: "Favorites",
          tabBarIcon: (props) => <MaterialIcons {...props} name="favorite" />,
        }}
      />
    </WebTabs>
  );
}

function NativeTabsLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger name="(pokedex)">
        <NativeTabs.Trigger.Label>Pokédex</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          {...Platform.select({
            ios: { sf: { default: "list.bullet", selected: "list.bullet" } },
            default: {
              src: (
                <NativeTabs.Trigger.VectorIcon
                  family={MaterialIcons}
                  name="catching-pokemon"
                />
              ),
            },
          })}
        />
      </NativeTabs.Trigger>
      <NativeTabs.Trigger name="(favorites)">
        <NativeTabs.Trigger.Label>Favorites</NativeTabs.Trigger.Label>
        <NativeTabs.Trigger.Icon
          {...Platform.select({
            ios: { sf: { default: "heart", selected: "heart.fill" } },
            default: {
              src: (
                <NativeTabs.Trigger.VectorIcon
                  family={MaterialIcons}
                  name="favorite"
                />
              ),
            },
          })}
        />
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
