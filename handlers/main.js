import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  Keyboard,
} from "react-native";

import Post from "../components/Post";
import Body from "../components/post-components/Body";
import Footer from "../components/post-components/Footer";

import UserStore from "../stores/UserStore";

import axios from "axios";
import * as Animatable from "react-native-animatable";
import { LinearGradient } from "expo-linear-gradient";
import { TabBar } from "react-native-tab-view";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";
import Icon from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import Fontisto from "react-native-vector-icons/Fontisto";

import spotifyAPI from "../components/SpotifyAPI";
import { cos } from "react-native-reanimated";

exports.first_route = (status) => {
  const [queryList, setQueryList] = React.useState([]);
  const [data, setData] = React.useState({
    track: "",
  });

  const handleTrackChange = (val) => {
    setData({ ...data, track: val });
  };

  const search = (query) => {
    setQueryList([]);
    console.log(status, "uvyu");

    if (status == "track") {
      spotifyAPI.searchTracks(query).then(
        (data) => {
          data.tracks.items.map((item) => {
            let trackQuery = {
              id: item.id,
              name: item.name,
              artist: item.artists[0].name,
              artistID: item.artists[0].id,
              albumName: item.album.name,
              image: item.album.images[0].url,
              releaseDate: item.album.release_date,
              popularity: item.popularity,
              duration: item.duration_ms,
            };
            setQueryList((oldArray) => [...oldArray, trackQuery]);
          });
        },
        function (err) {
          console.error(err);
        }
      );
    } else if (status == "album") {
      spotifyAPI.searchAlbums(query).then(
        (data) => {
          // console.log(data, 'refbiy')
          data.albums.items.map((item) => {
            let trackQuery = {
              id: item.id,
              name: item.name,
              artist: item.artists[0].name,
              image: item.images[0].url,
            };
            // console.log(trackQuery.title, "rvsu");
            setQueryList((oldArray) => [...oldArray, trackQuery]);
          });
        },
        function (err) {
          console.error(err);
        }
      );
    } else if (status == "playlist") {
      spotifyAPI.searchPlaylists(query).then(
        (data) => {
          // console.log(data, 'refbiy')
          data.playlists.items.map((item) => {
            let trackQuery = {
              id: item.id,
              name: item.name,
              artist: item.owner.display_name,
              image: item.images[0].url,
            };
            console.log(trackQuery.title, "rvsu");
            setQueryList((oldArray) => [...oldArray, trackQuery]);
          });
        },
        function (err) {
          console.error(err);
        }
      );
    }
  };

  const select = (item) => {
    let track_playlist = [];
    console.log(item, "bers");
    // if album or playlist get tracks
    spotifyAPI.getPlaylist(item.id).then((response) => {
      // console.log(response);
      response.tracks.items.map((track) => {
        track_playlist.push({
          id: track.track.id,
          title: track.track.name,
        });
      });
      item.track = track_playlist
      // console.log(item, 'fewfever')
      // add to state here
    });
    UserStore.trackDetails = item;
  };

  let track_s = queryList ? (
    queryList.map((item) => (
      <TouchableOpacity
        style={{ marginBottom: 10 }}
        onPress={() => select(item)}
      >
        <View style={{ flexDirection: "row", opacity: 0.7 }}>
          <View style={{ flex: 1 }}>
            {/* <Image
              source={{ uri: item.image }}
              style={{
                height: 65,
                width: 65,
                borderRadius: 50,
                borderWidth: 3,
                borderColor: "green",
                justifyContent: "center",
              }}
            /> */}
            <ImageBackground
              source={{ uri: item.image }}
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
              padding: 0,
              marginBottom: 3,
              flex: 2,
            }}
          >
            <View>
              <Text
                numberOfLines={1}
                style={[
                  styles.track,
                  {
                    padding: 0,
                    paddingTop: 0,
                    paddingBottom: 0,
                    backgroundColor: "transparent",
                  },
                ]}
              >
                {item.name}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: "grey",
                  // backgroundColor: "#fff",
                  padding: 5,
                  alignSelf: "flex-start",
                  fontWeight: "500",
                }}
              >
                {item.artist}
              </Text>
            </View>
          </View>
          <View
            style={{
              flex: 0.5,
              flexDirection: "row",
              justifyContent: "flex-end",
            }}
          >
            {/* icons */}

            <TouchableOpacity style={{ justifyContent: "center", margin: 5 }}>
              <View style={styles.iconContainer2}>
                {/* {isSaved ? (
                            <MaterialCommunityIcons
                              name="content-save"
                              size={27}
                              color={"#44CF6C"}
                              style={{ marginTop: 8, paddingBottom: 4 }}
                            />
                          ) : (
                            <MaterialCommunityIcons
                              name="content-save-outline"
                              size={27}
                              color={"#44CF6C"}
                              style={{ marginTop: 8, paddingBottom: 4 }}
                            />
                          )} */}
                <MaterialCommunityIcons
                  name="content-save-outline"
                  size={27}
                  color={"#44CF6C"}
                />
              </View>
            </TouchableOpacity>
            {/* <TouchableOpacity style={{ justifyContent: "center", margin: 5 }}>
              <View style={[styles.iconContainer2]}>
                <AntDesign name="staro" size={25} color={"#44CF6C"} />
              </View>
            </TouchableOpacity> */}
          </View>
        </View>
      </TouchableOpacity>
    ))
  ) : (
    <Text>Loading</Text>
  );

  return (
    <Animatable.View
      animation="bounceInUp"
      style={{ flex: 1, backgroundColor: "#292929" }}
    >
      <View style={styles.action}>
        <View style={{ margin: 20, flex: 3 }}>
          <TextInput
            placeholder="Search for music"
            autoCapitalize="none"
            onChangeText={(val) => handleTrackChange(val)}
            style={{ color: "#fff", fontSize: 20 }}
          />
        </View>

        <View style={{ flex: 1, marginRight: 5, alignItems: "center" }}>
          <TouchableOpacity
            style={{ width: 50, height: 50 }}
            onPress={() => {
              Keyboard.dismiss();
              search(data.track);
            }}
          >
            <LinearGradient
              colors={["#fff", "whitesmoke"]}
              style={[styles.signIn]}
            >
              <Octicons name="search" color="#292929" size={26} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <ScrollView>
          <LinearGradient
            style={{ margin: 10 }}
            colors={["#292928", "#292929"]}
          >
            {track_s}
          </LinearGradient>
        </ScrollView>
      </View>
    </Animatable.View>
  );
};

exports.second_route = (caption, status) => {
  if (status == "track") {
    return (
      <Animatable.View style={[styles.scene, { backgroundColor: "#292929" }]}>
        <Body
          thisTrack={UserStore.trackDetails}
          caption={caption}
          status={"Track"}
          imageUri={UserStore.spotifyUserDetails.user_image}
        />
        <Footer
          likesCount={0}
          commentCount={0}
          postID={"uuidv4()"}
          status={"Track"}
          trackID={UserStore.trackDetails.id}
        />
      </Animatable.View>
    );
  } else if (status == "album") {
    return (
      <Animatable.View style={[styles.scene, { backgroundColor: "#292929" }]}>
        <Body
          thisTrack={UserStore.trackDetails}
          caption={caption}
          status={"Album"}
          imageUri={UserStore.spotifyUserDetails.user_image}
        />
        <Footer
          likesCount={0}
          commentCount={0}
          postID={"uuidv4()"}
          status={"Album"}
          trackID={UserStore.trackDetails.id}
        />
      </Animatable.View>
    );
  } else if (status == "playlist") {
    return (
      <Animatable.View style={[styles.scene, { backgroundColor: "#292929" }]}>
        <Body
          thisTrack={UserStore.trackDetails}
          caption={caption}
          status={"Playlist"}
          imageUri={UserStore.spotifyUserDetails.user_image}
        />
        <Footer
          likesCount={0}
          commentCount={0}
          postID={"uuidv4()"}
          status={"Playlist"}
          trackID={UserStore.trackDetails.id}
        />
      </Animatable.View>
    );
  }
};

exports.sticky_item_view = () => {
  const amazingAnimation = {
    // here you add your custom interactive animation
    // based on the animated value `x`
  };

  return (
    <Animatable.View style={amazingAnimation}>
      <ImageBackground
        source={{ uri: UserStore.spotifyUserDetails.user_image }}
        style={{
          width: 65,
          height: 65,
          alignItems: "center",
          justifyContent: "center",
        }}
        imageStyle={{ borderRadius: 30 }}
      ></ImageBackground>
    </Animatable.View>
  );
};

exports.recent_posts_markup = () =>
  UserStore.allPosts ? (
    UserStore.allPosts.map((post) => (
      <View
        style={{ marginBottom: 10, borderRadius: 15, paddingHorizontal: 10 }}
      >
        <Post key={post.postID} post={post} />
      </View>
    ))
  ) : (
    <Text>Loading</Text>
  );

exports.render_tab_bar = (props) => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: "#1DB954" }}
    style={{ backgroundColor: "#292929" }}
    renderLabel={({ route, focused, color }) => (
      <Text style={{ color, margin: 8, fontWeight: "bold" }}>
        {route.title}
      </Text>
    )}
    activeColor="green"
  />
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007bff",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 25,
    paddingTop: 50,
  },
  footer: {
    flex: 1.9,
    backgroundColor: "#292929",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    // paddingHorizontal: 20,
    // paddingVertical: 30,
  },
  scene: {
    flex: 1,
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
    paddingBottom: 0,
  },
  track: {
    marginTop: 2,
    marginRight: 2,
    padding: 10,
    backgroundColor: "#000",
    fontSize: 15,
    fontWeight: "bold",
    color: "#fff",
    width: "100%",
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});
