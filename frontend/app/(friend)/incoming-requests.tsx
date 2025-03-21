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
import { router, SplashScreen, Stack } from "expo-router";
import useBackendStore from "@/stores/useBackendStore";
import { FriendListItem } from "@/utils/service";

export default function FriendRequestsView() {

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
  const backend = useBackendStore((u) => u.server);

  React.useEffect(() => {
    (async () => {
      try {
        const senderList = await backend.fetchPendingFriendRequests();
        const senders = await Promise.all(senderList.map((sender) => backend.fetchUserById(sender)));
        setFriends(senders as FriendListItem[]);
        setFetchError(null);
      } catch (e) {
        setFetchError(e as Error);
      }
    })();
  }, []);

  const rejectRequest = React.useCallback(async (id: string) => {
    await backend.rejectFriendRequest(id);
    setFriends((f) => f?.filter(item => item.id !== id) ?? null);
  }, [backend]);

  const acceptRequest = React.useCallback(async (id: string) => {
    await backend.acceptFriendRequest(id);
    setFriends((f) => f?.filter(item => item.id !== id) ?? null);
  }, [backend]);

  return (
    <PaperProvider theme={theme}>
      <View style={stylesheet.container}>
        <Stack.Screen name="incoming-requests" options={{ title: "Friend Requests" }} />
        <Appbar.Header
          style={{
            height: 50,
            backgroundColor: theme.colors.primaryContainer,
          }}
        >
          <Appbar.BackAction onPress={() => router.back()} />
          <Appbar.Content
            title="Friend Requests"
            titleStyle={{
              fontSize: 18,
            }}
          />
        </Appbar.Header>
        <View style={stylesheet.page}>
          {friends !== null && friends.length > 0 && (
            <FlatList
              data={friends}
              renderItem={({ item }) => (
                <Card style={stylesheet.friendCard}>
                  <Card.Title title={item.name} />
                  <Card.Actions>
                    <Button
                      onPress={() => rejectRequest(item.id)}
                    >
                      Reject
                    </Button>
                    <Button
                      buttonColor={theme.colors.primary}
                      onPress={() => acceptRequest(item.id)}
                    >
                      Accept
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
          {friends?.length === 0 && (
            <View style={stylesheet.errorMessage}>
              <Icon source="account-off" size={48} />
              <Text>You don't have any friend requests yet</Text>
            </View>
          )}
        </View>
      </View>
    </PaperProvider>
  );
}
