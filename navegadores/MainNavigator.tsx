import { createStackNavigator } from '@react-navigation/stack';

import { NavigationContainer } from "@react-navigation/native";
import BienvenidaScreen from '../screens/BienvenidaScreen';
import JuegoScreen from '../screens/JuegoScreen';




const Stack = createStackNavigator();




function MyStack() {
    return (
      <Stack.Navigator initialRouteName="Bienvenido">
        <Stack.Screen name="Bienvenido"component={BienvenidaScreen}/>
        <Stack.Screen name="Juego"component={JuegoScreen}/>
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