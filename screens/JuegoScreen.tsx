import {
  Alert,
  Button,
  Image,
  ImageBackground,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Audio } from 'expo-av';
import { ref, set } from "firebase/database";
import { auth, db } from "../config/Config";
import { onAuthStateChanged } from "firebase/auth";
import { Icon } from "@rneui/base";
import { useFonts } from 'expo-font';




export default function JuegoScreen({ route,navigation }: any) {

  type infojuego={
    name:string,
    dificult:string,
    map:string
  }
  const insecto:infojuego = route.params;
    //console.log(insecto)
  //importado estatico de las imagenes de insecto
const hormigaimg = require('../assets/image/hormiga2.png');
const abejaimg = require('../assets/image/abeja.png');
const arañaimg = require('../assets/image/araña3.png');
const cucarachaimg = require('../assets/image/cucaracha.png');
const escarabajoimg = require('../assets/image/escarabajo.png');
const bloodimg = require('../assets/image/bloodsplash.png');

//importado estatico de las imagenes de mapas
const hormigueroimg = require('../assets/image/fondo-hormiguero.jpg');
const panalimg = require('../assets/image/fondo-panal2.jpg');
const telarañaimg = require('../assets/image/fondo-telaraña3.jpg');
const estanqueimg = require('../assets/image/fondo-estanque.jpg');
const jardinimg = require('../assets/image/fondo-jardin.jpg');

  const [objects, setObjects] = useState<
    Array<{ id: number; img: any; x: number; y: number }>
  >([]);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(30); // Tiempo en segundos
  const [gameOver, setGameOver] = useState(false);
  const [viewDimensions, setViewDimensions] = useState({ width: 0, height: 0 });
  const [altura, setaltura] = useState("");
  const [gameActive, setGameActive] = useState(true);
  const [isPaused, setisPaused] = useState(false);
  const [nick, setnick] = useState("");
  const [logged, setlogged] = useState(false);
  const [insectoimg, setInsectoimg] = useState(()=>{
    switch (insecto.name) {
          case "hormiga":
            return hormigaimg;
          case "abeja":
            return abejaimg;
          case "araña":
            return arañaimg;
          case "cucaracha":
            return cucarachaimg;
          case "escarabajo":
            return escarabajoimg;
          default:
            return hormigaimg;

    }
  });
  const [dificultad, setdificultad] = useState(()=>{
    switch (insecto.dificult) {
          case "facil":
            return 700;
          case "medio":
            return 500;
          case "dificil":
            return 300;

    }
  });
  const [map, setmap] = useState(()=>{
    switch (insecto.map) {
          case "hormiguero":
            return hormigueroimg;
          case "panal":
            return panalimg;
          case "telaraña":
            return telarañaimg;
          case "estanque":
            return estanqueimg;
          case "jardin":
            return jardinimg;
          default:
            return hormigueroimg;


    }
  });


  
  //OBTENCION DEL USUARIO ACTUAL
  
  function usuarioActual() {
    const user = auth.currentUser;
    if (user !== null) {
      
      // The user object has basic properties such as display name, email, etc.
    
      const displayName: any = user.displayName;
      setnick(displayName);
      //console.log(nick)
      setlogged(true);
    
    }
   
  }
  
    
  
  //OBTENER LAS DIMENSIONES DEL COMPONENTE
  const onLayout = (event: any) => {
    const { width, height, y } = event.nativeEvent.layout;
    setViewDimensions({ width, height });
    setaltura(y);
  };


  //CARGAR LA MUSICA AL INICIO DEL JUEGO
  useEffect(() => {
    if (gameOver) {
      return; // para la carga de la musica
    }
     // Carga la música de fondo al cargar el componente
     loadBackgroundMusic();
   
  }, [gameOver])
  

  //LOGICA DEL JUEGO
  useEffect(() => {
    usuarioActual();
    // Generar objetos aleatorios cada segundo
    
    if (!gameActive || isPaused) {
        return; // No generar más objetos si el juego no está activo
      }

        const intervalId = setInterval(() => {
            setObjects((prevObjects) => [
              ...prevObjects,
              {
                id: Date.now(),
                img:insectoimg,
                x: Math.random() * 342.727, //limite de ancho
                y: Math.random() * 549.818 + 50.1818, // se pone el limite del alto y se suma la posicion inicial de la ventana
              },
            ]);
          }, dificultad);
      
          // Actualizar el tiempo
          const timeIntervalId = setInterval(() => {
            setTime((prevTime) => (prevTime > 0 ? prevTime - 1 : 0));
          }, 1000);
      
          // Limpiar intervalos cuando el juego termina
          return () => {
            clearInterval(intervalId);
            clearInterval(timeIntervalId);
          };
    
   
  }, [gameActive,isPaused]);

  //console.log(objects);

  const eliminacionObjectInsect = (objectId: number) => {
    //Borrar el insecto del arreglo
    setObjects((prevObjects) =>
      prevObjects.filter((obj) => obj.id !== objectId)
    );
    setScore((prevScore) => prevScore + 1);
  };

  // FUNCION PARA CAMBIAR EMOJI POR BLOOD SPLASH
  const aplastadoInsect=(objectId: number)=>{
    setObjects((prevData) =>
      prevData.map((item) => (item.id === objectId ? { ...item, img:bloodimg } : item))
    );
  }

  useEffect(() => {
    if (time === 0) {
      // Cuando el tiempo llega a cero, mostrar pantalla de Game Over
      setGameOver(true);
      setGameActive(false);
      setObjects([]);
      stopBackgroundMusic();
      guardarScore(Date.now(),nick,score)
    }
  }, [time]);

  const RestartGame = () => {
    // Reiniciar el juego
    setObjects([]);
    setScore(0);
    setTime(30);
    setGameOver(false);
    setGameActive(true);
    restartBackgroundMusic();
  };
  
  //REPRODUCCION DE EFECTO DE APLASTADO
 
    const [sound, setSound] = useState<any>();
  
    async function playSound() {
      //console.log('Loading Sound');
      const { sound }:any = await Audio.Sound.createAsync( require('../assets/sound/efecto-aplastado.mp3')
      );
      setSound(sound);
  
      //console.log('Playing Sound');
      await sound.playAsync();
    }
  
    useEffect(() => {
      return sound
        ? () => {
            //console.log('Unloading Sound');
            sound.unloadAsync();
          }
        : undefined;
    }, [sound]);


  // REPRODUCCION DE MUSICA DE FONDO
  const [soundback, setSoundback] = useState<Audio.Sound | null>(null);

  useEffect(() => {
  
    // Limpia el sonido cuando el componente se desmonta
    return soundback ? () => {
      stopBackgroundMusic();
        soundback.unloadAsync();
      }
      : undefined;
    
  }, [soundback]);



  const loadBackgroundMusic = async () => {
    try {
      const { sound } = await Audio.Sound.createAsync(
        require('../assets/sound/game-music-loop-20.mp3'),
        { shouldPlay: true, isLooping: true }
      );
      setSoundback(sound);
    } catch (error) {
      console.error('Error al cargar la música de fondo', error);
    }
  };

  const playBackgroundMusic = async () => {
    if (soundback) {
      await soundback.playAsync();
    }
  };

  const pauseBackgroundMusic = async () => {
    if (soundback) {
      await soundback.pauseAsync();
    }
  };

  const stopBackgroundMusic = async () => {
    if (soundback) {
      await soundback.stopAsync();
      //console.log('se detuvo la musica')
    }
  };

  const restartBackgroundMusic = async () => {
    if (soundback) {
      await soundback.setPositionAsync(0); // Establece la posición de reproducción al principio
      await soundback.playAsync();
    }
  };

  // Guardar score
  function guardarScore(
    id:any,
    nick: string,
    score: number
  ) {
    if(logged){
      set(ref(db, "puntuaciones/" + id), {
        nick: nick,
        score: score,
      })
        .then(() => {
          console.log("puntuacion guardada")
        })
        .catch((error) => {
          console.error("Error al guardar en la base de datos:", error);
          
        });

    }
  }

   //Importar fonts
   const [fontsLoaded] = useFonts({
    'pixel': require('../assets/fonts/pixel.ttf'),
  });

  if(!fontsLoaded){
    return null;
  }

  return (
    <ImageBackground
      source={map}
      style={styles.container}
    >
      <View style={styles.textocontain}>
        <Text style={styles.texto}>Score: <Text style={{color:'black'}}>{score}</Text> </Text>
        <Text style={styles.texto}>Tiempo: <Text style={{color:'black'}}>{time}</Text> </Text>
        
        {!isPaused && (
          <Pressable style={styles.btnpause} onPress={() => (setisPaused(!isPaused),pauseBackgroundMusic())}>
          <Icon name='pause' type="material" color={'#F1C40F'}/>
        </Pressable>
        )}
         {isPaused && (
          <Pressable style={styles.btnplay} onPress={() => (setisPaused(!isPaused),playBackgroundMusic())}>
          <Icon name="play-arrow" type="material" color={'#27AE60'}/>
        </Pressable>
        )}
        <Pressable style={styles.btnupsalir} onPress={() => (navigation.navigate('Bienvenido'))}>
        <Icon name='stop' type="material" color={'#E74C3C'}/>
        </Pressable>
       
      </View>
      <View style={styles.gamewindow} onLayout={onLayout}>
        {objects.map((obj) => (
         
          <Pressable
            key={obj.id}
            style={[styles.element, { top: obj.y, left: obj.x }]}
            onPressOut={() => eliminacionObjectInsect(obj.id)}
            onPressIn={()=>(aplastadoInsect(obj.id),playSound())}
          >
            <Image source={obj.img} style={styles.insectimg}  />
            
          </Pressable>
        ))}
        {gameOver && (
          <Modal animationType="slide" transparent={true}>
            <View style={styles.centeredView}>
              <ImageBackground source={require('../assets/image/modal-gameover6.jpg')} style={styles.modalView}>
                <Text style={styles.gameovertxt}>Game Over!</Text>
                <Text style={styles.puntuaciontxt}>Tu puntuacion es: {score}</Text>
                <View style={styles.containbtn}>
                    
                    <Pressable style={styles.btnreinicio} onPress={() => (RestartGame())}>
                        <Text style={styles.textbtn}>Reiniciar</Text>
                    </Pressable>
                    <Pressable style={styles.btnsalir} onPress={() => (navigation.navigate('Bienvenido'))} >
                        <Text style={styles.textbtn}>Salir</Text>
                    </Pressable> 
                    
                </View>
                
              </ImageBackground>
            </View>
          </Modal>
        )}
        {isPaused &&(
           
           <View style={styles.pausedmodal}>
             <View style={styles.pausedView}>
               <Text style={styles.txtpausa}>Pause!</Text>
             </View>
           </View>
         
        )}
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
  },
  textocontain: {
    top:50,
    width: "100%",
    height: 50,
    backgroundColor: "#7FB3D5",
    flexDirection: "row",
    justifyContent:"space-evenly",
    alignItems:"center"
    /*paddingHorizontal: 40,*/
    //#B2BEB5
  },
  btnupsalir:{
    width:35,
    height:35,
    backgroundColor:'#34495E',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:50,
    borderWidth:3,
    borderColor:'#E74C3C'
    //#B03A2E
  },
  btnpause:{
    width:35,
    height:35,
    backgroundColor:'#34495E',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:50,
    borderWidth:3,
    borderColor:'#F1C40F'
    //#B7950B


  },
  btnplay:{
    width:35,
    height:35,
    backgroundColor:'#34495E',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:50,
    borderWidth:3,
    borderColor:'#27AE60'
    //#1E8449
  },

  texto: {
    /*textAlign: "center",*/
    /*marginHorizontal: 20,*/
    fontSize: 20,
    color: "#E52B50",
    fontWeight: "bold",
  },
  insectimg: {
    width: 70,
    height: 70,
    resizeMode: "cover",
  },
  gamewindow: {
    top:50,
    width: "100%",
    height: "100%",
  },
  element: {
    width: 50,
    height: 50,
    position: "absolute",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    height:250,
    width:250,
    overflow:'hidden',
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    
  },
  gameovertxt:{
    color:'#F7A708',
    marginVertical:10,
    fontSize:25,
    fontFamily:'pixel',
    textShadowColor: 'rgba(0, 0, 0, 0.75)',
    textShadowOffset: { width: -2, height: 2 },
    textShadowRadius: 12
  },
  puntuaciontxt:{
    color:'#BA4A00',
    marginVertical:10,
    fontSize:20,
    fontWeight:'bold',
    textShadowColor: '#7F8C8D',
    textShadowOffset: { width: -0.5, height: 1 },
    textShadowRadius: 8
  },
  containbtn:{

    alignItems:'center'

  },
  btnreinicio:{
    width:100,
    height:50,
    backgroundColor:'#3498DB',
    marginVertical:5,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10,
    borderRightWidth: 1,
    borderLeftWidth:1,
    borderBottomWidth: 5,
    shadowOffset:{ width: 1, height: 13 },
    shadowColor:'black',
    shadowRadius:15,
    shadowOpacity: 1,
    elevation: 10
  },
  btnsalir:{
    width:100,
    height:50,
    backgroundColor:'red',
    marginVertical:5,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10,
    borderRightWidth: 1,
    borderLeftWidth:1,
    borderBottomWidth: 5,
    shadowOffset:{ width: 1, height: 13 },
    shadowColor:'black',
    shadowRadius:15,
    shadowOpacity: 1,
    elevation: 10
  },
  textbtn:{
    color:'white',
    fontWeight:'bold',
    fontSize:15
  },
  pausedmodal: {
    width:'100%',
    height:'100%',
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
  },
  pausedView: {
    height:'100%',
    width:'100%',
    backgroundColor: "",
    alignItems: "center",
    /*justifyContent: "center",*/
  },
  txtpausa:{
    marginTop:320,
    fontSize:30,
    color:'#0064d3',
    fontFamily:'pixel'
  }

});
