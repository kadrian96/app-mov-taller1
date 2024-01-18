import { createStackNavigator } from "@react-navigation/stack";

import { NavigationContainer } from "@react-navigation/native";
import BienvenidaScreen from '../screens/BienvenidaScreen';
import JuegoScreen from "../screens/JuegoScreen";
import LoginScreen from "../screens/LoginScreen";
import WelcomeScreen from "../screens/WelcomeScreen";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import PerfilScreen from "../screens/PerfilScreen";
import { Icon } from "@rneui/themed";
import RegistroScreen from "../screens/RegistroScreen";

const Stack = createStackNavigator();

function MyStack() {
  return (
    <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen
        name="Welcome"
        component={WelcomeScreen}
        options={{ headerShown: false }}
      />

      <Stack.Screen
        name="Juego"
        component={JuegoScreen}
      />
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Registro"
        component={RegistroScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Bienvenido"
        component={BienvenidaScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="Perfil"
        component={PerfilScreen}
       
      />

    </Stack.Navigator>
  );
}





export default function StackNavigator() {
  return (
    <NavigationContainer>
      <MyStack />
    </NavigationContainer>
  );
}
