import { createStackNavigator } from '@react-navigation/stack';

import { NavigationContainer } from "@react-navigation/native";
import BienvenidaScreen from '../screens/BienvenidaScreen';
import JuegoScreen from '../screens/JuegoScreen';
import LoginScreen from '../screens/LoginScreen';
import RegsitroScreen from '../screens/RegsitroScreen';




const Stack = createStackNavigator();




function MyStack() {
    return (
      <Stack.Navigator initialRouteName="Bienvenido">
        <Stack.Screen name="Bienvenido"component={BienvenidaScreen}/>
        <Stack.Screen name="Login"component={LoginScreen}/>
        <Stack.Screen name="Juego"component={JuegoScreen}/>
        <Stack.Screen name="Registro"component={RegsitroScreen}/>
      </Stack.Navigator>
    );
  }


export default function StackNavigator(){
    return(
        <NavigationContainer>
            <MyStack/>
        </NavigationContainer>
    )
}