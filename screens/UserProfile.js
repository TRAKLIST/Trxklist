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
  const [image, setImage] = React.useState("");
  const [name, setName] = React.useState("");

  useEffect(() => {
    axios
      .get(`https://europe-west1-projectmelo.cloudfunctions.net/api/user/ADMIN`)
      .then((res) => {
        console.log(res.data, "ebiu");
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
              <View
                style={{
                  backgroundColor: "grey",
                  padding: 5,
                  borderRadius: 5,
                  margin: 5,
                }}
              >
                <Text
                  style={{
                    color: "#292929",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  Following
                </Text>
              </View>
              <View
                style={{
                  borderWidth: 2,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  borderColor: "grey",
                }}
              >
                <Text
                  style={{ color: "grey", fontWeight: "bold", fontSize: 20 }}
                >
                  X
                </Text>
              </View>
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
              <View
                style={{
                  backgroundColor: "grey",
                  padding: 5,
                  borderRadius: 5,
                  margin: 5,
                }}
              >
                <Text
                  style={{
                    color: "#292929",
                    fontWeight: "bold",
                    textTransform: "uppercase",
                  }}
                >
                  Followers
                </Text>
              </View>
              <View
                style={{
                  borderWidth: 2,
                  paddingHorizontal: 20,
                  borderRadius: 5,
                  borderColor: "grey",
                }}
              >
                <Text
                  style={{ color: "grey", fontWeight: "bold", fontSize: 20 }}
                >
                  Y
                </Text>
              </View>
            </View>
          </View>
        )}
      >
        <View style={{ flex: 1, padding: 15 }}>
          <View style={{ flex: 1, alignItems: "center", padding: 5 }}>
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
              firstItem={1}
              renderItem={_renderItem}
              sliderWidth={Dimensions.get("window").width}
              itemWidth={Dimensions.get("window").width / 3}
              onSnapToItem={(index) => setIndex(index)}
            />
          </View>
          <View style={{ flex: 1 }}>
            <View
              /** dist. links */ style={{ flexDirection: "row", padding: 0 }}
            >
              <View
                style={{
                  flex: 1,
                  // backgroundColor: "purple",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#F8F8FF",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 40,
                    width: 40,
                    borderRadius: 12,
                  }}
                >
                  <Fontisto name="instagram" color="#cd486b" size={22} />
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  // backgroundColor: "black",
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#F8F8FF",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 40,
                    width: 40,
                    borderRadius: 12,
                  }}
                >
                  <Fontisto name="twitter" color="#00acee" size={22} />
                </View>
              </View>
            </View>
            <View /** bio. description */ style={{ padding: 10 }}>
              <TextInput
                placeholder="say sumn..."
                autoCapitalize="none"
                // value={caption}
                // autoCorrect={false}
                multiline="true"
                numberOfLines={4}
                // onChangeText={(val) => handleCaptionChange(val)}
                style={{
                  justifyContent: "center",
                  backgroundColor: "#000",
                  borderRadius: 10,
                  borderColor: "grey",
                  flex: 1,
                  textAlign: "center",
                  fontSize: 20,
                  opacity: 0.4,
                  color: "#fff",
                  fontWeight: "bold",
                  paddingTop: 40,
                  paddingBottom: 40,
                  paddingLeft: 20,
                  paddingRight: 20,
                }}
              />
            </View>

            <View
              /** dist. links */ style={{ flexDirection: "row", padding: 0 }}
            >
              <View
                style={{
                  flex: 1,
                  // backgroundColor: "pink",
                  // padding: 10,
                  alignItems: "center",
                }}
              >
                <View
                  style={{
                    backgroundColor: "#F8F8FF",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 40,
                    width: 40,
                    borderRadius: 12,
                  }}
                >
                  <Fontisto name="spotify" color="#1DB954" size={22} />
                </View>
              </View>
              <View
                style={{
                  flex: 1,
                  // backgroundColor: "yellow",
                  alignItems: "center",
                  // padding : 10
                }}
              >
                <View
                  style={{
                    backgroundColor: "#F8F8FF",
                    justifyContent: "center",
                    alignItems: "center",
                    height: 40,
                    width: 40,
                    borderRadius: 12,
                  }}
                >
                  <Fontisto name="soundcloud" color="#ff7700" size={22} />
                </View>
              </View>
            </View>

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
                data={[
                  {
                    name: "Okafor's Law",
                    albumName: "Anytime Soon(Deluxe Edition)",
                    artistName: "Ajebutter22 and Studio Magic",
                    trackName: "Okafor's Law",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b2738a292235ee6a87e93c32ce20",
                    id: "5ZIcZTKGEHZoiPVsXoCv03",
                  },
                  {
                    name: "Day Dream$",
                    albumName: "SANCIETY 2",
                    artistName: "San Bravura",
                    trackName: "Day Dream$",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b27361ec35706a7b11046d88efcc",
                    id: "4L9PyuSuEwLZGFy1x1fXnx",
                  },
                  {
                    name: "Pain 1993 (with Playboi Carti)",
                    albumName: "Dark Lane Demo Tapes",
                    artistName: "Drake",
                    trackName: "Pain 1993 (with Playboi Carti)",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b273bba7cfaf7c59ff0898acba1f",
                    id: "6Kj17Afjo1OKJYpf5VzCeo",
                  },
                  {
                    name: "Not You Too (feat. Chris Brown)",
                    albumName: "Dark Lane Demo Tapes",
                    artistName: "Drake",
                    trackName: "Not You Too (feat. Chris Brown)",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b273bba7cfaf7c59ff0898acba1f",
                    id: "3Q4gttWQ6hxqWOa3tHoTNi",
                  },
                  {
                    name: "Over My Dead Body",
                    albumName: "Take Care (Deluxe)",
                    artistName: "Drake",
                    trackName: "Over My Dead Body",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b273c7ea04a9b455e3f68ef82550",
                    id: "2Gnsof1hvZzjE1xdLRpjtf",
                  },
                  {
                    name: "Years Go By",
                    albumName: "A N N I V E R S A R Y",
                    artistName: "Bryson Tiller",
                    trackName: "Years Go By",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b273008d8077814ce15da0085b47",
                    id: "4SVTus5gJc5cfkFZ8ELK1p",
                  },
                  {
                    name: "Go To Hell",
                    albumName: "Bad Habits (Deluxe)",
                    artistName: "NAV",
                    trackName: "Go To Hell",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b273a4aaecb02b51550635d7c1b1",
                    id: "6oHalJC4hM1cS4tt6fhzLH",
                  },
                  {
                    name: "Focused",
                    albumName: "Focused",
                    artistName: "PsychoYP",
                    trackName: "Focused",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b27360215e5cb2e5e101392514f0",
                    id: "5Yx0NLeMXCNgx1rAzHQh25",
                  },
                  {
                    name: "Hit Different",
                    albumName: "Hit Different",
                    artistName: "SZA",
                    trackName: "Hit Different",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b273a135dd969dce9f38ed32ef98",
                    id: "7Bar1kLTmsRmH6FCKKMEyU",
                  },
                  {
                    name: "Always Forever",
                    albumName: "A N N I V E R S A R Y",
                    artistName: "Bryson Tiller",
                    trackName: "Always Forever",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b273008d8077814ce15da0085b47",
                    id: "1LV5cAo02H8h5YlZNcjULM",
                  },
                  {
                    name: "Youngest in Charge",
                    albumName: "43 Drill Dippers #2",
                    artistName: "SJ",
                    trackName: "Youngest in Charge",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b27350f846315ae870a2cb11fb65",
                    id: "3q1jlzcqeaft2nYFzCNOkN",
                  },
                  {
                    name: "Home",
                    albumName: "NRG 105",
                    artistName: "Knucks",
                    trackName: "Home",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b2736896f87c9a0538afe9d8149c",
                    id: "6Ncr1lCYnE3JHwtVK4nLAx",
                  },
                  {
                    name: "Sorry - Original Demo",
                    albumName: "Lemonade",
                    artistName: "Beyoncé",
                    trackName: "Sorry - Original Demo",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b27389992f4d7d4ab94937bf9e23",
                    id: "6eR1N0EBHiDkGDzegX99d3",
                  },
                  {
                    name: "Take Your Shot",
                    albumName: "SANCIETY 2",
                    artistName: "San Bravura",
                    trackName: "Take Your Shot",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b27361ec35706a7b11046d88efcc",
                    id: "4xzHMCUYk8dvlziKZ9vWri",
                  },
                  {
                    name: "Only You Freestyle",
                    albumName: "Only You Freestyle",
                    artistName: "Headie One",
                    trackName: "Only You Freestyle",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b273f7534e604b1a5c9d8182130d",
                    id: "4OENnoidV0h8gJV6bhrw7r",
                  },
                  {
                    name: "Within A Day",
                    albumName: "Me Before You (Original Motion Picture Score)",
                    artistName: "Craig Armstrong",
                    trackName: "Within A Day",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b273c30f84b2cb633637d1da3a69",
                    id: "6X5BTmKnwmeP02pinepASv",
                  },
                  {
                    name: "wicked, sexy!",
                    albumName: "EVERYTHING YOU HEARD IS TRUE",
                    artistName: "Odunsi (The Engine)",
                    trackName: "wicked, sexy!",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b2737b37913dd47d2214cc891ba2",
                    id: "6IsOt1shnug3aISsedXatq",
                  },
                  {
                    name: "Throw Away",
                    albumName: "Monster",
                    artistName: "Future",
                    trackName: "Throw Away",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b273e2528d35865f3114cfe9a16e",
                    id: "2ML7vSeIZEmOCOiLUmz7Sv",
                  },
                  {
                    name: "You Used to Love Me",
                    albumName: "Faith",
                    artistName: "Faith Evans",
                    trackName: "You Used to Love Me",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b273157ca087bea9d4e886abf7ce",
                    id: "0KhXVmAN4sqeEgsqRd39f2",
                  },
                  {
                    name: "No Promises",
                    albumName: "The Bigger Artist",
                    artistName: "A Boogie Wit da Hoodie",
                    trackName: "No Promises",
                    image:
                      "https://i.scdn.co/image/ab67616d0000b273cdba7ee22968991250725ce1",
                    id: "2BJpuAoDeQ1QuPvnryfAWK",
                  },
                ]}
                firstItem={1}
                renderItem={_renderItem_b}
                sliderWidth={Dimensions.get("window").width}
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
