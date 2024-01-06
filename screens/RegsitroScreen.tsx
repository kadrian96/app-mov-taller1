import { Button, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';

export default function RegsitroScreen() {

const [nombre, setNombre] = useState('')
const [apellido, setApellido] = useState('')
const [correo, setCorreo] = useState('')
const [contrasenia, setContrasenia] = useState('')


  return (
    <ImageBackground source={require('../assets/image/bienvenida.jpg')}
    style={styles.container} >
      <Text style={styles.titulo}>REGISTRARSE</Text>
         <TextInput
      style={styles.constraint}
      placeholder='Ingresar Nombre'
      onChangeText={(texto)=>setNombre(texto)}/>
       <Text></Text>

      <TextInput
      style={styles.constraint}
      placeholder='Ingresar Apellido'
      onChangeText={(texto)=>setApellido(texto)}/>
       <Text></Text>

       <TextInput
      style={styles.constraint}
      placeholder='Ingresar Correo'
      onChangeText={(texto)=>setCorreo(texto)}/>
       <Text></Text>

       <TextInput
      style={styles.constraint}
      placeholder='Ingresar Contraseña'
      onChangeText={(texto)=>setContrasenia(texto)}/>
       <Text></Text>
       </ImageBackground>
  )
}

const styles = StyleSheet.create({
    constraint: {
        padding: 10,
        marginTop: 25,
        color: 'white',
        backgroundColor:'#F3E5AB'
    },
    container:{
      flex:1,
      resizeMode:'cover',
      alignItems:'center'
  },
  titulo: {
    marginTop: 90,
    fontSize: 30,
    fontWeight: "bold",
    color: "#C41E3A",
    textAlign:'center'
  },

})