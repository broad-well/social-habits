
import { useState, useEffect, useRef } from 'react';
import * as Device from 'expo-device';
import { Text, View, Button, Platform } from 'react-native';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';
import AsyncStorage from '@react-native-async-storage/async-storage';


//  Notification Handler (how notifications should be handled when received)
export const intializeNotifications = () => {
  
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
  });
} 
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

async function registerForPushNotificationsAsync() {
    // let token;
  
    // if (Platform.OS === 'android') {
    //   await Notifications.setNotificationChannelAsync('myNotificationChannel', {
    //     name: 'A channel is needed for the permissions prompt to appear',
    //     importance: Notifications.AndroidImportance.MAX,
    //     vibrationPattern: [0, 250, 250, 250],
    //     lightColor: '#FF231F7C',
    //   });
    // }
  
    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      if (finalStatus !== 'granted') {
        alert('Failed to get push token for push notification!');
        return;
      }
      // Learn more about projectId:
      // https://docs.expo.dev/push-notifications/push-notifications-setup/#configure-projectid
      // EAS projectId is used here.
      // try {
      //   const projectId =
      //     Constants?.expoConfig?.extra?.eas?.projectId ?? Constants?.easConfig?.projectId;
      //   if (!projectId) {
      //     throw new Error('Project ID not found');
      //   }
      //   token = (
      //     await Notifications.getExpoPushTokenAsync({
      //       projectId,
      //     })
      //   ).data;
      //   console.log(token);
      // } catch (e) {
      //   token = `${e}`;
      // }
    } else {
      alert('Must use physical device for Push Notifications');
    }
  
    // return token;
  }

  async function scheduleHabitReminder(habitName, time) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Habit Reminder',
        body: `Time for : ${habitName}!`,
      },
      trigger: { seconds: time, repeats: true }, // Example: remind every 'time' seconds
    });
  }

  // async function sendFriendRequestNotification(username) {
  //   await Notifications.scheduleNotificationAsync({
  //     content: {
  //       title: 'New Friend Request',
  //       body: `${username} sent you a friend request!`,
  //     },
  //     trigger: null, // Fires immediately
  //   });
  // }


async function checkInactivity() {
  const lastOpened = await AsyncStorage.getItem('last_opened');
  const now = Date.now();
  
  if (lastOpened && now - Number(lastOpened) > 3 * 24 * 60 * 60 * 1000) { // 3 days
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'We Miss You!',
        body: 'Come back and check your progress!',
      },
      trigger: null,
    });
  }
  
  await AsyncStorage.setItem('last_opened', String(now));
}
