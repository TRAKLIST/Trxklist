import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Keyboard,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import axios from "axios";
import spotifyAPI from "../components/SpotifyAPI";
import ADIcon from "react-native-vector-icons/AntDesign";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import Icon from "react-native-vector-icons/Entypo";
import User from "../components/User";
import Track from "../components/spotify_search/Tracks";
import Albums from "../components/spotify_search/Albums";
import Artists from "../components/spotify_search/Artists";
import SoundCloudTracks from "../components/soundcloud_search/Tracks";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
let list;
let array = [];
let array1 = [];
let array2 = [];
let soundcloud_tracks = [];
let isFollowing = false;

function Tracks() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [index, setIndex] = React.useState(1);
  // Spotify

  const search = () => {
    axios
      .get(
        `https://api-v2.soundcloud.com/search/tracks?q=${searchTerm}&client_id=NpVHurnc1OKS80l6zlXrEVN4VEXrbZG4&limit=20`
      )
      .then((res) => {
        // console.log(res.data, 'fg')
        soundcloud_tracks = [];
        res.data.collection.map((track) => {
          let trackQuery = {
            urn: track.urn,
            title: track.title,
            user_or_artist: track.user.username,
            verified: track.user.verified,
            image: track.artwork_url,
            // releaseDate: track.album.release_date,
          };
          soundcloud_tracks.push(trackQuery);
        });
        // console.log(soundcloud_tracks, "yf");
      });

    spotifyAPI.searchTracks(searchTerm).then((data) => {
      array = [];
      console.log(data, "vijwbcu");
      data.tracks.items.map((item) => {
        axios
          .get(
            `https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_isrc=${item.external_ids.isrc}&apikey=7a375fb4e8e03a7c2f911057ebeb14d9`
          )
          .then((res) => {
            return JSON.parse(res.data.substring(9, res.data.length - 2))
              .message.body.lyrics.lyrics_body;
          })
          .then((res) => {
            let trackQuery = {
              id: item.id,
              title: item.name,
              artist: item.artists[0].name,
              artistID: item.artists[0].id,
              albumName: item.album.name,
              image: item.album.images[0].url,
              releaseDate: item.album.release_date,
              popularity: item.popularity,
              duration: item.duration_ms,
              isrc: item.external_ids.isrc,
              lyrics: res,
            };
            array.push(trackQuery);
          });

        // console.log(trackQuery)
      });
      // console.log(array);
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ backgroundColor: "#292929", flex: 1, padding: 10 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              padding: 0,
              backgroundColor: "transparent",
            }}
          >
            {/* search bar */}
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
                onChangeText={(val) => setSearchTerm(val)}
              />
            </View>
            <View style={{ flex: 1, justifyContent: "center", padding: 5 }}>
              <TouchableOpacity onPress={search}>
                <View
                  style={{
                    backgroundColor: "#000",
                    opacity: 0.4,
                    borderRadius: 30,
                    height: 50,
                    justifyContent: "center",
                    borderColor: "#fff",
                    borderWidth: 0,
                  }}
                >
                  <ADIcon
                    name="search1"
                    size={25}
                    style={{
                      color: "#292929",
                      alignSelf: "center",
                    }}
                  />
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <View
            style={{
              flex: 1,
              justifyContent: "center",
              backgroundColor: "transparent",
            }}
          >
            <View
              style={{
                height: 50,
                borderRadius: 10,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: index == 1 ? "#fff" : "#292929",
                  borderWidth: 0,
                  borderColor: index == 1 ? "#292929" : "#fff",
                  borderRadius: 10,
                  margin: 5,
                }}
                onPress={() => setIndex(1)}
              >
                <View>
                  <Text
                    style={{
                      color: index == 1 ? "#292929" : "#fff",
                      opacity: 0.4,
                    }}
                  >
                    <FontAwesome5
                      name="spotify"
                      size={20}
                      color={index == 1 ? "#292929" : "#fff"}
                    />
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "transparent",
                  borderRadius: 10,
                  margin: 5,
                  borderWidth: 0,
                  borderColor: index == 1 ? "#292929" : "#fff",
                  backgroundColor: index == 2 ? "#fff" : "#292929", //
                }}
                onPress={() => setIndex(2)}
              >
                <View>
                  <Text
                    style={{
                      color: index == 2 ? "#292929" : "#fff",
                      opacity: 0.4,
                    }}
                  >
                    <FontAwesome5
                      name="soundcloud"
                      size={20}
                      color={index == 2 ? "#292929" : "#fff"}
                    />
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>

          <KeyboardAvoidingView
            behavior="padding"
            style={{
              flex: 7,
              backgroundColor: "transparent",
              justifyContent: "flex-start",
            }}
          >
            <ScrollView style={{ padding: 0, backgroundColor: "transparent" }}>
              <LinearGradient
                colors={["#292929", "#292929"]}
                style={{
                  borderRadius: 20,
                  opacity: 0.9,
                }}
              >
                {index == 1
                  ? array.map((track, index) => (
                      <Track track={track} index={index} />
                    ))
                  : soundcloud_tracks.map((track, index) => (
                      <SoundCloudTracks track={track} />
                    ))}
                {/* {index == 1 &&
                  array.map((track, index) => (
                    <Track track={track} index={index} />
                  ))}

                {index == 2 &&
                  soundcloud_tracks.map((track, index) => (
                    <SoundCloudTracks track={track} />
                  ))} */}
              </LinearGradient>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export default observer(Tracks);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292929",
  },
  header: {
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 5,
  },
  footer: {
    flex: 3,
    backgroundColor: "transparent",
    paddingHorizontal: 5,
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
    marginTop: 0,
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
    borderRadius: 20,
  },
  iconContainer2: {
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },
});
