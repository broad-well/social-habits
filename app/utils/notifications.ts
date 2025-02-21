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

export const scheduleDailyNotification = async () => {
    await Notifications.scheduleNotificationAsync({
        content: {
            title: "Habit Reminder",
            body: "Time to build your software engineering skills! Keep up your 5 day streak.",
            categoryIdentifier: 'habit-reminders',
        },
        trigger: {
            type: 'calendar',
            hour: 13,
            minute: 33,
            repeats: true,
        } as Notifications.CalendarTriggerInput,
    });

    console.log("Daily notification scheduled!");
}

Notifications.setNotificationHandler({
    handleNotification: async() => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

Notifications.setNotificationCategoryAsync('habit-reminders', actions);
