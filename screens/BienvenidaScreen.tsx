
import { Button, ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function BienvenidaScreen({navigation}: any) {
  const insecto=['hormiga','abeja','araña','cucaracha','escarabajo']
  
  return (
    <ImageBackground
    source={require('../assets/image/bienvenida.jpg')}
    style={styles.container}
    >
        
        <Text style={styles.titulo}>Bienvenido al juego</Text>
        <Text style={styles.subtitulo}>Escoje el insecto que quieres aplastar!!</Text>

      <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Juego',insecto[0])}>
            <Text style={styles.textbutton}>Hormiga 🐜</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Juego',insecto[1])}>
            <Text style={styles.textbutton}>Abeja 🐝</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Juego',insecto[2])}>
            <Text style={styles.textbutton}>Araña 🕷️</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Juego',insecto[3])}>
            <Text style={styles.textbutton}>Cucaracha 🪳</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Juego',insecto[4])}>
            <Text style={styles.textbutton}>Escarabajo 🪲</Text>
      </TouchableOpacity>

      
    </ImageBackground>
   
  )
}

const styles = StyleSheet.create({
  titulo: {
    marginTop: 90,
    fontSize: 30,
    fontWeight: "bold",
    color: "#C41E3A",
    textAlign:'center'
  },
  subtitulo: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B5320",
    textAlign:'center'
  },
  

    container:{
        flex:1,
        resizeMode:'cover',
        alignItems:'center'
    },
  
    btn:{
        width:150,
        height:35,
       alignItems:'center',
       verticalAlign:'center',
      marginVertical:20,
       backgroundColor:'#56A0D3',
       paddingTop:5,
       
  
       borderRadius:5
    },
    textbutton:{
        fontSize:15,
        color:'white',
        fontWeight:'bold'

    }

})