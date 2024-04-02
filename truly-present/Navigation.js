// Navigation.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen'; // Import the RegisterScreen component
import AttendanceScreen from './AttendanceScreen';
import ResponseDisplayScreen from './ResponseDisplayScreen';

const Stack = createStackNavigator();

const Navigation = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Login">
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="Attendance" component={AttendanceScreen} />
        <Stack.Screen name="ResponseDisplay" component={ResponseDisplayScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
