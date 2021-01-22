import React, { useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Dimensions,
  TextInput,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import UserStore from "../stores/UserStore";
import axios from "axios";
import Post from "../components/Post";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import Fontisto from "react-native-vector-icons/Fontisto";
import { observer } from "mobx-react";

const AnimatedCustomScrollView = Animated.createAnimatedComponent(ScrollView);

function wait(timeout) {
  return new Promise((res) => {
    setTimeout(res, timeout);
  });
}

let recentPostsMarkup = [];

const { sticky_item_view, recent_posts_markup } = require("../handlers/main");

const UserProfile = ({ navigation }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [postData, setPostData] = React.useState([]);
  const [topArtists, setTopArtists] = React.useState([]);
  const [topTracks, setTopTracks] = React.useState([]);
  const [playlists, setPlaylists] = React.useState([]);
  const [image, setImage] = React.useState("");
  const [name, setName] = React.useState("");

  useEffect(() => {
    axios
      .get(`https://europe-west1-projectmelo.cloudfunctions.net/api/user/ADMIN`)
      .then((res) => {
        console.log(JSON.parse(res.data.user.topArtists), "etgrkle");
        setTopArtists(JSON.parse(res.data.user.topArtists));
        setTopTracks(JSON.parse(res.data.user.topTracks));
        setPlaylists(JSON.parse(res.data.user.playlists));
        setPostData(res.data.posts);
        setImage(res.data.user.image);
        setName(res.data.user.meloID);
      })
      .catch((err) => console.log(err));

    /**DATA NEEDED?
     * Following [count]
     * Followers [count]
     * Top Artists
     * Top Tracks
     * Playlists
     * User Posts - done
     */
  }, []);

  recentPostsMarkup = postData ? (
    postData.map((post, index) => (
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

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => {
      setRefreshing(false);

      // new post
      axios
        .get("https://europe-west1-projectmelo.cloudfunctions.net/api/posts")
        .then((res) => {
          // console.log("yes");
          UserStore.allPosts = res.data;
        })
        .catch((err) => console.log(err));
    }, [refreshing]);
  });

  const [index, setIndex] = React.useState(0);
  const _renderItem = ({ item, index }) => {
    return (
      <View style={{ borderRadius: 5 }}>
        <Image
          style={{ alignSelf: "center", marginBottom: 5, borderRadius: 10 }}
          source={{ uri: item.image, height: 120, width: "100%" }}
        />
        <Text
          numberOfLines={1}
          style={{
            backgroundColor: "#292929",
            color: "grey",
            fontWeight: "bold",
            textAlign: "center",
            // margin: 5,
            padding: 5,
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          {item.artistName}
        </Text>
      </View>
    );
  };

  const _renderItem_b = ({ item, index }) => {
    return (
      <View style={{ borderRadius: 5 }}>
        <Image
          style={{ alignSelf: "center", marginBottom: 5, borderRadius: 10 }}
          source={{ uri: item.image, height: 120, width: "100%" }}
        />
        <Text
          numberOfLines={1}
          style={{
            backgroundColor: "#292929",
            color: "grey",
            fontWeight: "bold",
            textAlign: "center",
            // margin: 5,
            padding: 5,
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          {item.name}
        </Text>
      </View>
    );
  };

  const _renderItem_c = ({ item, index }) => {
    return (
      <View style={{ borderRadius: 5 }}>
        <Image
          style={{ alignSelf: "center", marginBottom: 5, borderRadius: 10 }}
          source={{ uri: item.images, height: 120, width: "100%" }}
        />
        <Text
          numberOfLines={1}
          style={{
            backgroundColor: "#292929",
            color: "grey",
            fontWeight: "bold",
            textAlign: "center",
            // margin: 5,
            padding: 5,
            borderRadius: 5,
            overflow: "hidden",
          }}
        >
          {item.title}
        </Text>
      </View>
    );
  };

  const _renderItem1 = ({ item, index }) => {
    return (
      <View style={{ width: Dimensions.get("window").width / 2 }}>
        <Image
          style={{ alignSelf: "center", borderRadius: 5 }}
          source={{
            uri: item.images,
            height: (3 * Dimensions.get("window").width) / 10,
            width: (3 * Dimensions.get("window").width) / 10,
          }}
        />
        <Text
          style={{
            padding: 5,
            textAlign: "center",
            margin: 5,
            backgroundColor: "#007bff",
            color: "#fff",
            fontWeight: "bold",
          }}
          numberOfLines={1}
        >
          {item.title}
        </Text>
      </View>
    );
  };
  let userPostsMarkup = postData ? (
    postData.map((post) => <Post key={post.postID} post={post} />)
  ) : (
    <Text>Loading</Text>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#292929" }}>
      <ParallaxScrollView
        backgroundColor="#292929"
        contentBackgroundColor="grey" // transparent
        parallaxHeaderHeight={95}
        renderScrollComponent={() => (
          <AnimatedCustomScrollView
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#292929"
              />
            }
          />
        )}
        renderStickyHeader={() => (
          <View
            style={{
              padding: 10,
              // marginBottom: 10,
              backgroundColor: "#292929",
              borderWidth: 0,
              borderColor: "#fff",
              borderRadius: 0,
              minHeight: 80,
              borderBottomWidth: 1,
              //   flex : 1,
              backgroundColor: "#292929",
            }}
          >
            <Text>PLAYLISTS</Text>
          </View>
        )}
        stickyHeaderHeight={90}
        // renderBackground = {0}
        renderForeground={() => (
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              alignSelf: "center",
              alignItems: "center",
              //   backgroundColor: "grey",
              //   borderBottomRightRadius: 50,
            }}
          >
            <View
              style={{ flex: 1, alignItems: "center", flexDirection: "column" }}
            >
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <TouchableOpacity onPress={() => search(data.track)}>
                <View
                  // colors={["#272D2D", "#272D2D"]}
                  style={[styles.signIn]}
                >
                  <View>
                    <Image
                      source={{ uri: image }}
                      style={{
                        height: 55,
                        width: 55,
                        borderRadius: 30,
                        margin: 5,
                      }}
                    />
                  </View>
                  <View>
                    <Text
                      numberOfLines={1}
                      style={{
                        fontWeight: "bold",
                        color: "grey",
                        padding: 5,
                        borderRadius: 5,
                        overflow: "hidden",
                      }}
                    >
                      {name}
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{ flex: 1, alignItems: "center", flexDirection: "column" }}
            >
            </View>
          </View>
        )}
      >
        <View style={{ flex: 1, padding: 15, backgroundColor: "black", }}>
          <View style={{backgroundColor : 'transparent', flex: 1,}}>
            <View style={{ flex: 1, alignItems: "center", padding: 5, backgroundColor : 'transparent' }}>
              <Carousel
                // ref={(c) => { _carousel = c; }}
                data={topArtists}
                firstItem={1}
                renderItem={_renderItem}
                sliderWidth={Dimensions.get("window").width - 40}
                itemWidth={Dimensions.get("window").width / 3}
                onSnapToItem={(index) => setIndex(index)}
              />
            </View>
            <View style={{ flex: 1, alignItems: "center", padding: 5 }}>
              <Carousel
                // ref={(c) => { _carousel = c; }}
                data={playlists}
                firstItem={1}
                renderItem={_renderItem_c}
                sliderWidth={Dimensions.get("window").width - 40}
                itemWidth={Dimensions.get("window").width / 3}
                onSnapToItem={(index) => setIndex(index)}
              />
            </View>
            <View
              style={{
                flexDirection: "column",
                // backgroundColor: "red",
                flex: 1,
                marginTop: 7,
              }}
            >
              <View style={{ flex: 1, alignItems: "center" }}>
                <Carousel
                  // ref={(c) => { _carousel = c; }}
                  data={topTracks}
                  firstItem={1}
                  renderItem={_renderItem_b}
                  sliderWidth={Dimensions.get("window").width - 40}
                  itemWidth={Dimensions.get("window").width / 3}
                  onSnapToItem={(index) => setIndex(index)}
                />
              </View>
            </View>
          </View>
        </View>
        <View style={{ backgroundColor: "blue" }}>{recentPostsMarkup}</View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
};

export default observer(UserProfile);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007bff",
  },
  title: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
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
