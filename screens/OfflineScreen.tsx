import { ImageBackground, Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useFonts } from 'expo-font';

export default function OfflineScreen({ navigation }:any) {
  //Importar fonts
  const [fontsLoaded] = useFonts({
    'pixel': require('../assets/fonts/pixel.ttf'),
  });

  if(!fontsLoaded){
    return null;
  }
  return (
    <ImageBackground source={require('../assets/image/fondo-offline.jpg')}style={styles.container}>
      <Text style={styles.titulo}>CREA UNA CUENTA O INICIA SESION</Text>
      <Text style={styles.parrafo}>para que puedas registar tus puntajes y puedas guardar tu informacion</Text>
      <Pressable style={[styles.optbtn, {backgroundColor:'#48BF91'}]} onPress={()=>navigation.navigate('Registro')}>
        <Text style={styles.textbtn}>Registrate</Text>
      </Pressable>
      <Pressable style={[styles.optbtn, {backgroundColor:'#FF4500'}]} onPress={()=>navigation.navigate('Login')}>
        <Text style={styles.textbtn}>Inicia Sesion</Text>
      </Pressable>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        resizeMode: 'cover',
        alignItems: 'center'
      },
    titulo: {
        marginTop: 185,
        fontSize: 20,
        fontFamily:'pixel',
        color: "#922B3E",
        textAlign: "center",
        marginBottom: 30,
        paddingHorizontal:40
      },
      parrafo:{
        marginTop: 25,
        fontSize: 18,
        fontWeight: "bold",
        color: "#4B5320",
        textAlign: "center",
        marginBottom: 40,
        paddingHorizontal:20

      },
      optbtn: {
        width: 100,
        height: 50,
        marginVertical: 15,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 10
      },
      textbtn: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 15
      },
})