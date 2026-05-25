import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { NavigationContainer } from '@react-navigation/native';
import LoginScreen from '../screens/Auth/LoginScreen';
import HomeTabs from './HomeTabs';
import FriendSelectionScreen from '../screens/Friends/FriendSelectionScreen';

const Stack = createStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Auth" component={LoginScreen} />
        <Stack.Screen name="Main" component={HomeTabs} />
        <Stack.Screen name="FriendSelection" component={FriendSelectionScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
