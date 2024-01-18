import { Image, ImageBackground, Modal, Pressable } from "react-native";
import React, { useEffect, useState } from "react";
import {
  getDatabase,
  onValue,
  ref,
  remove,
  set,
  update,
} from "firebase/database";
import {
  Alert,
  Button,
  FlatList,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
//FIREBASE
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { auth, db } from "../config/Config";

export default function PerfilScreen( {navigation}:any ) {
  const [datos, setDatos] = useState<any>({
    name:"",
    lastName:"",
    nick:"",
    age:"",
    email:""
    });
  const [email, setemail] = useState("");
  const [userimg, setuserimg] = useState("https://img.freepik.com/free-vector/businessman-character-avatar-isolated_24877-60111.jpg");
  const [nick, setnick] = useState("")
  

  type usuario = {
    name: string;
    lastName: string;
    nick: string;
    age: string;
    email: string;
  };
  // onAuthStateChanged(auth, (user) => {
  //   if (user) {
  //     // User is signed in, see docs for a list of available properties
  //     // https://firebase.google.com/docs/reference/js/auth.user
  //     const displayName:any = user.displayName
  //     console.log(displayName)
  //     setnick(displayName)
  //     // ...
  //   } else {
  //     // User is signed out
  //     // ...
  //   }
  // });

  useEffect(() => {
    
    usuarioActual();

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        const displayName:any = user.displayName;
        //console.log("Este es el nick: ", displayName);
        setnick(displayName);
  
        const starCountRef = ref(db, 'usuarios/' + nick);
        onValue(starCountRef, (snapshot) => {
          const data = snapshot.val();
          setDatos(data);
          //console.log("Datos del usuario:", data);
        });
      } else {
       
        // User is signed out
        console.log("Usuario desconectado");
        
      }
    });
  
    return () => {
      // Desuscribe la función cuando el componente se desmonta
      unsubscribe();
    };



  //   // LEER LOS DATOS
  //   function leer(){
  //     const starCountRef = ref(db, 'usuarios/' +nick);  //postID la clave para leer un elemento en especifico
  //     onValue(starCountRef, (snapshot) => {
  //     const data = snapshot.val();
  //     setDatos(data)
  //     console.log(datos)
  // });
    
  //    }

    //leer();
  }, [datos]);

  function usuarioActual() {
    const user = auth.currentUser;
    if (user !== null) {
      
      // The user object has basic properties such as display name, email, etc.
      const email: any = user.email;
      const photoURL: any = user.photoURL;
      //setemail(email);
      setuserimg(photoURL);
      //console.log(email);
      //console.log(userimg);
    }
   
  }

  function cerrarSesion() {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        // Sign-out successful.
        Alert.alert("Mensaje","Se cerro la sesion")
        navigation.navigate('Welcome')

      })
      .catch((error) => {
        // An error happened.
        Alert.alert(error.code,error.message)
      });
  }

  return (
    <ImageBackground
      source={require("../assets/image/fondo-perfil.jpg")}
      style={styles.container}
    >
      <Text style={styles.titulo}>Bienvenido a tu perfil</Text>
      <View style={styles.circleContainer}>
        <Image source={{ uri: userimg }} style={styles.profileImage} />
      </View>
      <Text>Nick: {nick}</Text>
      <Text>Nombre: {datos.name}</Text>
      <Text>Apellido: {datos.lastName}</Text>
      <Text>Edad: {datos.age}</Text>
      <Text>correo: {datos.email}</Text>
      <Pressable style={styles.btnsalir} onPress={()=>cerrarSesion()}>
        <Text style={styles.textbtn}>Cerrar Sesion</Text>
      </Pressable>
     
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    resizeMode: "cover",
    alignItems: "center",
  },
  titulo: {
    marginTop: 65,
    fontSize: 30,
    fontWeight: "bold",
    color: "#C41E3A",
    textAlign: "center",
    marginBottom: 80,
  },
  circleContainer: {
    width: 100,
    height: 100,
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
  btnsalir: {
    width: 120,
    height: 50,
    backgroundColor: "red",
    marginTop: 60,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  textbtn: {
    color: "white",
    fontWeight: "bold",
    fontSize: 15,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalView: {
    height:500,
    width:300,
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
    //justifyContent:'center'
  },
  gameovertxt:{
    color:'red',
    marginVertical:10,
    fontSize:25,
    fontWeight:'bold'
  },
  puntuaciontxt:{
    color:'blue',
    marginVertical:10,
    fontSize:20,
    fontWeight:'bold'
  },
  containbtn:{

    alignItems:'center'

  },
  btnreinicio:{
    width:100,
    height:50,
    backgroundColor:'blue',
    marginVertical:5,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10
  },
  btnlog:{
    width:100,
    height:50,
    backgroundColor:'red',
    marginVertical:5,
    alignItems:'center',
    justifyContent:'center',
    borderRadius:10
  },
  textbtnlog:{
    color:'white',
    fontWeight:'bold',
    fontSize:15
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
}
  
});
