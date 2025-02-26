import notifee, {
  AndroidImportance,
  TimestampTrigger,
  TriggerType,
} from '@notifee/react-native';

export const DEFAULT_CHANNEL_ID = 'default-channel';

class NotificationService {
  async configure() {
    const settings = await this.requestPermission();
    if (!settings.authorizationStatus) {
      console.log('User denied notifications permission');
    }

    await notifee.createChannel({
      id: DEFAULT_CHANNEL_ID,
      name: 'Default Channel',
      vibration: true,
    });
  }

  requestPermission = () => notifee.requestPermission();

  async scheduleNotification(
    id: string,
    title: string,
    body: string,
    hours: number,
    minutes: number,
  ) {
    const now = new Date();
    const triggerDate = new Date(now);
    triggerDate.setHours(hours, minutes, 0, 0);

    if (triggerDate.getTime() < now.getTime()) {
      triggerDate.setDate(triggerDate.getDate() + 1);
    }

    const trigger: TimestampTrigger = {
      type: TriggerType.TIMESTAMP,
      timestamp: triggerDate.getTime(),
      repeatFrequency: 1,
    };

    await notifee.createTriggerNotification(
      {
        id,
        title,
        body,
        android: {
          channelId: DEFAULT_CHANNEL_ID,
          importance: AndroidImportance.HIGH,
        },
      },
      trigger,
    );
  }

  async cancelAllNotifications() {
    await notifee.cancelAllNotifications();
  }

  async cancelNotification(id: string) {
    await notifee.cancelNotification(id);
  }
}

export default new NotificationService();
