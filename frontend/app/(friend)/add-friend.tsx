import { useColorTheme } from "@/stores/useColorTheme";
import { DefaultTheme, PaperProvider, Text, ActivityIndicator, Card, Button, Icon, TextInput, Appbar } from "react-native-paper";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { StyleSheet, View } from "react-native";
import React from "react";
import { router, Stack } from "expo-router";
import Avatar from "@/components/accounts/Avatar";
import useBackendQuery from "@/utils/useBackendQuery";
import { FriendListItem } from "@/utils/service";
import useBackendStore from "@/stores/useBackendStore";


export default function AddFriend() {
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

  const backend = useBackendStore((u) => u.server);
  const [queryEmail, setQuery] = React.useState<string>("");
  const query = useBackendQuery(
    React.useCallback(async () => {
      const [user, request] = await Promise.all([
        backend.fetchUserByEmail(queryEmail + "@ucsd.edu"),
        backend.fetchFriendRequest(queryEmail),
      ]);
      return user == null ? null : { ...user, request };
    }, [queryEmail])
  );

  const sendRequest = React.useCallback(async (receiverId: string) => {
    await backend.sendFriendRequest(receiverId);
    await query.send();
  }, [backend]);

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
        {query.loading && query.result === undefined && query.error === undefined &&
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
                  <Text>{query.result.habitList.length} habit{query.result.habitList.length === 1 ? "" : "s"}</Text>
                  <Text>{query.result.friendList.length} friend{query.result.friendList.length === 1 ? "" : "s"}</Text>
                </View>
              </View>
            </Card.Content>
            <Card.Actions>
              <Button>Profile</Button>
              {query.result.request === null &&
                <Button onPress={() => sendRequest(query.result!.id)}>
                  Send friend request
                </Button>}
              {query.result.request?.status === "pending" &&
                <Button disabled>
                  Friend request pending
                </Button>}
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
              Can&apos;t find this user
            </Text>
          </View>}
      </View>
    </View>
  </PaperProvider>;
}