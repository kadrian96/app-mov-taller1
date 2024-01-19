
import { Button, ImageBackground, Modal, Pressable, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { get, onValue, ref } from 'firebase/database';
import { auth, db } from '../config/Config';
import { onAuthStateChanged } from 'firebase/auth';


export default function BienvenidaScreen({ navigation }: any) {
  //const insecto=['hormiga','abeja','araña','cucaracha','escarabajo']
  const [insecto, setinsecto] = useState("");
  const [dificultad, setdificultad] = useState("");
  const [levelview, setlevelview] = useState(false);
  const [mapview, setmapview] = useState(false);
  const [scoreview, setscoreview] = useState(false);
  const [toptenDatos, setToptenDatos] = useState([]);
  const [logged, setlogged] = useState(false);
  const [nick, setnick] = useState("");
  const [userimg, setuserimg] = useState("https://t4.ftcdn.net/jpg/05/10/14/15/240_F_510141519_evdfo5bdjlaMmrlyCCMzcO4LID6doX6W.jpg");
  
 
  
  // OBTENER DATOS USUARIO

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName:any = user.displayName;
        const photoURL:any = user.photoURL;
        setnick(displayName);
        setuserimg(photoURL);
        setlogged(true)
        //console.log("Este es el nick: ", nick)
      } else {
        // User is signed out
        console.log("Usuario desconectado");
        setlogged(false)
      }
    });
  
    return () => {
      // Desuscribe la función cuando el componente se desmonta
      unsubscribe();
    };
  }, []); 
  


  
  
  useEffect(() => {
    // LEER DATOS
    const leer = async () => {
      try {
        const starCountRef = ref(db, "puntuaciones/");

        // Usamos onValue para suscribirnos a cambios en la base de datos
        onValue(starCountRef, (snapshot) => {
          if (snapshot.exists()) {
            const data = snapshot.val();
            const dataTemp: any = Object.keys(data).map((id) => ({
              id,
              ...data[id],
            }));
            //ordeno de mayor a menor
            const sortedData:any = [...dataTemp].sort((a, b) => b.score - a.score);
            //obtengo las 10 puntuaciones mas altas
            const primerosDiezElementos = sortedData.slice(0, 10);
            setToptenDatos(primerosDiezElementos);
          } else {
            console.error('No hay datos en la referencia.');
          }
        });
      } catch (error) {
        console.error('Error al obtener datos:', error);
      }
    };
    

    leer();
  }, []); 

  type puntuacion = {
    id: any;
    nick: string;
    score: number;
  };

  type infojuego = {
    name: string,
    dificult: string,
    map:string
  }
  const asignarValores = (mapa: string) => {
    const gameobject: infojuego = {
      name: insecto,
      dificult: dificultad,
      map: mapa
    }
    // console.log(insecto)
    //console.log(dificultad)
    //console.log(gameobject)
    navigation.navigate('Juego', gameobject)
    setlevelview(false);
    setmapview(false);
    //setinsecto("");
    //setdificultad("");
  }

  //render seprator
  const renderSeparator = () => (
    <View style={styles.separator} />
  );

    //FUNCION PARA LA EXCEPCION DE OFFLINE
    function userisLogged(){
      if(logged){
        return navigation.navigate('Perfil');
      }
      else{
        return navigation.navigate('Offline');
      }
    }

  // Ordenar el array de objetos basado en la clave 'value'
 

  return (
    
    <ImageBackground
      source={require('../assets/image/bienvenida.jpg')}
      style={styles.container}
  
    >
      <Text></Text>
      <Pressable  style={styles.perfiltouch} onPress={() => userisLogged()}>
      <Text style={styles.textbutton1}>Perfil</Text>
        <View style={styles.circleContainer}>
          <Image source={{ uri: userimg }} style={styles.profileImage} />
        </View>
        
        </Pressable>

      <Text></Text>
      <Text style={styles.subtitulo}>Escoje el insecto que quieres aplastar!!</Text>
      <View>
        <TouchableOpacity style={styles.btn} onPress={() => (setlevelview(true), setinsecto("hormiga"))}>
          <Text style={styles.textbutton}>Hormiga 🐜</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.btn} onPress={() => (setlevelview(true), setinsecto("abeja"))}>
          <Text style={styles.textbutton}>Abeja 🐝</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => (setlevelview(true), setinsecto("araña"))}>
          <Text style={styles.textbutton}>Araña 🕷️</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => (setlevelview(true), setinsecto("cucaracha"))}>
          <Text style={styles.textbutton}>Cucaracha 🪳</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => (setlevelview(true), setinsecto("escarabajo"))}>
          <Text style={styles.textbutton}>Escarabajo 🪲</Text>
        </TouchableOpacity>
      
        <Text></Text>
        <Text></Text>
        <Button title='Puntuaciones' onPress={() => setscoreview(true)} color='#db4437' />
      </View>
      


      

      {levelview && (
        <Modal animationType="slide" transparent={true}>
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.leveltitle}>Escoje la dificultad:</Text>
              <View style={styles.containbtn}>

                <Pressable style={[styles.levelbtn, { backgroundColor: '#00CC99' }]} onPress={() => (setmapview(true),setdificultad("facil"))}>
                  <Text style={styles.textbtn}>Facil</Text>
                </Pressable>
                <Pressable style={[styles.levelbtn, { backgroundColor: '#ED9121' }]} onPress={() => (setmapview(true),setdificultad("medio"))} >
                  <Text style={styles.textbtn}>Medio</Text>
                </Pressable>
                <Pressable style={[styles.levelbtn, { backgroundColor: '#DE3163', marginBottom: 30 }]} onPress={() => (setmapview(true),setdificultad("dificil"))} >
                  <Text style={styles.textbtn}>Dificil</Text>
                </Pressable>
                <Button title='Volver' onPress={() => setlevelview(false)} />

              </View>

            </View>
          </View>
        </Modal>
      )}



{mapview && (
        <Modal animationType="slide" transparent={true}>
          <View style={styles.centeredView}>
            <View style={styles.modalmapView}>
              <Text style={styles.maptitle}>Escoje el mapa:</Text>
              <View >

                <Pressable style={styles.mapbtn} onPress={() => (asignarValores("hormiguero"))}>
                  <ImageBackground style={styles.mapimg} source={require("../assets/image/fondo-hormiguero.jpg")}>
                        <Text style={styles.textmapbtn}>Hormiguero</Text>
                  </ImageBackground>
                  
                </Pressable>
                <Pressable style={styles.mapbtn} onPress={() => (asignarValores("panal"))} >
                  <ImageBackground style={styles.mapimg} source={require("../assets/image/fondo-panal2.jpg")}>
                        <Text style={styles.textmapbtn}>Panal</Text>
                  </ImageBackground>
                </Pressable>
                <Pressable style={styles.mapbtn} onPress={() => (asignarValores("telaraña"))} >
                  <ImageBackground style={styles.mapimg} source={require("../assets/image/fondo-telaraña3.jpg")}>
                        <Text style={styles.textmapbtn}>Telaraña</Text>
                  </ImageBackground>
                </Pressable>
                <Pressable style={styles.mapbtn} onPress={() => (asignarValores("estanque"))} >
                  <ImageBackground style={styles.mapimg} source={require("../assets/image/fondo-estanque.jpg")}>
                        <Text style={styles.textmapbtn}>Estanque</Text>
                  </ImageBackground>
                </Pressable>
                <Pressable style={[styles.mapbtn, {marginBottom:15}]} onPress={() => (asignarValores("jardin"))} >
                  <ImageBackground style={styles.mapimg} source={require("../assets/image/fondo-jardin.jpg")}>
                        <Text style={styles.textmapbtn}>Jardin</Text>
                  </ImageBackground>
                </Pressable>

                <Button title='Volver' onPress={() => (setmapview(false),setlevelview(false))} />

              </View>

            </View>
          </View>
        </Modal>
      )}


      
{scoreview && (
        <Modal animationType="slide" transparent={true}>
          <View style={styles.centeredView}>
            <View style={styles.modalmapView}>
              <Text style={styles.maptitle}>Top 10 score:</Text>
              <View style={styles.flat1}>
              <FlatList
                data={toptenDatos}
          renderItem={({ item, index }: { item: puntuacion; index:number }) => (
            <View style={{ marginTop: 15 ,flexDirection:'row'}}>
              <Text style={styles.keytext}>{`${index + 1}. Nick:`}<Text style={styles.valuetext}> {item.nick}</Text> </Text>
              <Text style={styles.keytext}>  Score:<Text style={styles.valuetext}> {+item.score}</Text> </Text>
            </View>
          )}
          ItemSeparatorComponent={renderSeparator}
          style={styles.lista}
        />


                <Button title='Volver' onPress={() => setscoreview(false)} />

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
    color: "#db4437",
    textAlign: 'center'
  },
  subtitulo: {
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    color: "#4B5320",
    textAlign: 'center'
  },


  container: {
    flex: 1,
    resizeMode: 'cover',
    alignItems: 'center'
  },

  btn: {
    width: 150,
    height: 35,
    alignItems: 'center',
    verticalAlign: 'center',
    marginVertical: 20,
    backgroundColor: 'rgb(89,166,98)',
    paddingTop: 5,
    borderRadius: 15
  },
  textbutton: {
    fontSize: 18,
    color: 'white',
    fontWeight: 'bold'

  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    height: 400,
    width: 300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",

  },
  containbtn: {

    alignItems: 'center'

  },
  textbtn: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 15
  },
  levelbtn: {
    width: 100,
    height: 50,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  leveltitle: {
    marginTop: 30,
    fontSize: 25,
    fontWeight: "bold",
    color: "#D2691E",
    textAlign: 'center',
    marginBottom: 20
  },
  mapimg:{
    height:100,
    width:200,
    resizeMode:'contain',
    opacity:0.5,
    justifyContent:'center',
    alignItems: "center"
  },
  modalmapView: {
    height: 720,
    width: 350,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",

  },
  mapbtn: {
    width: 200,
    height: 100,
    marginVertical: 5,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 10
  },
  textmapbtn: {
    fontWeight: 'bold',
    fontSize: 20,
    opacity:1
  },
  maptitle: {
    marginTop: 30,
    fontSize: 25,
    fontWeight: "bold",
    color: "#D2691E",
    textAlign: 'center',
    marginBottom: 10
  },
  img2: {
    width: 30, // Ajusta el tamaño de la imagen según sea necesario
    height: 30, // Ajusta el tamaño de la imagen según sea necesario
    marginBottom: 10,
    marginTop:20,
    marginLeft:325
   
  },
  btn2: {
   // position:'absolute',
  top: 50,
  left: 150,
  zIndex: 1, // Asegura que el btn2 esté en la capa superior
  width: 150,
  height: 150,
  alignItems: 'center',
  justifyContent: 'center', // Centra el texto verticalmente
  backgroundColor: 'rgb(89,166,98)',
  borderRadius: 500,
  },
  textbutton1: {
    fontSize: 18,
    color: '#002387',
    fontWeight: 'bold',
    //top:5,
    left:15
  },
  separator: {
    height: 1,
    backgroundColor: 'gray',
    marginTop:5
  },
  keytext:{
    color:'#00AB66',
    fontWeight:'bold',
    fontStyle:'italic'

  },
  valuetext:{
    color:'black',
    fontWeight:'normal',
    fontStyle:'normal'
  },
  lista:{
    //backgroundColor: '#C5CBE1',
    padding: 10,
    margin: 10,
    borderRadius: 5,

  },
  flat1:{
    height:500,
    //width:250
    
  },
  circleContainer: {
    
    width: 70,
    height: 70,
    borderRadius: 50,
    overflow: "hidden",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 30,
    
  },
  profileImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
    borderRadius: 50,
  },
  perfiltouch:{
    //top:20,
    left:130,
    // alignItems: "center",
    // justifyContent: "center",
    marginTop:20,
    width:70,
    height:90,
    //backgroundColor:'#C0448F'

  }


})