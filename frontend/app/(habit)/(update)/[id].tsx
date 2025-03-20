import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Button,
  TextInput,
  Appbar,
  MD3LightTheme as DefaultTheme,
  PaperProvider,
  Portal,
  Dialog,
  Text,
} from "react-native-paper";
import RadioButtonRN from "radio-buttons-react-native";
import RadioGroup from "react-native-radio-buttons-group";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { useColorTheme } from "@/stores/useColorTheme";
import { router, Stack, useLocalSearchParams } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { scheduleHabitNotification, sendLocalNotification, unscheduleHabitNotification } from "@/utils/notifications";
import useBackendStore from "@/stores/useBackendStore"
import createStyles from "@/styles/NewHabitStyles";
import useBackendQuery from "@/utils/useBackendQuery";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";
import { LocalHabit } from "@/utils/habitStore";

export default function HabitUpdate() {
  const screenOptions = {
    headerShown: false,
  };

  const { colorTheme } = useColorTheme();
  const { id } = useLocalSearchParams();
  const store = useBackendStore((u) => u.getHabitStore());
  const notifyUIHabitUpdated = useBackendStore((s) => s.markHabitStoreUpdated);

  const prevHabit = useBackendQuery(() => store.readHabit(id as string));
  React.useEffect(() => {
    console.log("retrieving prevHabit");
    prevHabit.send()
      .then((result) => {
        if (result) {
          handleReset(result);
        } else {
          Alert.alert("Failed to read habit", "Habit no longer exists?");
          router.back();
        }
      })
      .catch(console.error);
  }, [store, id]);

  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [privacy, setPrivacy] = useState("Private");
  const [reminderTime, setReminderTime] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleReset = React.useCallback((habit: LocalHabit) => {
    setHabitName(habit.title);
    setHabitDescription(habit.description);
    setStartDate(new Date(habit.startDate));
    setEndDate(new Date(habit.endDate));
    setPrivacy(habit.privacy);
    setReminderTime(new Date(habit.reminderTime));
    setSelectedDays(habit.reminderDays);
  }, []);

  const handleSave = async () => {
    if (prevHabit.result) {
      const existingIds = await store.getHabitNotificationId(id as string);
      await Promise.all((existingIds ?? []).map((id) => unscheduleHabitNotification(id)));
    }
    await store.updateHabit({
      id: id as string,
      title: habitName,
      description: habitDescription,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      privacy: privacy as "Private" | "Friends-Only" | "Public",
      reminderTime: reminderTime.toISOString(),
      reminderDays: selectedDays,
      lastModified: new Date(),
      streaks: [],
    });
    notifyUIHabitUpdated();

    const notificationIds = await scheduleHabitNotification(habitName, reminderTime, selectedDays, startDate, endDate);
    await store.setHabitNotificationId(id as string, notificationIds);

    const title = "Notification scheduled!";
    const body = `Reminders for ${habitName} have been rescheduled!`;
    await sendLocalNotification(title, body);

    router.back();
  };

  const saver = useBackendQuery(handleSave);
  const deleter = useBackendQuery(async () => {
    await store.deleteHabit(id as string);
    notifyUIHabitUpdated();
    return router.replace("/(tabs)/main");
  });

  const handlePrivacyChange = React.useCallback((value: string) => {
    setPrivacy(value);
  }, []);

  const handleStartDateChange = React.useCallback(
    (event: any, date?: Date) => setStartDate(date || startDate), // eslint-disable-line
    [startDate]
  );

  const handleEndDateChange = React.useCallback(
    (event: any, date?: Date) => setEndDate(date || endDate), // eslint-disable-line
    [endDate]
  );

  const handleHabitNameChange = React.useCallback((text: string) => {
    setHabitName(text);
  }, []);

  const theme = {
    ...DefaultTheme,
    colors:
      colorTheme === "light" ? LightThemeColors.colors : DarkThemeColors.colors,
  };

  const styles = createStyles(theme);

  return (
    <PaperProvider theme={theme}>
      <Stack.Screen options={screenOptions} />
      <Appbar.Header
        style={{
          height: 50,
          backgroundColor: theme.colors.primaryContainer,
        }}
      >
        <Appbar.BackAction
          color={theme.colors.onPrimaryContainer}
          onPress={() => router.back()}
        />
        <Appbar.Content
          title="Update Habit"
          titleStyle={{
            fontSize: 18,
          }}
        />
      </Appbar.Header>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.colors.primaryContainer,
          width: "100%",
        }}
        contentContainerStyle={[
          { width: "100%", paddingTop: 20, paddingHorizontal: 35 },
        ]}
      >
        <View style={styles.formContainer}>
          <TextInput
            mode="outlined"
            label="Name of the Habit"
            value={habitName}
            onChangeText={handleHabitNameChange}
            inputMode="text"
            style={styles.input}
            textColor={theme.colors.onPrimaryContainer}
            theme={theme}
            autoCapitalize="none"
          />
          <TextInput
            mode="outlined"
            label="Description"
            inputMode="text"
            value={habitDescription}
            onChangeText={(text) => {
              setHabitDescription(text);
            }}
            multiline
            numberOfLines={4}
            style={styles.input}
            textColor={theme.colors.onPrimaryContainer}
            theme={theme}
            autoCapitalize="none"
          />
          <View style={styles.datePickerContainer}>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text
                style={{
                  color: theme.colors.onPrimaryContainer,
                }}
              >
                Start Date:
              </Text>
              <DateTimePicker
                value={startDate}
                mode="date"
                display="default"
                design="material"
                themeVariant={colorTheme}
                minimumDate={new Date()}
                onChange={handleStartDateChange}
              />
            </View>
            <View
              style={{
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <Text style={{ color: theme.colors.onPrimaryContainer }}>
                End Date:
              </Text>
              <DateTimePicker
                value={endDate}
                mode="date"
                display="default"
                design="material"
                themeVariant={colorTheme}
                minimumDate={startDate}
                onChange={handleEndDateChange}
              />
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.groupContainer}>
            <MultiSelectDropdown
              label="Days of the week:"
              options={[
                { value: "Monday", label: "Monday" },
                { value: "Tuesday", label: "Tuesday" },
                { value: "Wednesday", label: "Wednesday" },
                { value: "Thursday", label: "Thursday" },
                { value: "Friday", label: "Friday" },
                { value: "Saturday", label: "Saturday" },
                { value: "Sunday", label: "Sunday" },
              ]}
              value={selectedDays}
              onChange={setSelectedDays}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.groupContainer}>
            <Text style={styles.radioGroupLabel}>Reminder:</Text>
                <DateTimePicker
              value={reminderTime}
                  mode="time"
                  display="default"
                  design="material"
                  themeVariant={colorTheme}
              onChange={(event, time) => setReminderTime(time || reminderTime)}
                />
              </View>
          <View style={styles.divider} />
          <View style={styles.radioGroupContainer}>
            <Text style={styles.radioGroupLabel}>Privacy:</Text>
            <RadioGroup
              radioButtons={[
                { id: "Public", label: "Public", value: "Public" },
                {
                  id: "Friend-Only",
                  label: "Friend-Only",
                  value: "Friend-Only",
                },
                { id: "Private", label: "Private", value: "Private" },
              ]}
              containerStyle={{
                width: "60%",
                alignItems: "flex-start",
              }}
              onPress={handlePrivacyChange}
              selectedId={privacy.toString()}
            />
          </View>
          <Button
            mode="outlined"
            onPress={deleter.send}
            disabled={deleter.loading}
            style={[styles.button, { borderColor: theme.colors.error }]}
            textColor={theme.colors.onErrorContainer}
          >
            Delete
          </Button>
          <Button
            mode="contained"
            onPress={saver.send}
            disabled={saver.loading}
            style={styles.button}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
          >
            Save
          </Button>
        </View>
      </ScrollView>
      <Portal>
        <Dialog visible={!!saver.error} onDismiss={saver.clear}>
          <Dialog.Title>Habit update failed</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{saver.error?.message}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={saver.clear}>Try again</Button>
            <Button onPress={router.back}>Return</Button>
          </Dialog.Actions>
        </Dialog>
        <Dialog visible={!!deleter.error} onDismiss={deleter.clear}>
          <Dialog.Title>Habit deletion failed</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{deleter.error?.message}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={deleter.clear}>Try again</Button>
            <Button onPress={router.back}>Return</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
}
