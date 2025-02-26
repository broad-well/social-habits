import { useColorTheme } from "@/stores/useColorTheme";
import { DefaultTheme, PaperProvider, Text, List, ActivityIndicator, Card, Button } from "react-native-paper";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, FlatList, View } from "react-native";
import React from "react";
import { useFonts } from "expo-font";
import { SplashScreen } from "expo-router";

interface FriendListItem {
  id: string;
  profileLogo?: string;
  name: string;
  // Future: Maybe summary stats for habit completion
}

async function fetchFriendList(): Promise<FriendListItem[]> {
  // Placeholder demo data. Replace with backend access
  return [
    {
      id: 'abcdef',
      name: 'Michael Coblenz',
    },
    {
      id: 'fhhqhr',
      name: 'Antariksha Ray',
    },
    {
      id: 'qhrbaf',
      name: "Loris D'Antoni",
    },
  ];
}

export default function FriendList() {
  const [loaded] = useFonts({
    Poppins: require("../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    PoppinsBold: require("../../assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  const { colorTheme } = useColorTheme();

  const theme = {
    ...DefaultTheme,
    colors:
      colorTheme === "light" ? LightThemeColors.colors : DarkThemeColors.colors,
  };

  const stylesheet = StyleSheet.create({
    page: {
      backgroundColor: theme.colors.primary,
      width: '100%',
      height: '100%',
      padding: 20,
      fontFamily: "Poppins",
    },
    bold: {
      fontFamily: "PoppinsBold",
    },
    poppins: {
      fontFamily: "Poppins",
    },
    header: {
      marginBottom: 16,
    },
    friendCard: {
      margin: 4,
    }
  });

  const [friends, setFriends] = React.useState<FriendListItem[] | null>(null);
  const [fetchError, setFetchError] = React.useState<Error | null>(null);
  React.useEffect(() => {
    (async () => {
      try {
        setFriends(await fetchFriendList());
      } catch (e) {
        setFetchError(e as Error);
      }
    })();
  });

  return <PaperProvider theme={theme}>
    <SafeAreaProvider>
      <SafeAreaView style={stylesheet.page}>
        
        {friends === null
          ? <ActivityIndicator animating={true} size="large" />
          : <FlatList
              ListHeaderComponent={() => 
                <Text variant="headlineMedium" style={[stylesheet.bold, stylesheet.header]}>My friends</Text>
              }
              data={friends}
              renderItem={({ item }) => <Card style={stylesheet.friendCard}>
                <Card.Title title={item.name} />
                <Card.Actions>
                  <Button>Remove</Button>
                  <Button>Block</Button>
                </Card.Actions>
              </Card>}
              keyExtractor={(item) => item.id}
            />}
      </SafeAreaView>
    </SafeAreaProvider>
  </PaperProvider>;
}