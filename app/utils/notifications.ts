import * as Notifications from 'expo-notifications';

const actions = [
    {
        identifier: 'done',
        buttonTitle: 'Done',
        isDestructive: false,
    },
    {
        identifier: 'missed',
        buttonTitle: 'Missed',
        isDestructive: true,
    },
];

export async function requestNotificationPermissions() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
    }
}

export async function sendLocalNotification(title: string, body:string) {
    await Notifications.scheduleNotificationAsync({
        content: { title, body },
        trigger: null,
    });
}

export const scheduleHabitNotification = async (habitName: string, habitTime: Date) => {

    const hour = habitTime.getHours();
    const minute = habitTime.getMinutes();

    const notifContent = {
        title: `${habitName} Reminder`,
        body: `Time to work on your habit: ${habitName}!`,
        categoryIdentifier: 'habit-reminders',
    };

    const notifTrigger = {
        type: 'calendar',
        hour,
        minute,
        repeats: true,
    } as Notifications.CalendarTriggerInput;

    await Notifications.scheduleNotificationAsync({
        content: notifContent,
        trigger: notifTrigger,
    });

    console.log(`${habitName} notification scheduled!`);
}

Notifications.setNotificationHandler({
    handleNotification: async() => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

Notifications.setNotificationCategoryAsync('habit-reminders', actions);
