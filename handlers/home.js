import React, { Component } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  Dimensions,
  TouchableOpacity,
  ImageBackground,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import { ProgressBar } from "react-native-paper";
import * as Animatable from "react-native-animatable";
import { ProgressChart } from "react-native-chart-kit";
import { TabBar } from "react-native-tab-view";

import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

import spotifyAPI from "../components/SpotifyAPI";

exports.second_route = (card) => {
  if (card != null) {
    if (card.audioFeatures != null) {
      let {
        acousticness,
        danceability,
        energy,
        instrumentalness,
        liveness,
        speechiness,
      } = card.audioFeatures;
      return (
        <View style={[styles.scene]}>
          <LinearGradient colors={["#000", "#8D8D92", "#EAEAEB"]}>
            <View style={{ flexDirection: "row" }}>
              <View
                style={{
                  width: Dimensions.get("window").width / 2,
                  justifyContent: "center",
                  marginBottom: 30,
                }}
              >
                <ProgressChart
                  data={{
                    labels: [
                      "acousticness",
                      "danceability",
                      "energy",
                      "instrumentalness",
                      "liveness",
                      "speechiness",
                    ],
                    data: [
                      acousticness,
                      danceability,
                      energy,
                      instrumentalness,
                      liveness,
                      speechiness,
                    ],
                  }}
                  width={Dimensions.get("window").width / 2}
                  height={Dimensions.get("window").width / 2}
                  strokeWidth={5}
                  radius={10}
                  chartConfig={{
                    backgroundGradientFrom: "transparent",
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientTo: "transparent",
                    backgroundGradientToOpacity: 0,
                    color: (opacity = 0.5) => `rgba(29, 185, 84, ${opacity})`,
                    strokeWidth: 2,
                    barPercentage: 0.5,
                    useShadowColorFromDataset: false,
                  }}
                  hideLegend={true}
                />
              </View>
              <View
                style={{
                  width: Dimensions.get("window").width / 2,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    top: 20,
                    position: "absolute",
                    color: "#fff",
                    alignContent: "center",
                  }}
                >
                  <Text
                    numberOfLines={1}
                    style={{ color: "#fff", textAlign: "center" }}
                  >
                    RELEASE DATE
                  </Text>
                  <Text
                    numberOfLines={1}
                    style={{ color: "grey", textAlign: "center" }}
                  >
                    {card.releaseDate}
                  </Text>
                </View>
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 15,
                    textTransform: "uppercase",
                    color: "#3A5A40",
                    fontWeight: "bold",
                  }}
                >
                  {card.artistPopularity < 5
                    ? ""
                    : card.artistPopularity < 7
                    ? ""
                    : card.artistPopularity < 10
                    ? ""
                    : card.artistPopularity < 20
                    ? ""
                    : card.artistPopularity < 35
                    ? ""
                    : card.artistPopularity < 50
                    ? "Tune"
                    : card.artistPopularity < 70
                    ? "Bop"
                    : card.artistPopularity < 90
                    ? "Hot"
                    : card.artistPopularity < 95
                    ? "Banger"
                    : "Banger"}
                </Text>
                <ProgressBar
                  progress={card.artistPopularity / 100}
                  color="#1DB954"
                  style={{ width: 100, height: 15 }}
                />
              </View>
            </View>
          </LinearGradient>
        </View>
      );
    } else return null;
  } else return null;
};

exports.first_route = (card) => {
  if (card != null) {
    // console.log(card)
    // console.log(card.topArtists_following, 't')

    return (
      <View style={[styles.scene]}>
        <LinearGradient colors={["#000", "#8D8D92", "#EAEAEB"]}>
          <View style={{ flexDirection: "row" }}>
            <Animatable.View
              // animation={"bounceIn"}
              style={{
                width: Dimensions.get("window").width / 2 - 10,
                justifyContent: "center",
              }}
            >
              <ImageBackground
                source={{ uri: card.artistImage }}
                style={{ height: "100%", width: "100%" }}
                imageStyle={{ borderTopRightRadius: 15 }}
              >
                <View
                  style={{
                    bottom: 0,
                    flexDirection: "row",
                    position: "absolute",
                    backgroundColor: "whitesmoke",
                    borderTopRightRadius: 5,
                    borderTopLefttRadius: 5,
                    width: "100%",
                    opacity: "0.8",
                    justifyContent: "center",
                  }}
                >
                  {card.topArtists_following != undefined
                    ? card.topArtists_following.map((item) => (
                        <View
                          style={{
                            alignSelf: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            source={{ uri: item.image }}
                            style={{
                              height: 30,
                              width: 30,
                              borderRadius: 10,
                              borderColor: "#fff",
                              marginTop: 5,
                              alignSelf: "center",
                              opacity: 1,
                              borderWidth: 2,
                              borderColor: "#1DB954",
                              margin: 5,
                            }}
                          />
                        </View>
                      ))
                    : null}
                </View>
              </ImageBackground>
            </Animatable.View>

            <View
              style={{
                width: Dimensions.get("window").width / 2,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View style={{ top: 20, position: "absolute", color: "#fff" }}>
                <Text
                  numberOfLines={1}
                  style={{
                    color: "#fff",
                    textAlign: "center",
                    fontWeight: "bold",
                  }}
                >
                  {card.artistName}
                </Text>
                <Text
                  numberOfLines={1}
                  style={{ color: "grey", fontWeight: "400" }}
                >{`${card.followers} followers`}</Text>
              </View>

              {/* Support an independent artist */}
              <View
                style={{
                  bottom: 0,
                  position: "relative",
                  flexDirection: "column",
                }}
              >
                <Text
                  numberOfLines={1}
                  style={{
                    fontSize: 14,
                    padding: 3,
                    textTransform: "uppercase",
                    color: "#3A5A40",
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                >
                  {card.artistPopularity < 5
                    ? "Independent"
                    : card.artistPopularity < 7
                    ? "Independent"
                    : card.artistPopularity < 10
                    ? "Independent"
                    : card.artistPopularity < 20
                    ? "Independent"
                    : card.artistPopularity < 35
                    ? "Hustler"
                    : card.artistPopularity < 50
                    ? "Next Up?"
                    : card.artistPopularity < 70
                    ? "Blown?"
                    : card.artistPopularity < 90
                    ? "Fame"
                    : card.artistPopularity < 95
                    ? "Icon"
                    : "VIP"}
                </Text>
                <ProgressBar
                  progress={card.artistPopularity / 100}
                  color="#1DB954"
                  style={{ width: 100, height: 15 }}
                />
              </View>

              <View
                style={{
                  bottom: 10,
                  position: "absolute",
                  flexDirection: "row",
                  alignSelf: "center",
                  backgroundColor: "whitesmoke",
                  opacity: 0.8,
                  borderRadius: 15,
                }}
              >
                <View style={{ alignSelf: "center", margin: 5 }}>
                  <TouchableOpacity style={{ marginRight: 0, marginBottom: 0 }}>
                    <LinearGradient
                      colors={["#000", "#21295c"]}
                      style={styles.signIn}
                    >
                      <Entypo
                        name="spotify"
                        size={20}
                        style={{
                          color: "#1DB954",
                          padding: 4,
                          alignSelf: "center",
                        }}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <View style={{ alignSelf: "center", margin: 5 }}>
                  <TouchableOpacity style={{ marginRight: 0 }}>
                    <LinearGradient
                      colors={["#000", "#21295c"]}
                      style={styles.signIn}
                    >
                      <Entypo
                        name="soundcloud"
                        size={20}
                        style={{
                          color: "#1DB954",
                          padding: 4,
                          alignSelf: "center",
                        }}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <View style={{ alignSelf: "center", margin: 5 }}>
                  <TouchableOpacity style={{ marginRight: 0 }}>
                    <LinearGradient
                      colors={["#000", "#21295c"]}
                      style={styles.signIn}
                    >
                      <MaterialCommunityIcons
                        name="instagram"
                        size={20}
                        style={{
                          color: "#1DB954",
                          padding: 4,
                          alignSelf: "center",
                        }}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>

                <View style={{ alignSelf: "center", margin: 5 }}>
                  <TouchableOpacity style={{ marginRight: 0 }}>
                    <LinearGradient
                      colors={["#000", "#21295c"]}
                      style={styles.signIn}
                    >
                      <MaterialCommunityIcons
                        name="twitter"
                        size={20}
                        style={{
                          color: "#1DB954",
                          padding: 4,
                          alignSelf: "center",
                        }}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>
      </View>
    );
  } else return null;
};

exports.render_tab_bar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: "#1DB954" }}
    style={{ backgroundColor: "black" }}
    renderLabel={({ route, focused, color }) => (
      <Text style={{ color, margin: 8, fontWeight: "bold" }}>
        {route.title}
      </Text>
    )}
    activeColor="green"
  />
);

exports.save_track = (id) => {
  spotifyAPI
    .addToMySavedTracks([id])
    .then((response) => {
      // console.log(response);
    })
    .catch((err) => {
      console.log(err);
    });
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A7A2A9",
  },
  card: {
    flex: 0.61,
    borderRadius: 20,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 2.5,
    borderBottomColor: "#1DB954",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginTop: 20,
    marginLeft: -10,
    marginRight: -10,
  },
  song: {
    fontSize: 18,
    backgroundColor: "transparent",
    color: "#EEEEFF",
  },
  text: {
    textAlign: "center",
    fontSize: 15,
    color: "#EEEEFF",
  },
  artist: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 3,
    color: "#1DB954",
    fontWeight: "300",
  },
  scene: {
    flex: 1,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  header: {
    flex: 3,
    justifyContent: "center",
    paddingBottom: 20,
    paddingTop: 50,
  },
  footer: {
    flex: 1.5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 10,
  },
  signIn: {
    padding: 0,
    alignContent: "center",
    borderRadius: 10,
  },
});
