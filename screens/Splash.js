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
      <LinearGradient colors={["#EAEAEB", "#000"]} style={styles.header}>
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
        <View style={{ alignItems: "center" }}>
          <Text style={styles.title}>TRAKLIST.</Text>
          <Text style={styles.text}>stay in the loop • find new music</Text>
        </View>

        <View style={{ flexDirection: "column", bottom :80, position : 'absolute', alignSelf : 'center' }}>
          <View style={[styles.button]}>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignInScreen")}
            >
              <LinearGradient colors={["green", "green"]} style={styles.signIn}>
                <Text style={styles.textSign}>get started</Text>
                {/* <MaterialIcons name="navigate-next" color="#000" size={20} /> */}
              </LinearGradient>
            </TouchableOpacity>
          </View>
          <View style={{ alignSelf: "center" }}>
            <TouchableOpacity
              onPress={() => navigation.navigate("SignUpScreen")}
            >
              <LinearGradient colors={["black", "black"]} style={styles.signIn}>
                <Text style={{ color: "#fff", fontSize: "16" }}>
                  sign back in
                </Text>
                <MaterialIcons name="navigate-next" color="#fff" size={20} />
              </LinearGradient>
            </TouchableOpacity>
          </View>
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
    flex: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  footer: {
    flex: 8,
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
    color: "green",
    fontSize: 35,
    fontWeight: "bold",
  },
  text: {
    color: "#516758",
    marginTop: 5,
    fontSize: 20,
    fontWeight: "600",
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: 150,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    flexDirection: "row",
  },
  textSign: {
    color: "black",
    fontWeight: "bold",
    fontSize: 18,
    alignItems: "center",
    textAlign: "center",
  },
  bottom: {
    position: "absolute",
    bottom: 0,
  },
});
