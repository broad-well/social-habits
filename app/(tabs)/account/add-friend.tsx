import { useColorTheme } from "@/stores/useColorTheme";
import { DefaultTheme, PaperProvider, Text, ActivityIndicator, Card, Button, Icon, MD3Colors, FAB, Searchbar, TextInput, Divider, Appbar } from "react-native-paper";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { StyleSheet, FlatList, Button as RNButton, View } from "react-native";
import React from "react";
import { useFonts } from "expo-font";
import { router, SplashScreen, Stack } from "expo-router";
import Avatar from "@/components/accounts/Avatar";
import useBackendQuery from "@/utils/useBackendQuery";

interface FriendListItem {
  id: string;
  profileLogo?: string;
  name: string;
  requested: boolean;
  // Future: Maybe summary stats for habit completion
}

/**
 * @param handle The first part of the target user's email (before the @)
 */
async function fetchUserByEmail(handle: string): Promise<FriendListItem | null> {
  return new Promise((res) => setTimeout(() =>
    res(handle === "other" ? {
      id: "hqhrb1",
      profileLogo: "https://i.pinimg.com/originals/ae/c6/2f/aec62fe5319733b32fde1a6a3ff28e7b.jpg",
      name: "Other user",
      requested: false,
    } : null),
  1000));
}

export default function AddFriend() {
  const [loaded] = useFonts({
    Poppins: require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),
    PoppinsBold: require("@/assets/fonts/Poppins/Poppins-Bold.ttf"),
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
      backgroundColor: theme.colors.primaryContainer,
      padding: 20,
      height: '100%',
      fontFamily: "Poppins",
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
    },
    bold: {
      fontFamily: "PoppinsBold",
    },
    poppins: {
      fontFamily: "Poppins",
    },
    searchBox: {
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
    },
    separator: {
      height: 36,
    },
    userCard: {
      display: "flex",
      flexDirection: "row",
      gap: 8,
    },
    stats: {
      display: "flex",
      flexDirection: "row",
      gap: 8,
    },
    errorMessage: {
      padding: 16,
      display: "flex",
      alignItems: "center",
      gap: 8,
    },
  });

  const [queryEmail, setQuery] = React.useState<string>("");
  const query = useBackendQuery(
    React.useCallback(() => fetchUserByEmail(queryEmail), [queryEmail])
  );

  return <PaperProvider theme={theme}>
    <Stack.Screen options={{
      title: "Add friend",
    }} />
    <Appbar.Header
      style={{
        height: 50,
        backgroundColor: theme.colors.primaryContainer,
      }}
    >
      <Appbar.BackAction onPress={() => router.back()} />
      <Appbar.Content
        title="Add friend"
        titleStyle={{
          fontSize: 18,
        }}
      />
    </Appbar.Header>
    <View style={stylesheet.page}>
      <View style={stylesheet.searchBox}>
        <TextInput
          label="Friend's email"
          value={queryEmail}
          onChangeText={setQuery}
          textContentType="username"
          right={<TextInput.Affix text="@ucsd.edu" />}
        />
        <Button
          icon="account-search"
          mode="contained"
          onPress={query.send}
        >
          Search
        </Button>
        <View style={stylesheet.separator} />
        {query.sent && query.result === undefined && query.error === undefined &&
          <ActivityIndicator size="large" animating />}
        {query.result &&
          <Card>
            <Card.Content style={stylesheet.userCard}>
              <Avatar imageUrl={
                query.result.profileLogo ??
                "https://i.pinimg.com/originals/ae/c6/2f/aec62fe5319733b32fde1a6a3ff28e7b.jpg"
              } size={64} />
              <View>
                <Text variant="titleLarge">{query.result.name}</Text>
                <View style={stylesheet.stats}>
                  <Text>3 habits</Text>
                  <Text>2 friends</Text>
                </View>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button>Block</Button>
              <Button>
                View Profile
              </Button>
            </Card.Actions>
          </Card>}
        {query.error &&
          <View style={stylesheet.errorMessage}>
            <Icon source="alert" color={theme.colors.onError} size={48} />
            <Text>
              Loading failed: {query.error.message}. Try again?
            </Text>
          </View>}
        {query.result === null &&
          <View style={stylesheet.errorMessage}>
            <Icon source="account-question" color={theme.colors.error} size={48} />
            <Text>
              Can't find this user
            </Text>
          </View>}
      </View>
    </View>
  </PaperProvider>;
}