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
import Tracks from "../components/spotify_search/Tracks";
import Album from "../components/spotify_search/Albums";
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

function Albums() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [userDetails, setUserDetails] = React.useState([]);
  const [lyricsPage, setLyricsPage] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  // Spotify
  const [status, setStatus] = React.useState(0);

  // Users
  const [status1, setStatus1] = React.useState(0);

  const search = () => {
    spotifyAPI.searchAlbums(searchTerm).then((data) => {
      array2 = [];
      // console.log(data);
      data.albums.items.map((item) => {
        let albumQuery = {
          id: item.id,
          title: item.name,
          artist: item.artists[0].name,
          image: item.images[0].url,
        };
        // console.log(trackQuery)
        array2.push(albumQuery);
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
                {array2.map((album) => {
                  return <Album album={album} />
                })}
              </LinearGradient>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export default observer(Albums);

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
