import { Button, ImageBackground, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { NavigationContainer } from '@react-navigation/native';

export default function LoginScreen({navigation}:any) {
    const [correo, setCorreo] = useState('')
    const [contrasenia, setContrasenia] = useState('')

   

  return (
    <ImageBackground
    source={require('../assets/image/bienvenida.jpg')}
    style={styles.container}
    >
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
       
       <TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Registro')}>
            <Text style={styles.textbutton}>LOGIN</Text>
      </TouchableOpacity>
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