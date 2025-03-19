import * as Notifications from 'expo-notifications';

// Interact with notifications
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

// Request notification permissions for the first time
export async function requestNotificationPermissions() {
    const { status } = await Notifications.getPermissionsAsync();
    if (status !== 'granted') {
        await Notifications.requestPermissionsAsync();
    }
}

// Send immediate local notification to user
export async function sendLocalNotification(title: string, body:string) {
    await Notifications.scheduleNotificationAsync({
        content: { title, body },
        trigger: null,
    });
}

// Schedule a notification for a habit according to the details set by the user
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

    // Initialize list of notification IDs
    // One for each day that the habit repeats on
    const notificationIds: string[] = [];
    const startTime = startDate.getTime();
    const endTime = endDate.getTime();
    const currentTime = new Date().getTime();

    // Account for case when start date is in the future
    const delayTime = startTime > currentTime ? startTime - currentTime: 0;

    // Need different notification ID for each day that habit repeats
    for (const day of daysToRepeat) {

        const notifTrigger = {
            type: 'calendar',
            hour,
            minute,
            repeats: true,
            weekday: day,
        } as Notifications.CalendarTriggerInput;

        // Only create notification IDs after start date
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

    // Cancel scheduled notifications after end date set by user
    const stopNotifs = () => {
        const currentTime = new Date().getTime();
        if (currentTime >= endTime) {
            notificationIds.forEach(async (notificationId) => {
                await Notifications.cancelScheduledNotificationAsync(notificationId);
            });
        }
    }

    // Repeat cancel function once a day to check whether notifications need to be cancelled
    setInterval(stopNotifs, 86400000);

    return notificationIds;
};

// Notification format
Notifications.setNotificationHandler({
    handleNotification: async() => ({
        shouldShowAlert: true,
        shouldPlaySound: false,
        shouldSetBadge: false,
    }),
});

Notifications.setNotificationCategoryAsync('habit-reminders', actions);

// Function to cancel all scheduled notifications
export const unscheduleAllScheduledNotifications = async () => {
    try {
        await Notifications.cancelAllScheduledNotificationsAsync();
        console.log(`All scheduled notifications cancelled`)
    } catch (error) {
        console.error('Error cancelling all notifications:', error);
    }
}
