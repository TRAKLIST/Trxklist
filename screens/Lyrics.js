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
import EvilIcons from "react-native-vector-icons/EvilIcons";
let list;
let array = [];
let array1 = [];
let array2 = [];
let soundcloud_tracks = [];
let isFollowing = false;

function Tracks() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [index, setIndex] = React.useState(0);
  // Spotify

  const search = () => {
    setIndex(0);
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
  if (!UserStore.lyricsToggle) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ flexDirection: "column" }}>
            <View
              style={{
                margin: 20,
                borderBottomWidth: 2,
                padding: 10,
                borderColor: "grey",
              }}
            >
              <Text
                style={{
                  fontSize: 30,
                  textAlign: "center",
                  color: "grey",
                  fontWeight: "600",
                  borderRadius: 10,
                  overflow: "hidden",
                }}
              >
                What We Singing Along to Today?
              </Text>
            </View>
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 4, margin: 5 }}>
                <TextInput
                  placeholder="Search for stuff"
                  autoCapitalize="none"
                  style={{
                    justifyContent: "center",
                    backgroundColor: "#000",
                    borderRadius: 5,
                    borderColor: "#fff",
                    borderWidth: 0,
                    textAlign: "center",
                    fontSize: 20,
                    opacity: 0.4,
                    color: "#fff",
                    fontWeight: "bold",
                    height: 50,
                  }}
                  onChangeText={(val) => setSearchTerm(val)}
                />
              </View>

              <View style={{ flex: 1, margin: 5 }}>
                <TouchableOpacity onPress={search}>
                  <View
                    style={{
                      backgroundColor: "#000",
                      opacity: 0.4,
                      borderRadius: 5,
                      height: 50,
                      justifyContent: "center",
                      borderColor: "#fff",
                      borderWidth: 0,
                    }}
                  >
                    <EvilIcons
                      name="search"
                      size={40}
                      style={{
                        color: "#fff",
                        alignSelf: "center",
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ flexDirection: "row", margin: 15 }}>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: index == 0 ? "#fff" : "#292929",
                  borderWidth: 0,
                  borderColor: index == 0 ? "#292929" : "#fff",
                  borderRadius: 5,
                  margin: 5,
                }}
                onPress={() => setIndex(0)}
              >
                <View>
                  <Text
                    style={{
                      color: index == 0 ? "#292929" : "#fff",
                      opacity: index != 0 ? 0.4 : 1,
                      fontWeight: "bold",
                    }}
                  >
                    SELECT
                  </Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: index == 1 ? "#fff" : "#292929",
                  borderWidth: 0,
                  borderColor: index == 1 ? "#292929" : "#fff",
                  borderRadius: 5,
                  margin: 5,
                }}
                onPress={() => setIndex(1)}
              >
                <View>
                  <Text
                    style={{
                      color: index == 1 ? "#292929" : "#fff",
                      opacity: index == 0 ? 0.4 : 1,
                    }}
                  >
                    <FontAwesome5
                      name="spotify"
                      size={20}
                      color={index == 1 ? "#1DB954" : "#fff"}
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
                  borderRadius: 5,
                  margin: 5,
                  borderWidth: 0,
                  borderColor: index == 1 ? "#292929" : "#fff",
                  backgroundColor: index == 2 ? "#fff" : "#292929", //
                }}
                onPress={() => setIndex(2)}
              >
                <View style={{ padding: 10 }}>
                  <Text
                    style={{
                      color: index == 2 ? "#292929" : "#fff",
                      opacity: index == 0 ? 0.4 : 1,
                    }}
                  >
                    <FontAwesome5
                      name="soundcloud"
                      size={20}
                      color={index == 2 ? "#FE5000" : "#fff"}
                    />
                  </Text>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "column",
                backgroundColor: "grey",
                height: 430,
                borderRadius: 10,
                opacity: 0.7
              }}
            >
              <ScrollView>
                <View>
                  {index == 1 ? (
                    array.map((track, index) => (
                      <Track track={track} index={index} />
                    ))
                  ) : index == 2 ? (
                    soundcloud_tracks.map((track, index) => (
                      <SoundCloudTracks track={track} />
                    ))
                  ) : (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      {/* <Text
                        style={{
                          fontSize: 30,
                          textAlign: "center",
                          color: "black",
                        }}
                      >
                        {" "}
                        Some nice Splash Page telling users to choose spotify or
                        soundcloud?
                      </Text> */}
                    </View>
                  )}
                </View>
              </ScrollView>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
    );
  } else {
    return (
      <View style={{ flex: 1, backgroundColor: "#292929" }}>
        <ParallaxScrollView
          backgroundColor="#292929"
          contentBackgroundColor="#292929"
          parallaxHeaderHeight={300}
          renderForeground={() => (
            <ImageBackground
              source={{ uri: array[UserStore.trackIndex].image }}
              style={{
                height: 300,
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
              imageStyle={{
                borderRadius: 15,
                paddingHorizontal: 10,
              }}
            >
              <SafeAreaView
                style={[
                  styles.titleContainer,
                  {
                    top: 0,
                    position: "absolute",
                    width: "100%",
                    padding: 25,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    backgroundColor: "#292929",
                    opacity: 0.7,
                  },
                ]}
              >
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity
                    onPress={() => (UserStore.lyricsToggle = false)}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignSelf: "center",
                        padding: 10,
                      }}
                    >
                      <Icon name="back" size={20} color="#fff" />
                    </View>
                  </TouchableOpacity>

                  <View style={{ alignSelf: "center", marginLeft: 0, flex: 5 }}>
                    <View>
                      <Text
                        style={{
                          textAlign: "center",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                        numberOfLines={1}
                      >
                        {array[UserStore.trackIndex].title}
                      </Text>
                    </View>
                    <View
                      style={{
                        padding: 0,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "#1DB954",
                          padding: 0,
                          textAlign: "center",
                        }}
                        numberOfLines={1}
                      >
                        {`${array[UserStore.trackIndex].artist}`}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                      marginLeft: 0,
                      flex: 1,
                      alignItems: "center",
                    }}
                  >
                    <TouchableOpacity>
                      <Icon name="dots-three-vertical" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </SafeAreaView>
            </ImageBackground>
          )}
        >
          <View>
            <Animatable.View
              animation="bounceInUp"
              style={{
                backgroundColor: "#292929",
                height: "100%",
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                paddingHorizontal: 10,
              }}
            >
              <ScrollView style={{ padding: 5, marginTop: 5, paddingTop: 10 }}>
                <Text
                  style={{ color: "grey", fontSize: 20, fontWeight: "500" }}
                >
                  {array[UserStore.trackIndex].lyrics}
                </Text>
              </ScrollView>
            </Animatable.View>
          </View>
        </ParallaxScrollView>
      </View>
    );
  }
}

export default observer(Tracks);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292929",
    paddingHorizontal: 20,
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
