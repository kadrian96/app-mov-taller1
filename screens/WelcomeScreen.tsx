import {  Button,Image,ImageBackground, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function WelcomeScreen({navigation}:any) {
  return (
    <ImageBackground
    source={require('../assets/image/full.jpg')}
    style={styles.container}>
<Text style={styles.titulo}></Text>

<TouchableOpacity style={styles.btn} onPress={()=> navigation.navigate('Login')}>
            <Text style={styles.textbutton}>PUSH</Text>
            <Image
            style={styles.img2}
            source={require('../assets/image/aplastado1.png')}
            />
      </TouchableOpacity>

    </ImageBackground>
  )

}

const styles = StyleSheet.create({


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
  btn:{
    
    width: 105,
    height: 130,
   alignItems: 'center',
    justifyContent: 'flex-start', 
    marginTop: 500, 
    paddingTop: 8,
    borderRadius: 5,
},
textbutton:{
    fontSize:15,
    color:'red',
    fontWeight:'bold',
    

},
img2:{

  flex: 1,
  alignItems: 'center',
  padding: 10,
  marginBottom: 20,

},
})