
import { Button, ImageBackground, Modal, Pressable, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { TouchableOpacity } from 'react-native-gesture-handler'

export default function BienvenidaScreen({navigation}: any) {
  //const insecto=['hormiga','abeja','araña','cucaracha','escarabajo']
  const [insecto, setinsecto] = useState("");
 // const [dificultad, setdificultad] = useState("");
  const [levelview, setlevelview] = useState(false);
  //const [gameobject, setgameobject] = useState<any>({});
  //navigation.navigate('Juego',insecto[0])
  type infojuego={
    name:string,
    dificult:string,
  }
  const asignarValores=(dificultad:string)=>{
    const gameobject:infojuego={
      name:insecto,
      dificult:dificultad
    }
   // console.log(insecto)
    //console.log(dificultad)
    //console.log(gameobject)
    navigation.navigate('Juego',gameobject)
    setlevelview(false);
    //setinsecto("");
    //setdificultad("");
  }
  return (
    <ImageBackground
    source={require('../assets/image/bienvenida.jpg')}
    style={styles.container}
    >
        
        <Text style={styles.titulo}>Bienvenido al juego</Text>
        <Text style={styles.subtitulo}>Escoje el insecto que quieres aplastar!!</Text>

      <TouchableOpacity style={styles.btn} onPress={()=> (setlevelview(true),setinsecto("hormiga"))}>
            <Text style={styles.textbutton}>Hormiga 🐜</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.btn} onPress={()=> (setlevelview(true),setinsecto("abeja"))}>
            <Text style={styles.textbutton}>Abeja 🐝</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={()=> (setlevelview(true),setinsecto("araña"))}>
            <Text style={styles.textbutton}>Araña 🕷️</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={()=> (setlevelview(true),setinsecto("cucaracha"))}>
            <Text style={styles.textbutton}>Cucaracha 🪳</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.btn} onPress={()=> (setlevelview(true),setinsecto("escarabajo"))}>
            <Text style={styles.textbutton}>Escarabajo 🪲</Text>
      </TouchableOpacity>
      
      {levelview && (
          <Modal animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.leveltitle}>Escoje la dificultad:</Text>
                <View style={styles.containbtn}>
                    
                    <Pressable style={[styles.levelbtn,{backgroundColor:'#00CC99'}]} onPress={() =>(asignarValores("facil"))}>
                        <Text style={styles.textbtn}>Facil</Text>
                    </Pressable>
                    <Pressable style={[styles.levelbtn,{backgroundColor:'#ED9121'}]} onPress={() => (asignarValores("medio"))} >
                        <Text style={styles.textbtn}>Medio</Text>
                    </Pressable> 
                    <Pressable style={[styles.levelbtn,{backgroundColor:'#DE3163',marginBottom:30}]} onPress={() =>(asignarValores("dificil"))} >
                        <Text style={styles.textbtn}>Dificil</Text>
                    </Pressable> 
                    <Button title='Volver'  onPress={()=>setlevelview(false)}/>
                    
                </View>
                
              </View>
            </View>
          </Modal>
        )}
      
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

    },
    centeredView: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "rgba(0, 0, 0, 0.5)",
    },
    modalView: {
      height:400,
      width:300,
      backgroundColor: "white",
      borderRadius: 10,
      padding: 20,
      alignItems: "center",
      
    },
    containbtn:{

      alignItems:'center'
  
    },
    textbtn:{
      color:'white',
      fontWeight:'bold',
      fontSize:15
    },
    levelbtn:{
      width:100,
      height:50,
      marginVertical:5,
      alignItems:'center',
      justifyContent:'center',
      borderRadius:10
    },
    leveltitle: {
      marginTop: 30,
      fontSize: 25,
      fontWeight: "bold",
      color: "#D2691E",
      textAlign:'center',
      marginBottom:20
    },

})