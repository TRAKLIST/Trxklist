import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TextInput,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Entypo from "react-native-vector-icons/Entypo";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";

export default function Categories({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#292929" }}>
      <View style={{ flex: 6 }}>
        <View style={{ flex: 1, margin: 10, flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "grey",
              margin: 10,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
            onPress={() => navigation.navigate("LYRICS.")}
          >
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: 30,
                  fontWeight: "bold",
                  textTransform: "uppercase",
                  color: "#292929",
                }}
              >
                Lyrics
              </Text>
            </View>

            <View
              style={{
                justifyContent: "flex-start",
                flex: 3,
              }}
            >
              <Entypo name="text-document" size={130} color="#292929" />
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, margin: 10, flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "grey",
              margin: 10,
              borderRadius: 15,
            }}
            // onPress={() => navigation.navigate("ARTISTS.")}
            onPress={() => alert('Artist Info Coming Soon : Sit Tight')}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "grey",
                margin: 10,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    color: '#292929'
                  }}
                >
                  Artists
                </Text>
              </View>

              <View
                style={{
                  justifyContent: "flex-start",
                  flex: 3,
                }}
              >
                <MaterialIcons name="face" size={130} color="#292929" />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "grey",
              margin: 10,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
            }}
            // onPress={() => navigation.navigate("ALBUMS.")}
            onPress={() => alert('Album Info Coming Soon : Sit Tight')}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "grey",
                margin: 10,
                borderRadius: 15,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    color: '#292929'
                  }}
                >
                  Albums
                </Text>
              </View>

              <View
                style={{
                  justifyContent: "flex-start",
                  flex: 3,
                }}
              >
                <MaterialCommunityIcons
                  name="album"
                  size={130}
                  color="#292929"
                />
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, margin: 10, flexDirection: "row" }}>
          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "grey",
              margin: 10,
              borderRadius: 15,
            }}
            onPress={() => alert('Latest News Coming Soon : Sit Tight')}

          >
            <View
              style={{
                flex: 1,
                backgroundColor: "grey",
                margin: 10,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    color: '#292929'
                  }}
                >
                  Latest
                </Text>
              </View>

              <View
                style={{
                  justifyContent: "flex-start",
                  flex: 3,
                }}
              >
                <Entypo name="news" size={130} color="#292929" />
              </View>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "grey",
              margin: 10,
              borderRadius: 15,
            }}
            onPress={() => navigation.navigate("USERS.")}
          >
            <View
              style={{
                flex: 1,
                backgroundColor: "grey",
                margin: 10,
                borderRadius: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text
                  style={{
                    fontSize: 25,
                    fontWeight: "bold",
                    textTransform: "uppercase",
                    color: '#292929'
                  }}
                >
                  Users
                </Text>
              </View>

              <View
                style={{
                  justifyContent: "flex-start",
                  flex: 3,
                }}
              >
                <SimpleLineIcons name="people" size={130} color="#292929" />
              </View>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 10,
  },
});
