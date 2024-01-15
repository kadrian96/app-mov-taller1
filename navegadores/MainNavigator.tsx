import { createStackNavigator } from '@react-navigation/stack';

import { NavigationContainer } from "@react-navigation/native";
import BienvenidaScreen from '../screens/BienvenidaScreen';
import JuegoScreen from '../screens/JuegoScreen';
import LoginScreen from '../screens/LoginScreen';
import RegsitroScreen from '../screens/RegistroScreen';
import WelcomeScreen from '../screens/WelcomeScreen';
import PerfilScreen from '../screens/PerfilScreen';

const Stack = createStackNavigator();





function MyStack() {
    return (
      
          <Stack.Navigator initialRouteName="Welcome">
      <Stack.Screen name="Welcome"component={WelcomeScreen} options={{headerShown:false}}/>
    
        <Stack.Screen name="Bienvenido"component={BienvenidaScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Login"component={LoginScreen} options={{headerShown:false}}/>
        <Stack.Screen name="Juego"component={JuegoScreen} />
        <Stack.Screen name="Registro"component={RegsitroScreen}options={{headerShown:false}}/>
        <Stack.Screen name="Perfil"component={PerfilScreen}options={{headerShown:false}}/>
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