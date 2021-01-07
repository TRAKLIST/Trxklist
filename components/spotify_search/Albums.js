import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ImageBackground,
  Image,
  Modal,
  Button,
  RefreshControl,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import ADIcon from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import Icon from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import Fontisto from "react-native-vector-icons/Fontisto";

export default function Albums(props) {
  return (
    <View>
      <TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            margin: 5,
            width: "100%",
            borderBottomWidth: 1,
            padding: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <ImageBackground
              source={{ uri: props.album.image }}
              style={{
                height: 65,
                width: 65,
              }}
              imageStyle={{
                borderRadius: 30,
              }}
            >
              <View
                style={{
                  bottom: 0,
                  position: "absolute",
                  backgroundColor: "#44CF6C",
                  borderRadius: 60,
                  borderWidth: 0,
                  // borderColor: "#44CF6C",
                  height: 30,
                  width: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: 0.8,
                }}
              >
                <Fontisto
                  name="spotify"
                  color="#fff"
                  size={11}
                  style={{ padding: 2 }}
                />
              </View>
            </ImageBackground>
          </View>
          <View
            style={{
              justifyContent: "center",
              padding: 10,
              marginBottom: 3,
              flex: 2,
            }}
          >
            <Text
              numberOfLines={1}
              style={{ color: "#fff", fontWeight: "bold" }}
            >
              {props.album.title}
            </Text>
            <Text
              numberOfLines={1}
              style={{ color: "#44CF6C", fontWeight: "bold" }}
            >
              {props.album.artist}
            </Text>
          </View>
          {/* <View style={{ flex: 0.5, flexDirection: "row" }}>

            <TouchableOpacity style={{ justifyContent: "center", margin: 5 }}>
              <View style={styles.iconContainer2}>
                <MaterialCommunityIcons
                  name="content-save-outline"
                  size={27}
                  color={"#44CF6C"}
                />
              </View>
            </TouchableOpacity>
          </View> */}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "#EAEAEB",
    },
    header: {
      justifyContent: "flex-end",
      paddingHorizontal: 10,
      paddingBottom: 25,
      paddingTop: 50,
    },
    footer: {
      flex: 3,
      backgroundColor: "transparent",
      paddingHorizontal: 5,
      // borderRadius: 20
      // paddingVertical: 30,
    },
    text_header: {
      color: "#fff",
      fontWeight: "bold",
      fontSize: 30,
    },
    text_footer: {
      color: "#05375a",
      fontSize: 18,
    },
    action: {
      backgroundColor: "#fff",
      flexDirection: "row",
      marginTop: 10,
      borderBottomWidth: 2,
      borderBottomColor: "#fff",
      padding: 5,
      borderRadius: 15,
    },
    actionError: {
      flexDirection: "row",
      marginTop: 10,
      borderBottomWidth: 1,
      borderBottomColor: "#FF0000",
      paddingBottom: 5,
    },
    textInput: {
      flex: 5,
      marginTop: Platform.OS === "ios" ? 0 : -12,
      padding: 10,
      color: "#fff",
      borderRadius: 10,
      fontWeight: "bold",
    },
    errorMsg: {
      color: "#FF0000",
      fontSize: 14,
    },
    button: {
      alignItems: "center",
      marginTop: 50,
    },
    signIn: {
      width: "100%",
      height: 50,
      justifyContent: "center",
      alignItems: "center",
      borderRadius: 10,
    },
    textSign: {
      fontSize: 18,
      fontWeight: "bold",
    },
    logo: {
      width: "100%",
      height: "100%",
      // backgroundColor: "whitesmoke",
      borderRadius: 20,
    },
    iconContainer2: {
      flexDirection: "row",
      alignItems: "center",
      padding: 2,
    },
  });
  