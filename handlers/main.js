import React from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
  const [toggleHiglight, setToggleHiglight] = React.useState("");
  const [queryList, setQueryList] = React.useState([]);
  const [data, setData] = React.useState({
    track: "",
  });

  const handleTrackChange = (val) => {
    setData({ ...data, track: val });
  };

  const search = (query) => {
    setQueryList([]);
    // console.log(status, "uvyu");

    if (status == "Track") {
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
    } else if (status == "Album") {
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
    } else if (status == "Playlist") {
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
            // console.log(trackQuery.title, "rvsu");
            setQueryList((oldArray) => [...oldArray, trackQuery]);
          });
        },
        function (err) {
          console.error(err);
        }
      );
    } else if (status == "Cloud") {
      axios
        .get(
          `https://api-v2.soundcloud.com/search/tracks?q=${query}&client_id=NpVHurnc1OKS80l6zlXrEVN4VEXrbZG4&limit=20`
        )
        .then((res) => {
          // console.log(res.data, 'fg')
          res.data.collection.map((track) => {
            let trackQuery = {
              id : track.id,
              urn: track.urn,
              title: track.title,
              user_or_artist: track.user.username,
              verified: track.user.verified,
              image: track.artwork_url,
              // releaseDate: track.album.release_date,
            };
            setQueryList((oldArray) => [...oldArray, trackQuery]);
          });
          console.log(queryList, "vrihb");
        });
    }
  };

  const select = (item) => {
    setToggleHiglight(item.id);
    let track_playlist = [];
    // console.log(item, "bers");
    // if album or playlist get tracks

    if (status == "Playlist") {
      UserStore.trackDetails = item;
    } else if (status == "Album") {
      // spotifyAPI.getAlbumTracks(item.id).then((response) => {
      //   console.log(response, "jhy");
      // });
      UserStore.trackDetails = item;
    } else if (status == "Track") {
      UserStore.trackDetails = item;
    } else if (status = "Cloud") {
      UserStore.trackDetails = item;
      console.log(item, 'frew')
    }
  };

  let track_s = queryList ? (
    queryList.map((item) => (
      <TouchableWithoutFeedback
        style={{ marginBottom: 10 }}
        onPress={() => select(item)}
      >
        <View
          style={{
            flexDirection: "row",
            opacity: 0.7,
            backgroundColor:
              toggleHiglight == item.id ? "whitesmoke" : "transparent",
            borderRadius: 15,
            padding: 5,
          }}
        >
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
                  backgroundColor: status == "Cloud" ? "#ff7700" : "#44CF6C",
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
                  name={status == "Cloud" ? "soundcloud" : "spotify"}
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
                    color: toggleHiglight == item.id ? "#000" : "#fff",
                    fontWeight: "bold",
                  },
                ]}
              >
                {status == "Cloud" ? item.title : item.name}
              </Text>
            </View>
            <View>
              <Text
                style={{
                  color: status == "Cloud" ? "#ff7700" : "#44CF6C",
                  fontWeight: "bold",
                  // backgroundColor: "#fff",
                  paddingTop: 5,
                  alignSelf: "flex-start",
                }}
              >
                {status == "Cloud" ? item.user_or_artist : item.artist}
              </Text>
            </View>
          </View>
          {status != "Cloud" && (
            <View
              style={{
                flex: 0.5,
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              <TouchableOpacity style={{ justifyContent: "center", margin: 5 }}>
                <View style={styles.iconContainer2}>
                  <MaterialCommunityIcons
                    name="content-save-outline"
                    size={27}
                    color={"#44CF6C"}
                  />
                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      </TouchableWithoutFeedback>
    ))
  ) : (
    <Text>Loading</Text>
  );

  return (
    <Animatable.View
      animation="bounceInUp"
      style={{
        flex: 1,
        backgroundColor: "#292929",
        paddingTop: 20,
        flexDirection: "column",
      }}
    >
      <View style={{ flexDirection: "row" }}>
        <View
          style={{
            flex: 3,
            backgroundColor: "grey",
            justifyContent: "center",
            borderRadius: 8,
            shadowColor: "#292929",
            shadowOffset: { width: 1, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            margin: 10,
            borderColor: "#5C5C5C",
          }}
        >
          <TextInput
            placeholder="Search for music"
            autoCapitalize="none"
            onChangeText={(val) => handleTrackChange(val)}
            style={{
              color: "#292929",
              fontWeight: "600",
              // justifyContent: "center",
              textAlign: "center",
              // padding: 10,
              borderRadius: 8,
              borderWidth: 2,
              borderColor: "#5c5c5c5c",
              // backgroundColor: "grey",
              height: 35,
            }}
            placeholderStyle={{ color: "grey", fontSize: 5 }}
          />
        </View>
        <View
          style={{
            flex: 1,
            backgroundColor: "grey",
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 10,
            margin: 10,
            borderWidth: 2,
            borderColor: "#5c5c5c5c",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              Keyboard.dismiss();
              search(data.track);
            }}
          >
            <Octicons name="search" color="#292929" size={20} />
          </TouchableOpacity>
        </View>
      </View>

      {/* <View style={[{ flexDirection: "row" }]}>
        <View
          style={{
            backgroundColor: "transparent",
            flex: 4,
            shadowColor: "#292929",
            shadowOffset: { width: 1, height: 2 },
            shadowOpacity: 0.8,
            shadowRadius: 2,
            height: 90,
            borderRadius: 5,
          }}
        >
          <LinearGradient
            style={{ margin: 10, borderRadius: 8 }}
            colors={["#7A7A7A", "#666666"]}
          >
            <TextInput
              placeholder="Search for music"
              autoCapitalize="none"
              onChangeText={(val) => handleTrackChange(val)}
              style={{
                color: "grey",
                fontWeight: "bold",
                justifyContent: "center",
                padding: 10,
                borderRadius: 5,
                // backgroundColor: "grey",
              }}
              placeholderStyle={{ color: "grey", fontSize: 5 }}
            />
          </LinearGradient>
        </View>

        <View
          style={{
            flex: 1,
            backgroundColor: "blue",
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 5,
          }}
        >
          <LinearGradient colors={["yellow", "yellow"]}>
            <TouchableOpacity
              onPress={() => {
                Keyboard.dismiss();
                search(data.track);
              }}
            >
              <Octicons name="search" color="grey" size={26} />
            </TouchableOpacity>
          </LinearGradient>
        </View>
      </View> */}
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
  if (status == "Track") {
    return (
      <Animatable.View /*animation = "fadeInUp"*/ style={{ flex: 1 }}>
        <View style={{ backgroundColor: "#292929", flex: 1 }}>
          <View style={{ backgroundColor: "#292929", flex: 1, marginTop: 15 }}>
            <Body
              thisTrack={UserStore.trackDetails}
              caption={caption}
              status={"Track"}
              imageUri={UserStore.spotifyUserDetails.user_image}
            />
          </View>
        </View>
      </Animatable.View>
    );
  } else if (status == "Album") {
    return (
      <Animatable.View style={[styles.scene, { backgroundColor: "#292929" }]}>
        <Body
          thisTrack={UserStore.trackDetails}
          caption={caption}
          status={"Track"}
          imageUri={UserStore.spotifyUserDetails.user_image}
        />
      </Animatable.View>
    );
  } else if (status == "Playlist") {
    return (
      <View style={{ backgroundColor: "#292929", flex: 1 }}>
        <View style={{ backgroundColor: "#292929", flex: 1, marginTop: 15 }}>
          <Body
            thisTrack={UserStore.trackDetails}
            caption={caption}
            status={"Track"}
            imageUri={UserStore.spotifyUserDetails.user_image}
          />
        </View>
      </View>
    );
  } else if (status == "Cloud") {
    return (
      <View style={{ backgroundColor: "#292929", flex: 1 }}>
        <View style={{ backgroundColor: "#292929", flex: 1, marginTop: 15 }}>
          <Body
            thisTrack={UserStore.trackDetails}
            caption={caption}
            status={"Cloud"}
            imageUri={UserStore.spotifyUserDetails.user_image}
          />
        </View>
      </View>
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
        imageStyle={{ borderRadius: 10 }}
      ></ImageBackground>
    </Animatable.View>
  );
};

exports.recent_posts_markup = () =>
  UserStore.allPosts ? (
    UserStore.allPosts.map((post, index) => (
      <View
        style={{
          backgroundColor: index % 2 == 0 ? "grey" : "#292929",
          padding: 0,
        }}
      >
        <View
          style={{
            marginBottom: 0,
            padding: 50,
            borderRadius: 0,
            paddingHorizontal: 20,
            backgroundColor: index % 2 == 0 ? "#292929" : "grey",
            borderTopLeftRadius: index % 2 == 0 ? 0 : 50,
            borderTopRightRadius:
              index != UserStore.allPosts.length - 1
                ? index != 0
                  ? index % 2 == 0
                    ? 50
                    : 0
                  : 0
                : 0,
            borderBottomLeftRadius:
              index != UserStore.allPosts.length - 1
                ? index % 2 == 0
                  ? 0
                  : 50
                : 0,
            borderBottomRightRadius: index % 2 == 0 ? 50 : 0,
            // backgroundColor : 'red'
          }}
        >
          {/* <View style = {{padding : 5, backgroundColor : index % 2 == 0 ? "blue" : "red"}}> */}
          <Post key={post.postID} post={post} index={index} />
          {/* </View> */}
        </View>
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
