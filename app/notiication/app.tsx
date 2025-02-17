import React from 'react';
import { Text, View, StyleSheet, TextInput } from 'react-native';
import * as Notifications from 'expo-notifications';
import { initializeNotifications } from './notification';
import { useState } from 'react';
import { Button } from 'react-native-paper';

initializeNotifications();

export const App = () => {

  const [title, setTitle] = useState<string>();
  const [body, setBody] = useState<string>();

  const scheduleNotification =(seconds: number) => { 
     Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
      },
      trigger: {
        seconds: seconds,
        repeats: false,
      },
      content:
   })
  }


  const handleShowNotification = () => {  


  }
  return (
    <View style = {styles.container}>
      <TextInput 
        placeholder="Title..."
        value = {title}
        onChangeText = {setTitle}
        style ={styles.input} 
        />

      <TextInput 
        placeholder="Body..."
        value = {body}
        onChangeText = {setBody}
        style ={styles.input} 
      />
    <Button mode="contained" onPress={handleShowNotification}>Show Notification</Button>
</View>
  );
};

const styles = StyleSheet.create({ 

  container:{
    flex: 1,
    justifyContent: 'center',
    gap :16,
    padding: 16
  }

  input:{
    borderWidth: 1,
    borderColor: 'black',
    borderRadius: 8,
    padding: 16}
  })
 


