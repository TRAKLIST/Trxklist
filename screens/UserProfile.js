import React, { Component, useEffect } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  Button,
  Image,
  TouchableOpacity,
  Animated,
  RefreshControl,
  Dimensions,
  StatusBar,
} from "react-native";
import Carousel, { Pagination } from "react-native-snap-carousel";
import UserStore from "../stores/UserStore";
import axios from "axios";
import Post from "../components/Post";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { observer } from "mobx-react";

const AnimatedCustomScrollView = Animated.createAnimatedComponent(ScrollView);

function wait(timeout) {
  return new Promise((res) => {
    setTimeout(res, timeout);
  });
}

const {
  first_route,
  second_route,
  sticky_item_view,
  recent_posts_markup,
  render_tab_bar,
} = require("../handlers/main");

let recentPostsMarkup = recent_posts_markup();

const Profile = ({ navigation }) => {
  const [refreshing, setRefreshing] = React.useState(false);
  const [postData, setPostData] = React.useState([]);
  useEffect;

  useEffect(() => {
    axios
      .get(`https://europe-west1-projectmelo.cloudfunctions.net/api/user/Keem`)
      .then((res) => {
        console.log(res.data);
        setPostData(res.data.posts);
      })
      .catch((err) => console.log(err));
  }, []);

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
        <Text
          numberOfLines={1}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            fontWeight: "bold",
            marginHorizontal: 10,
            textAlign: "center",
            margin: 5,
          }}
        >
          {item.artistName}
        </Text>
        <Image
          style={{ alignSelf: "center", marginBottom: 5, borderRadius: 10 }}
          source={{ uri: item.image, height: 100, width: 100 }}
        />
      </View>
    );
  };

  const _renderItem_b = ({ item, index }) => {
    return (
      <View style={{ borderRadius: 5 }}>
        <Text
          numberOfLines={1}
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            fontWeight: "bold",
            marginHorizontal: 10,
            textAlign: "center",
            margin: 5,
          }}
        >
          {item.artistName}
        </Text>
        <Image
          style={{ alignSelf: "center", marginBottom: 5, borderRadius: 10 }}
          source={{ uri: item.image, height: 100, width: 100 }}
        />
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
            <Text>vwcehbu</Text>
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
              <View
                style={{ backgroundColor: "grey", padding: 5, borderRadius: 5 }}
              >
                <Text style={{ color: "#292929", fontWeight: "bold" }}>
                  Followers
                </Text>
              </View>
              <View>
                <Text>Y</Text>
              </View>
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              <TouchableOpacity onPress={() => search(data.track)}>
                <View
                  // colors={["#272D2D", "#272D2D"]}
                  style={styles.signIn}
                >
                  <MaterialCommunityIcons
                    name="circle"
                    color="#FFF"
                    size={55}
                  />
                </View>
              </TouchableOpacity>
            </View>
            <View
              style={{ flex: 1, alignItems: "center", flexDirection: "column" }}
            >
              <View
                style={{ backgroundColor: "grey", padding: 5, borderRadius: 5 }}
              >
                <Text style={{ color: "#292929", fontWeight: "bold" }}>
                  Followers
                </Text>
              </View>
              <View>
                <Text>X</Text>
              </View>
            </View>
          </View>
        )}
      >
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Carousel
                // ref={(c) => { _carousel = c; }}
                data={[
                  {
                    artistName: "Drake",
                    image:
                      "https://i.scdn.co/image/60cfab40c6bb160a1906be45276829d430058005",
                    id: "3TVXtAsR1Inumwj472S9r4",
                  },
                  {
                    artistName: "Future",
                    image:
                      "https://i.scdn.co/image/fa9015ca2bf85af90b967500148da9706a156e3b",
                    id: "1RyvyyTE3xzB2ZywiAwp0i",
                  },
                  {
                    artistName: "PARTYNEXTDOOR",
                    image:
                      "https://i.scdn.co/image/797276c2f8da713f0534e012de4d144f338e1664",
                    id: "2HPaUgqeutzr3jx5a9WyDV",
                  },
                  {
                    artistName: "Bryson Tiller",
                    image:
                      "https://i.scdn.co/image/c65c74e7b7eb576b8dea4d5d43283ac279e3f87d",
                    id: "2EMAnMvWE2eb56ToJVfCWs",
                  },
                  {
                    artistName: "NAV",
                    image:
                      "https://i.scdn.co/image/d819f806207d520282f92cd7a8bb0438ddfff4c1",
                    id: "7rkW85dBwwrJtlHRDkJDAC",
                  },
                  {
                    artistName: "Yung Bleu",
                    image:
                      "https://i.scdn.co/image/24ed718b61468236cf6be503a80fe064c33af8eb",
                    id: "3KNIG74xSTc3dj0TRy7pGX",
                  },
                  {
                    artistName: "San Bravura",
                    image:
                      "https://i.scdn.co/image/cd0b73cb6de4b90dd0a1d65d81acfb1b217592bc",
                    id: "2bl1hMyR2lrHrTlHaBtXKa",
                  },
                  {
                    artistName: "JAY-Z",
                    image:
                      "https://i.scdn.co/image/4912d27d6b01dd790313d8ef76586be6b100550f",
                    id: "3nFkdlSjzX9mRTtwJOzDYB",
                  },
                  {
                    artistName: "Kendrick Lamar",
                    image:
                      "https://i.scdn.co/image/3a836196bfb341f736c7fe2704fb75de53f8dfbb",
                    id: "2YZyLoL8N0Wb9xBt1NhZWg",
                  },
                  {
                    artistName: "Amel Larrieux",
                    image:
                      "https://i.scdn.co/image/693317e45d8b5e19006d6460404c17de22e114b5",
                    id: "4hVcxmC7igpot32EzQf7IR",
                  },
                  {
                    artistName: "Teedra Moses",
                    image:
                      "https://i.scdn.co/image/828d13af9750d5903b1755793c9df4640c2aa7fc",
                    id: "6vfR5QRc3xca0KvpG8KZBE",
                  },
                  {
                    artistName: "J. Cole",
                    image:
                      "https://i.scdn.co/image/c58beb81196bbdda378b6746c51a10aace2f63a6",
                    id: "6l3HvQ5sa6mXTsMTB19rO5",
                  },
                  {
                    artistName: "Jhené Aiko",
                    image:
                      "https://i.scdn.co/image/f677fc21079ba4985debb4d1b3b4eb9cd7554ec8",
                    id: "5ZS223C6JyBfXasXxrRqOk",
                  },
                  {
                    artistName: "XXXTENTACION",
                    image:
                      "https://i.scdn.co/image/942afa81f0a2298ead0c154fb7b4b606de48d9e6",
                    id: "15UsOTVnJzReFVN1VCnxy4",
                  },
                  {
                    artistName: "Travis Scott",
                    image:
                      "https://i.scdn.co/image/ef784cfa3f4f87d656d3dfa5eedf0a24610faba9",
                    id: "0Y5tJX1MQlPlqiwlOH1tJY",
                  },
                  {
                    artistName: "Kodie Shane",
                    image:
                      "https://i.scdn.co/image/f6de78864ed22fed34145183748f9e1314e3f9dc",
                    id: "1CUeN4GnHAGUk9nAXPorF4",
                  },
                  {
                    artistName: "J.I the Prince of N.Y",
                    image:
                      "https://i.scdn.co/image/6f6e63accb6a8a74c267630f4443f717103455b4",
                    id: "2eqoJbzUGDwys5ENUkbT3h",
                  },
                  {
                    artistName: "Juice WRLD",
                    image:
                      "https://i.scdn.co/image/d8e62447a338a882b490460da20e90aac6d60ae7",
                    id: "4MCBfE4596Uoi2O4DtmEMz",
                  },
                  {
                    artistName: "Headie One",
                    image:
                      "https://i.scdn.co/image/334fc2728dbd443b03f288fd2f9dcac40f883a94",
                    id: "6UCQYrcJ6wab6gnQ89OJFh",
                  },
                  {
                    artistName: "Pop Smoke",
                    image:
                      "https://i.scdn.co/image/8f0a45ff4868c7868a7996b57da64f2e89042e26",
                    id: "0eDvMgVFoNV3TpwtrVCoTj",
                  },
                ]}
                renderItem={_renderItem}
                sliderWidth={Dimensions.get("window").width / 3}
                itemWidth={Dimensions.get("window").width / 3}
                onSnapToItem={(index) => setIndex(index)}
              />
            </View>
            <View style={{ flex: 1, alignItems: "center" }}>
              <Carousel
                // ref={(c) => { _carousel = c; }}
                data={[
                  {
                    artistName: "Drake",
                    image:
                      "https://i.scdn.co/image/60cfab40c6bb160a1906be45276829d430058005",
                    id: "3TVXtAsR1Inumwj472S9r4",
                  },
                  {
                    artistName: "Future",
                    image:
                      "https://i.scdn.co/image/fa9015ca2bf85af90b967500148da9706a156e3b",
                    id: "1RyvyyTE3xzB2ZywiAwp0i",
                  },
                  {
                    artistName: "PARTYNEXTDOOR",
                    image:
                      "https://i.scdn.co/image/797276c2f8da713f0534e012de4d144f338e1664",
                    id: "2HPaUgqeutzr3jx5a9WyDV",
                  },
                  {
                    artistName: "Bryson Tiller",
                    image:
                      "https://i.scdn.co/image/c65c74e7b7eb576b8dea4d5d43283ac279e3f87d",
                    id: "2EMAnMvWE2eb56ToJVfCWs",
                  },
                  {
                    artistName: "NAV",
                    image:
                      "https://i.scdn.co/image/d819f806207d520282f92cd7a8bb0438ddfff4c1",
                    id: "7rkW85dBwwrJtlHRDkJDAC",
                  },
                  {
                    artistName: "Yung Bleu",
                    image:
                      "https://i.scdn.co/image/24ed718b61468236cf6be503a80fe064c33af8eb",
                    id: "3KNIG74xSTc3dj0TRy7pGX",
                  },
                  {
                    artistName: "San Bravura",
                    image:
                      "https://i.scdn.co/image/cd0b73cb6de4b90dd0a1d65d81acfb1b217592bc",
                    id: "2bl1hMyR2lrHrTlHaBtXKa",
                  },
                  {
                    artistName: "JAY-Z",
                    image:
                      "https://i.scdn.co/image/4912d27d6b01dd790313d8ef76586be6b100550f",
                    id: "3nFkdlSjzX9mRTtwJOzDYB",
                  },
                  {
                    artistName: "Kendrick Lamar",
                    image:
                      "https://i.scdn.co/image/3a836196bfb341f736c7fe2704fb75de53f8dfbb",
                    id: "2YZyLoL8N0Wb9xBt1NhZWg",
                  },
                  {
                    artistName: "Amel Larrieux",
                    image:
                      "https://i.scdn.co/image/693317e45d8b5e19006d6460404c17de22e114b5",
                    id: "4hVcxmC7igpot32EzQf7IR",
                  },
                  {
                    artistName: "Teedra Moses",
                    image:
                      "https://i.scdn.co/image/828d13af9750d5903b1755793c9df4640c2aa7fc",
                    id: "6vfR5QRc3xca0KvpG8KZBE",
                  },
                  {
                    artistName: "J. Cole",
                    image:
                      "https://i.scdn.co/image/c58beb81196bbdda378b6746c51a10aace2f63a6",
                    id: "6l3HvQ5sa6mXTsMTB19rO5",
                  },
                  {
                    artistName: "Jhené Aiko",
                    image:
                      "https://i.scdn.co/image/f677fc21079ba4985debb4d1b3b4eb9cd7554ec8",
                    id: "5ZS223C6JyBfXasXxrRqOk",
                  },
                  {
                    artistName: "XXXTENTACION",
                    image:
                      "https://i.scdn.co/image/942afa81f0a2298ead0c154fb7b4b606de48d9e6",
                    id: "15UsOTVnJzReFVN1VCnxy4",
                  },
                  {
                    artistName: "Travis Scott",
                    image:
                      "https://i.scdn.co/image/ef784cfa3f4f87d656d3dfa5eedf0a24610faba9",
                    id: "0Y5tJX1MQlPlqiwlOH1tJY",
                  },
                  {
                    artistName: "Kodie Shane",
                    image:
                      "https://i.scdn.co/image/f6de78864ed22fed34145183748f9e1314e3f9dc",
                    id: "1CUeN4GnHAGUk9nAXPorF4",
                  },
                  {
                    artistName: "J.I the Prince of N.Y",
                    image:
                      "https://i.scdn.co/image/6f6e63accb6a8a74c267630f4443f717103455b4",
                    id: "2eqoJbzUGDwys5ENUkbT3h",
                  },
                  {
                    artistName: "Juice WRLD",
                    image:
                      "https://i.scdn.co/image/d8e62447a338a882b490460da20e90aac6d60ae7",
                    id: "4MCBfE4596Uoi2O4DtmEMz",
                  },
                  {
                    artistName: "Headie One",
                    image:
                      "https://i.scdn.co/image/334fc2728dbd443b03f288fd2f9dcac40f883a94",
                    id: "6UCQYrcJ6wab6gnQ89OJFh",
                  },
                  {
                    artistName: "Pop Smoke",
                    image:
                      "https://i.scdn.co/image/8f0a45ff4868c7868a7996b57da64f2e89042e26",
                    id: "0eDvMgVFoNV3TpwtrVCoTj",
                  },
                ]}
                renderItem={_renderItem}
                sliderWidth={Dimensions.get("window").width / 3}
                itemWidth={Dimensions.get("window").width / 3}
                onSnapToItem={(index) => setIndex(index)}
              />
            </View>
          </View>
        </View>
        <View style={{ backgroundColor: "blue" }}>{recentPostsMarkup}</View>
      </ParallaxScrollView>
    </SafeAreaView>
  );
};

export default Profile;

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
