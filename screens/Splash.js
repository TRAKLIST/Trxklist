import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  StatusBar,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";

const SplashScreen = ({ navigation }) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View
          style={{
            margin: 0,
            backgroundColor: "#292929",
            flex: 1,
            borderBottomRightRadius: 80,
            justifyContent : 'center',
            alignItems : 'center'
          }}
        >
          <Animatable.Image
            animation="bounceIn"
            // duration="1500"
            style={styles.logo}
            resizeMode="contain"
            // source={img}
          />
        </View>
      </View>
      <View style={styles.footer}>
        <View
          style={{
            margin: 0,
            backgroundColor: "grey",
            flex: 1,
            borderTopLeftRadius: 80,
          }}
        >
          <Animatable.View animation="fadeInUpBig" style={{ flex: 1 }}>
            <View style={{ alignItems: "center", marginTop: 50 }}>
              <Text style={styles.title}>TRAKLIST.</Text>
              <Text style={styles.text}>stay in the loop • find new music</Text>
            </View>

            <View
              style={{
                marginTop: 60,
                flexDirection: "column",
                alignSelf: "center",
              }}
            >
              <View style={[styles.button]}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("SignUpScreen")}
                >
                  <LinearGradient
                    colors={["#292929", "#292929"]}
                    style={styles.signIn}
                  >
                    <Text style={styles.textSign}>get started</Text>
                    {/* <MaterialIcons name="navigate-next" color="#000" size={20} /> */}
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={{ alignSelf: "center" }}>
                <TouchableOpacity
                  onPress={() => navigation.navigate("SignInScreen")}
                >
                  <LinearGradient
                    colors={["black", "black"]}
                    style={[styles.signIn, { marginTop: 10, opacity: 0.4 }]}
                  >
                    <Text
                      style={{
                        color: "#ADADAD",
                        fontSize: 17,
                        fontWeight: "600",
                      }}
                    >
                      sign back in
                    </Text>
                    <MaterialIcons
                      name="navigate-next"
                      color="#fff"
                      size={20}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
            </View>

            <SafeAreaView style={styles.bottom}>
              {/* <Text>Carousel</Text> */}
            </SafeAreaView>
          </Animatable.View>
        </View>
      </View>
    </View>
  );
};

export default SplashScreen;

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 8,
    backgroundColor: "grey",
  },
  footer: {
    flex: 9,
    backgroundColor: "#292929",
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    // paddingVertical: 50,
    // paddingHorizontal: 30,
  },
  logo: {
    width: height_logo,
    height: height_logo,
    backgroundColor: "#fff",
    borderRadius: 120,
  },
  title: {
    color: "#292929",
    fontSize: 35,
    fontWeight: "bold",
  },
  text: {
    color: "#ADADAD",
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
    color: "whitesmoke",
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
