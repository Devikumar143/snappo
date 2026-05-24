import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import AppNavigator from './src/navigation/AppNavigator';
import { setupNotifications, registerBackgroundTask } from './src/utils/notifications';
import * as Notifications from 'expo-notifications';

export default function App() {
  useEffect(() => {
    setupNotifications();
    registerBackgroundTask();
    
    // Register background listener
    const backgroundSubscription = Notifications.addNotificationResponseReceivedListener((response: Notifications.NotificationResponse) => {
      // Handle interaction
    });

    return () => {
      backgroundSubscription.remove();
    };
  }, []);

  return <AppNavigator />;
}
