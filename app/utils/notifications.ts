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

export const scheduleHabitNotification = async (habitName: string, habitTime: Date, reminderDays: string[], startDate: Date, endDate: Date) => {

    const hour = habitTime.getHours();
    const minute = habitTime.getMinutes();

    const dayMap: { [key: string]: number } = {
        Sunday: 0,
        Monday: 1,
        Tuesday: 2,
        Wednesday: 3,
        Thursday: 4,
        Friday: 5,
        Saturday: 6
    };

    const daysToRepeat = reminderDays.map(day => dayMap[day]);

    const notifContent = {
        title: `${habitName} Reminder`,
        body: `Time to work on your habit: ${habitName}!`,
        categoryIdentifier: 'habit-reminders',
    };

    const notificationIds: string[] = [];
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const currentTime = new Date().getTime();

    const delayTime = startTime > currentTime ? startTime - currentTime: 0;

    for (const day of daysToRepeat) {

        const notifTrigger = {
            type: 'calendar',
            hour,
            minute,
            repeats: true,
            weekday: day,
        } as Notifications.CalendarTriggerInput;

        if (delayTime > 0) {
            setTimeout(async () => {
                const notificationId = await Notifications.scheduleNotificationAsync({
                    content: notifContent,
                    trigger: notifTrigger,
                });
                notificationIds.push(notificationId);
            }, delayTime);
        } else {
            const notificationId = await Notifications.scheduleNotificationAsync({
                content: notifContent,
                trigger: notifTrigger,
            });
            notificationIds.push(notificationId)
        }

    }

    const stopNotifs = () => {
        const currentTime = new Date().getTime();
        if (currentTime >= endTime) {
            notificationIds.forEach(async (notificationId) => {
                await Notifications.cancelScheduledNotificationAsync(notificationId);
            });
        }
    }

    setInterval(stopNotifs, 86400000);

    return notificationIds;
};

Notifications.setNotificationHandler({
    handleNotification: async() => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

Notifications.setNotificationCategoryAsync('habit-reminders', actions);

export const unscheduleHabitNotification = async (notificationId: string) => {
    try {
        await Notifications.cancelScheduledNotificationAsync(notificationId);
        console.log(`Notification with ID ${notificationId} cancelled`)
    } catch (error) {
        console.error('Error cancelling notification:', error);
    }
}

export const unscheduleAllScheduledNotifications = async () => {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log(`All scheduled notifications cancelled`)
    } catch (error) {
        console.error('Error cancelling all notifications:', error);
    }
}
