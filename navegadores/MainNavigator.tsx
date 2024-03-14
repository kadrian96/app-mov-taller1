import { createStackNavigator } from "@react-navigation/stack";

import { NavigationContainer } from "@react-navigation/native";
import BienvenidaScreen from '../screens/BienvenidaScreen';
import JuegoScreen from "../screens/JuegoScreen";
import LoginScreen from "../screens/LoginScreen";
import WelcomeScreen from "../screens/WelcomeScreen";

import PerfilScreen from "../screens/PerfilScreen";
import RegistroScreen from "../screens/RegistroScreen";
import OfflineScreen from "../screens/OfflineScreen";

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
        options={{ headerShown: false }}
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
        options={({ navigation }) => ({
          headerTitle: "Tu Perfil",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#1ABC9C",
          
          },
          headerTitleStyle: {
            //fontWeight: "bold",
            fontSize: 20,
          }

        })}
       
      />
      <Stack.Screen
        name="Offline"
        component={OfflineScreen}
        options={({ navigation }) => ({
          headerTitle: "Offline",
          headerTintColor: "#fff",
          headerStyle: {
            backgroundColor: "#1ABC9C",
          
          },
          headerTitleStyle: {
            //fontWeight: "bold",
            fontSize: 20,
          }

        })}
       
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
