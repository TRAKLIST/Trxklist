import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Button,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";
import img from "../images/djwho.png";

const SplashScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#007bff" barStyle="light-content" />
      {/* <View style={styles.header}> */}
      <LinearGradient colors={['#EAEAEB', "#000",]} style={styles.header}>
        <Animatable.Image
          animation="bounceIn"
          // duration="1500"
          style={styles.logo}
          resizeMode="contain"
          source={img}
        />
        {/* <MaterialIcons name="multitrack-audio" color="#fff" size={60} /> */}
      </LinearGradient>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <Text style={styles.title}>Welcome to Traklist.</Text>
        <Text style={styles.text}>Stay in the loop • Find new music</Text>
        <View style={styles.button}>
          <TouchableOpacity onPress={() => navigation.navigate("SignInScreen")}>
            <LinearGradient
              colors={["#137C38","#137C38"]}
              style={styles.signIn}
            >
              <Text style={styles.textSign}>Get Started</Text>
              <MaterialIcons name="navigate-next" color="#fff" size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
        <SafeAreaView style={styles.bottom}>
          {/* <Text>Carousel</Text> */}
        </SafeAreaView>
      </Animatable.View>
    </View>
  );
};

export default SplashScreen;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007bff",
  },
  header: {
    flex: 2,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 1,
    backgroundColor: "#000",
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    paddingVertical: 50,
    paddingHorizontal: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo,
    backgroundColor: "whitesmoke",
    borderRadius: 120,
  },
  title: {
    color: "#516758",
    fontSize: 30,
    fontWeight: "bold",
  },
  text: {
    color: "grey",
    marginTop: 5,
    fontSize: 20,
    fontWeight : 'bold'
  },
  button: {
    alignItems: "flex-end",
    marginTop: 50,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 20,
    flexDirection: "row",
  },
  textSign: {
    color: "white",
    fontWeight: "bold",
  },
  bottom: {
    position: "absolute",
    bottom: 0,
  },
});
