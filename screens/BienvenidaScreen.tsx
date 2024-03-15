import { Button, ImageBackground, Modal, Pressable, StyleSheet, Text, View, Image } from 'react-native';
import React, { useEffect, useState } from 'react'
import { FlatList, TouchableOpacity } from 'react-native-gesture-handler'
import { NavigationContainer } from '@react-navigation/native';
import { get, onValue, ref } from 'firebase/database';
import { auth, db } from '../config/Config';
import { onAuthStateChanged } from 'firebase/auth';
import { useFonts } from 'expo-font';

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
  let focusListener:any = null;
 
  
  // OBTENER DATOS USUARIO

  useEffect(() => {

    
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user!=null) {
        const displayName:any = user.displayName;
        setnick(displayName);
        setlogged(true)
        if(user.photoURL==null){
          setuserimg("https://cdn-icons-png.flaticon.com/512/12595/12595885.png");
        }else{
          const photoURL:any = user.photoURL;
          setuserimg(photoURL);
        }

        //console.log("Este es el nick: ", nick)
      } else {
        // User is signed out
        console.log("Usuario desconectado");
        setlogged(false)
      }
    });

    focusListener = navigation.addListener('focus', () => {
      const user = auth.currentUser;
    if (user!=null) {
      //console.log('actualizando')
      if(user.photoURL==null){
        setuserimg("https://cdn-icons-png.flaticon.com/512/12595/12595885.png");
      }else{
        const photoURL:any = user.photoURL;
        setuserimg(photoURL);
      }
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

  //Importar fonts
  const [fontsLoaded] = useFonts({
    'pixel': require('../assets/fonts/pixel.ttf'),
  });

  if(!fontsLoaded){
    return null;
  }

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
    //console.log(insecto)
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
      source={require('../assets/image/fondo-bienv4r3.jpg')}
      style={styles.container}
  
    >
      <Text></Text>
      <Pressable  style={styles.perfiltouch} onPress={() => userisLogged()}>
      
        <View style={styles.circleContainer}>
          <Image source={{ uri: userimg }} style={styles.profileImage} />
        </View>
        <Text style={styles.textbutton1}>Perfil</Text>
        
        </Pressable>

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
        <TouchableOpacity style={styles.btnscore} onPress={() => setscoreview(true)}>
                  <Text style={styles.textbtn}>Puntuaciones</Text>
        </TouchableOpacity>
      </View>
      


      

      {levelview && (
        <Modal animationType="slide" transparent={true}>
          <View style={styles.centeredView}>
            <ImageBackground source={require('../assets/image/modal-game1.jpg')} style={styles.modalView}>
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
                <Pressable style={styles.btnback} onPress={() => setlevelview(false)}>
                  <Text style={styles.textbtn}>Regresar</Text>
                </Pressable>
                

              </View>

            </ImageBackground>
          </View>
        </Modal>
      )}



{mapview && (
        <Modal animationType="slide" transparent={true}>
          <View style={styles.centeredView}>
            <ImageBackground source={require('../assets/image/modal-game2.jpg')} style={styles.modalmapView} imageStyle={{opacity:0.8}}>
              <Text style={styles.maptitle}>Escoje el mapa:</Text>
              <View >
                <Pressable style={styles.mapbtn} onPress={() => (asignarValores("hormiguero"))}>
                  <ImageBackground style={styles.mapimg} source={require("../assets/image/fondo-hormiguero.jpg")}>
                    <View style={styles.overlay}>
                      <Text style={styles.textmapbtn}>Hormiguero</Text>
                    </View>
                  </ImageBackground>
                </Pressable>
                <Pressable style={styles.mapbtn} onPress={() => (asignarValores("panal"))} >
                  <ImageBackground style={styles.mapimg} source={require("../assets/image/fondo-panal2.jpg")}>
                    <View style={styles.overlay}>
                      <Text style={styles.textmapbtn}>Panal</Text>
                    </View>
                        
                  </ImageBackground>
                </Pressable>
                <Pressable style={styles.mapbtn} onPress={() => (asignarValores("telaraña"))} >
                  <ImageBackground style={styles.mapimg} source={require("../assets/image/fondo-telaraña3.jpg")}>
                    <View style={styles.overlay}>
                      <Text style={styles.textmapbtn}>Telaraña</Text>
                    </View>
                        
                  </ImageBackground>
                </Pressable>
                <Pressable style={styles.mapbtn} onPress={() => (asignarValores("estanque"))} >
                  <ImageBackground style={styles.mapimg} source={require("../assets/image/fondo-estanque.jpg")}>
                    <View style={styles.overlay}>
                      <Text style={styles.textmapbtn}>Estanque</Text>
                    </View>
                        
                  </ImageBackground>
                </Pressable>
                <Pressable style={[styles.mapbtn, {marginBottom:15}]} onPress={() => (asignarValores("jardin"))} >
                  <ImageBackground style={styles.mapimg} source={require("../assets/image/fondo-jardin.jpg")}>
                    <View style={styles.overlay}>
                      <Text style={styles.textmapbtn}>Jardin</Text>
                    </View>
                        
                  </ImageBackground>
                </Pressable>
                

              </View>
              <Pressable style={styles.btnback} onPress={() => (setmapview(false),setlevelview(false))}>
                  <Text style={styles.textbtn}>Regresar</Text>
                </Pressable>

            </ImageBackground>
          </View>
        </Modal>
      )}


      
{scoreview && (
        <Modal animationType="slide" transparent={true}>
          <View style={styles.centeredView}>
            <ImageBackground source={require("../assets/image/modal-score1.jpg")} style={styles.modalmapView}>
              <Text style={styles.scoretitle}>Top 10 score:</Text>
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

                
              </View>
              <Pressable style={styles.btnback} onPress={() => setscoreview(false)}>
                  <Text style={styles.textbtn}>Regresar</Text>
                </Pressable>

            </ImageBackground>
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
    //flex:0.4,
    marginTop: 20,
    fontSize: 25,
    color: "#FF0800",
    textAlign: 'center',
    marginBottom: 10,
    paddingHorizontal:40,
    fontFamily:'pixel'

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
    //backgroundColor: "white",
    borderRadius: 20,
    padding: 20,
    alignItems: "center",
    overflow: 'hidden'

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
    borderRadius: 10,
    borderRightWidth: 1,
    borderLeftWidth:1,
    borderBottomWidth: 5,
    shadowOffset:{ width: 1, height: 13 },
    shadowColor:'black',
    shadowRadius:15,
    shadowOpacity: 1,
    elevation: 10
  },
  leveltitle: {
    marginTop: 10,
    fontSize: 25,
    fontFamily:'pixel',
    color: "#FF9800",
    textAlign: 'center',
    marginBottom: 30
    //#D2691E
  },
  mapimg:{
    height:100,
    width:200,
    resizeMode:'contain',
    //opacity:0.5,
    justifyContent:'center',
    alignItems: "center"
  },
  modalmapView: {
    height: 720,
    width: 350,
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    overflow:'hidden',
  

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
    fontWeight:'bold',
    color:'white',
    fontSize: 20,
    opacity:1
  },
  maptitle: {
    marginTop: 30,
    fontSize: 25,
    fontFamily:'pixel',
    color: "#D2691E",
    textAlign: 'center',
    marginBottom: 10
  },
  
  
  textbutton1: {
    fontSize: 18,
    color: '#002387',
    fontWeight: 'bold',
    //top:5,
    left:15
  },
  separator: {
    height: 0.5,
    backgroundColor: 'white',
    marginTop:5,
    borderWidth:0.5,
    borderColor:'white'
  },
  keytext:{
    color:'#FFEE58',
    fontWeight:'bold',
    fontStyle:'italic'

  },
  valuetext:{
    color:'white',
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
    marginTop:20,
    width:70,
    height:90,
    //backgroundColor:'#C0448F'

  },
  overlay: {
    height:'100%',
    width:'100%',
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'rgba(0,0,0,0.4)'
},
scoretitle: {
  marginTop: 55,
  fontSize: 25,
  fontFamily:'pixel',
  color: "#F39C12",
  textAlign: 'center',
  marginBottom: 5
},
btnback: {
  paddingVertical:5,
  paddingHorizontal:15,
  marginVertical: 5,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 5,
  backgroundColor:'#00a4ef'
},
btnscore: {
  paddingVertical:7,
  paddingHorizontal:15,
  marginVertical: 5,
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: 5,
  backgroundColor:'#64B5F6'
},



})