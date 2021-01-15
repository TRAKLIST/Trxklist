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
    <View style={{ flex: 1, backgroundColor: "#292929" }}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 5, justifyContent: "center", padding: 5 }}>
          <TextInput
            placeholder="Search for stuff"
            autoCapitalize="none"
            style={{
              justifyContent: "center",
              backgroundColor: "#000",
              borderRadius: 30,
              borderColor: "#fff",
              borderWidth: 0,
              textAlign: "center",
              // fontSize: 20,
              opacity: 0.4,
              color: "grey",
              fontWeight: "bold",
              height: 50,
            }}
            // onChangeText={(val) => setSearchTerm(val)}
          />
        </View>
      </View>

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
          >
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  textTransform: "uppercase",
                }}
              >
                Tracks
              </Text>
            </View>

            <View
              style={{
                justifyContent: "flex-start",
                flex: 3,
              }}
            >
              <MaterialIcons name="audiotrack" size={90} color="#292929" />
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={{
              flex: 1,
              backgroundColor: "grey",
              margin: 10,
              borderRadius: 15,
            }}
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
                    fontSize: 20,
                    fontWeight: "500",
                    textTransform: "uppercase",
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
                <Entypo name="text-document" size={80} color="#292929" />
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
                    fontSize: 20,
                    fontWeight: "500",
                    textTransform: "uppercase",
                  }}
                >
                  Artist
                </Text>
              </View>

              <View
                style={{
                  justifyContent: "flex-start",
                  flex: 3,
                }}
              >
                <MaterialIcons name="face" size={80} color="#292929" />
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
                    fontSize: 20,
                    fontWeight: "500",
                    textTransform: "uppercase",
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
                  size={80}
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
                    fontSize: 20,
                    fontWeight: "500",
                    textTransform: "uppercase",
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
                <Entypo name="news" size={80} color="#292929" />
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => navigation.navigate("Search")}
            style={{
              flex: 1,
              backgroundColor: "grey",
              margin: 10,
              borderRadius: 15,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <View style={{ flex: 1, justifyContent: "center" }}>
              <Text
                style={{
                  fontSize: 20,
                  fontWeight: "500",
                  textTransform: "uppercase",
                }}
              >
                People
              </Text>
            </View>

            <View
              style={{
                justifyContent: "flex-start",
                flex: 3,
              }}
            >
              <SimpleLineIcons name="people" size={80} color="#292929" />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  box: {
    borderRadius: 10,
  },
});
