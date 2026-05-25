import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import CameraScreen from '../screens/Camera/CameraScreen';
import SearchScreen from '../screens/Friends/SearchScreen';
import ProfileScreen from '../screens/Profile/ProfileScreen';
import { Feather } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';

const Tab = createBottomTabNavigator();

export default function HomeTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Camera"
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#FFFFFF', // Monochromatic white
        tabBarInactiveTintColor: '#444444',
        tabBarLabelStyle: {
          fontSize: 10,
          fontWeight: '700',
          letterSpacing: 1.5,
          marginTop: -4,
          marginBottom: 4,
        },
        tabBarStyle: {
          backgroundColor: '#000000',
          borderTopWidth: 1,
          borderTopColor: '#111111',
          height: Platform.OS === 'ios' ? 90 : 65,
          paddingBottom: Platform.OS === 'ios' ? 30 : 10,
          paddingTop: 8,
        },
        tabBarIcon: ({ color, size, focused }) => {
          let iconName: any;

          if (route.name === 'Search') {
            iconName = 'search';
          } else if (route.name === 'Camera') {
            iconName = 'aperture';
          } else if (route.name === 'Profile') {
            iconName = 'user';
          }

          // Center Camera button styling
          if (route.name === 'Camera') {
            return (
              <View style={[
                styles.cameraTabContainer,
                focused && styles.cameraTabActive
              ]}>
                <Feather name={iconName} size={20} color={focused ? '#000000' : '#FFFFFF'} />
              </View>
            );
          }

          return <Feather name={iconName} size={18} color={color} />;
        },
      })}
    >
      <Tab.Screen 
        name="Search" 
        component={SearchScreen} 
        options={{
          tabBarLabel: 'SEARCH',
        }}
      />
      <Tab.Screen 
        name="Camera" 
        component={CameraScreen} 
        options={{
          tabBarLabel: 'CAMERA',
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen} 
        options={{
          tabBarLabel: 'PROFILE',
        }}
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  cameraTabContainer: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Platform.OS === 'ios' ? 10 : 12,
    borderWidth: 1,
    borderColor: '#222222',
  },
  cameraTabActive: {
    backgroundColor: '#FFFFFF',
    borderColor: '#FFFFFF',
  },
});
