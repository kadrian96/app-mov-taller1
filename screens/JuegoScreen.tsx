import { ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function JuegoScreen({route}:any) {
    const insecto=route.params
    console.log(insecto)
    function selectinsect(){
        switch(insecto){
            case 'hormiga':
                return '🐜'
            case 'abeja':
                return '🐝'
            case 'araña':
                return '🕷️'
            case 'cucaracha':
                return '🪳'
            case 'escarabajo':
                return '🪲'

        }
    }
    
  return (
    <ImageBackground 
    source={require('../assets/image/lodo.jpg')}
    style={styles.container}
    >
        <View  style={styles.textocontain}>
            <Text style={styles.texto}>Score:</Text>
            <Text style={styles.texto}>Tiempo:</Text>
           
        </View>
        <TouchableOpacity>
                <Text style={styles.insecto}>{selectinsect()}</Text>
            </TouchableOpacity>


    </ImageBackground>
  )
}

const styles = StyleSheet.create({
    container:{
        flex:1,
        resizeMode:'cover',
        
    },
    textocontain:{
        width:'100%',
        height:50,
        backgroundColor:'#B2BEB5',
        alignItems:'center',
        flexDirection:'row',
        alignContent:'center',
        paddingHorizontal:40
    },
    texto:{
        textAlign:'center',
        marginHorizontal:20,
        fontSize:20,
        color:'#E52B50',
        fontWeight:'bold'
        
    },
    insecto:{
        fontSize:40
    }


})