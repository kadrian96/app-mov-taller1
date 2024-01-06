import { Button, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';

export default function RegsitroScreen() {

const [nombre, setNombre] = useState('')
const [apellido, setApellido] = useState('')
const [correo, setCorreo] = useState('')
const [contrasenia, setContrasenia] = useState('')


  return (
    <View>
         <TextInput
      style={styles.constraint}
      placeholder='Ingresar Nombre'
      onChangeText={(texto)=>setNombre(texto)}/>
       <View style={{borderWidth:1, marginTop:10, width:300}}/>

      <TextInput
      style={styles.constraint}
      placeholder='Ingresar Apellido'
      onChangeText={(texto)=>setApellido(texto)}/>
       <View style={{borderWidth:1, marginTop:10, width:300}}/>

       <TextInput
      style={styles.constraint}
      placeholder='Ingresar Correo'
      onChangeText={(texto)=>setCorreo(texto)}/>
       <View style={{borderWidth:1, marginTop:10, width:300}}/>

       <TextInput
      style={styles.constraint}
      placeholder='Ingresar Contraseña'
      onChangeText={(texto)=>setContrasenia(texto)}/>
       <View style={{borderWidth:1, marginTop:10, width:300}}/>
    </View>
  )
}

const styles = StyleSheet.create({
    constraint: {
        padding: 10,
        marginTop: 25,
        color: 'white',
        backgroundColor:'#F3E5AB'
    },
})