// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/home';
import GameScreen from './screens/blackjack';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home">
        <Stack.Screen 
          name="Home" 
          component={HomeScreen} 
          options={{ title: "Blackjack" }} 
        />
        <Stack.Screen 
          name="Game" 
          component={GameScreen} 
          options={{ title: "Mesa de Jogo" }} 
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
