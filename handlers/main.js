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

import spotifyAPI from "../components/SpotifyAPI";

exports.first_route = () => {
  const [queryList, setQueryList] = React.useState([]);
  const [data, setData] = React.useState({
    track: "",
  });

  const handleTrackChange = (val) => {
    setData({ ...data, track: val });
  };

  const search = (query) => {
    setQueryList([]);
    spotifyAPI.searchTracks(query).then(
      (data) => {
        // console.log(data);
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
  };

  const select = (item) => {
    // setTrackDetails(item); // UserStore
    UserStore.trackDetails = item;
    // setIndex(1);
    // setCaptionHeader(true);
    // setPickerHeader(false);
    // console.log(item);
  };

  let track_s = queryList ? (
    queryList.map((item) => (
      <TouchableOpacity onPress={() => select(item)}>
        <View style={{ flexDirection: "row", opacity: 0.7 }}>
          <View style={{ padding: 10 }}>
            <Image
              source={{ uri: item.image }}
              style={{
                height: 65,
                width: 65,
                borderRadius: 50,
                borderWidth: 3,
                borderColor: "green",
                justifyContent: "center",
              }}
            />
          </View>
          <View
            style={[
              { backgroundColor: "transparent", justifyContent: "center" },
            ]}
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
        </View>
      </TouchableOpacity>
    ))
  ) : (
    <Text>Loading</Text>
  );

  return (
    <Animatable.View
      animation="bounceInUp"
      style={{ flex: 1, backgroundColor: "#000" }}
    >
      <View style={styles.action}>
        <View style={{ margin: 20, flex: 3 }}>
          <TextInput
            placeholder="Search for music"
            autoCapitalize="none"
            onChangeText={(val) => handleTrackChange(val)}
            style={{ color: "#fff" }}
          />
        </View>

        <View style={{ flex: 1, marginRight: 5 }}>
          <TouchableOpacity onPress={() => search(data.track)}>
            <LinearGradient colors={["#1DB954", "green"]} style={styles.signIn}>
              <MaterialCommunityIcons name="spotify" color="#fff" size={20} />
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
      <View>
        <ScrollView>
          <LinearGradient colors={["#000", "#292928", "#000"]}>
            {track_s}
          </LinearGradient>
        </ScrollView>
      </View>
    </Animatable.View>
  );
};

exports.second_route = (caption) => {
  return (
    <Animatable.View style={[styles.scene, { backgroundColor: "#000" }]}>
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
};

exports.third_route = (caption) => {
  const makePost = (post) => {
    axios
      .post(
        "https://europe-west1-projectmelo.cloudfunctions.net/api/post",
        post,
        {
          headers: {
            Authorization: `Bearer ${UserStore.authCode}`,
          },
        }
      )
      .then((res) => {
        axios
          .get("https://europe-west1-projectmelo.cloudfunctions.net/api/posts")
          .then((res) => {
            console.log(res.data);
            UserStore.allPosts = res.data;
            //navigate home
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };
  return (
    <Animatable.View
      animation="bounceInUp"
      style={[styles.scene, { backgroundColor: "#000" }]}
    >
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

      <TouchableOpacity
        style={{
          marginTop: 5,
          alignSelf: "center",
          borderWidth: 0,
          borderRadius: 15,
          borderColor: "#fff",
        }}
        onPress={() => {
          makePost({
            trackID: UserStore.trackDetails.id,
            spotifyID: UserStore.spotifyUserDetails.user_id,
            body: caption,
            status: "Track",
          });
          // refresh
          UserStore.enablePostScreen = false;
        }}
      >
        <LinearGradient colors={["#000", "#292929"]} style={styles.signIn}>
          <MaterialCommunityIcons name="spotify" color="#fff" size={30} />
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );
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
      >
        <FontAwesome
          name="plus-circle"
          size={65}
          style={{
            // color: "#1DB954",
            // padding: 4,
            // alignSelf: "center",
            borderRadius: 20,
            opacity: 0.75,
          }}
        />
      </ImageBackground>
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
    style={{ backgroundColor: "black" }}
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
    paddingBottom: 5,
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
