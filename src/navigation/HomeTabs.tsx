import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CameraScreen from '../screens/Camera/CameraScreen';
import SearchScreen from '../screens/Friends/SearchScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Camera"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#FFFC00', // Snapchat yellow
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 1,
          borderTopColor: '#1C1C1E',
          height: Platform.OS === 'ios' ? 90 : 65,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: any;

          if (route.name === 'Search') {
            iconName = focused ? 'search' : 'search-outline';
          } else if (route.name === 'Camera') {
            iconName = focused ? 'camera' : 'camera-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          // Center Camera button styling
          if (route.name === 'Camera') {
            return (
              <View style={[
                styles.cameraTabContainer,
                focused && styles.cameraTabActive
              ]}>
                <Ionicons name={iconName} size={28} color={focused ? '#000000' : '#FFFFFF'} />
              </View>
            );
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{
          tabBarLabel: 'Search',
        }}
      />
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{
          tabBarLabel: 'Camera',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  cameraTabContainer: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#1C1C1E',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 10 : 12,
    borderWidth: 1,
    borderColor: '#2C2C2E',
    ...Platform.select({
      ios: {
        shadowColor: '#000000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
      },
      android: {
        elevation: 6,
      },
    }),
  },
  cameraTabActive: {
    backgroundColor: '#FFFC00',
    borderColor: '#FFFC00',
  },
});
