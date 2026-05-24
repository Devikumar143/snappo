import * as Notifications from 'expo-notifications';
import * as TaskManager from 'expo-task-manager';
import { NativeModules, Platform } from 'react-native';
import SharedPreferences from 'react-native-shared-preferences';

const BACKGROUND_NOTIFICATION_TASK = 'BACKGROUND_NOTIFICATION_TASK';

TaskManager.defineTask(BACKGROUND_NOTIFICATION_TASK, async ({ data, error }: any) => {
  if (error) {
    console.error(error);
    return;
  }
  if (data) {
    const { notification } = data;
    await handleBackgroundNotification(notification);
  }
});

export const registerBackgroundTask = async () => {
  await Notifications.registerTaskAsync(BACKGROUND_NOTIFICATION_TASK);
};

const { WidgetModule } = NativeModules;

export const setupNotifications = () => {
  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      shouldShowBanner: true,
      shouldShowList: true,
    }),
  });
};

export const handleBackgroundNotification = async (notification: any) => {
  const { data } = notification.request.content;
  
  if (data.type === 'NEW_SNAP') {
    const { media_url, expiry } = data;
    
    if (Platform.OS === 'android') {
      // 1. Save to SharedPreferences for the widget
      SharedPreferences.setName('DATA');
      SharedPreferences.setItem('last_snap_url', media_url);
      SharedPreferences.setItem('last_snap_status', 'New Snap Received!');
      
      // 2. Trigger Widget Update
      if (WidgetModule) {
        WidgetModule.updateWidget();
      }
      
      // 3. Set a timer to clear the snap after expiry
      const expirySeconds = parseInt(expiry) || 5;
      setTimeout(() => {
        SharedPreferences.setItem('last_snap_url', '');
        SharedPreferences.setItem('last_snap_status', 'Snap Expired');
        if (WidgetModule) {
          WidgetModule.updateWidget();
        }
      }, expirySeconds * 1000);
    }
  }
};
