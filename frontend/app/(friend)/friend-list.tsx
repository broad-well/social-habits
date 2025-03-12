import { useColorTheme } from "@/stores/useColorTheme";
import {
  DefaultTheme,
  PaperProvider,
  Text,
  ActivityIndicator,
  Card,
  Button,
  Icon,
  MD3Colors,
  FAB,
  Appbar,
} from "react-native-paper";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StyleSheet, FlatList, View } from "react-native";
import React from "react";
import { useFonts } from "expo-font";
import { router, SplashScreen, Stack } from "expo-router";

interface FriendListItem {
  id: string;
  profileLogo?: string;
  name: string;
  requested: boolean;
  // Future: Maybe summary stats for habit completion
}

async function fetchFriendList(): Promise<FriendListItem[]> {
  // Placeholder demo data. Replace with backend access
  // return new Promise((res, rej) => setTimeout(() => rej(new Error("simulated error")), 5000));
  return [
    {
      id: "abcdef",
      name: "Michael Coblenz",
      requested: true,
    },
    {
      id: "fhhqhr",
      name: "Antariksha Ray",
      requested: false,
    },
    {
      id: "qhrbaf",
      name: "Loris D'Antoni",
      requested: false,
    },
  ];
}

export default function FriendList() {
  const [loaded] = useFonts({
    Poppins: require("@/assets/fonts/Poppins/Poppins-Regular.ttf"), // eslint-disable-line
    PoppinsBold: require("@/assets/fonts/Poppins/Poppins-Bold.ttf"), // eslint-disable-line
  });

  React.useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  const { colorTheme } = useColorTheme();
  const insets = useSafeAreaInsets();

  const theme = {
    ...DefaultTheme,
    colors:
      colorTheme === "light" ? LightThemeColors.colors : DarkThemeColors.colors,
  };

  const stylesheet = StyleSheet.create({
    page: {
      backgroundColor: theme.colors.primaryContainer,
      padding: 20,
      fontFamily: "Poppins",
      display: "flex",
      flexDirection: "column",
      position: "relative",
      flexGrow: 1,
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
    },
    errorMessage: {
      padding: 16,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
    fab: {
      position: "absolute",
      margin: 32,
      right: 0,
      bottom: insets.bottom,
      backgroundColor: theme.colors.primary,
    },
    container: {
      display: "flex",
      flexDirection: "column",
      height: "100%",
    },
  });

  const [friends, setFriends] = React.useState<FriendListItem[] | null>(null);
  const [fetchError, setFetchError] = React.useState<Error | null>(null);
  React.useEffect(() => {
    (async () => {
      try {
        setFriends(await fetchFriendList());
        setFetchError(null);
      } catch (e) {
        setFetchError(e as Error);
      }
    })();
  }, []);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <View style={stylesheet.container}>
        <Stack.Screen name="friend-list" options={{ title: "Friends" }} />
        <Appbar.Header
          style={{
            height: 50,
            backgroundColor: theme.colors.primaryContainer,
          }}
        >
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content
            title="Friends"
            titleStyle={{
              fontSize: 18,
            }}
          />
        </Appbar.Header>
        <View style={stylesheet.page}>
          {friends !== null && (
            <FlatList
              data={friends}
              renderItem={({ item }) => (
                <Card style={stylesheet.friendCard}>
                  <Card.Title title={item.name} />
                  <Card.Actions>
                    <Button mode="text" textColor={MD3Colors.error40}>
                      Remove
                    </Button>
                    <Button buttonColor={theme.colors.primary}>
                      View Profile
                    </Button>
                  </Card.Actions>
                </Card>
              )}
              keyExtractor={(item) => item.id}
            />
          )}
          {fetchError === null && friends === null && (
            <ActivityIndicator
              animating={true}
              size="large"
              color={theme.colors.onPrimary}
            />
          )}
          {fetchError !== null && (
            <View style={stylesheet.errorMessage}>
              <Icon source="alert" color={theme.colors.onError} size={48} />
              <Text>Loading failed: {fetchError.message}. Try again?</Text>
            </View>
          )}
          <FAB
            style={stylesheet.fab}
            icon="plus"
            label="Add friend"
            color={theme.colors.onPrimary}
            onPress={() => router.push("/(friend)/add-friend")}
          />
        </View>
      </View>
    </PaperProvider>
  );
}
