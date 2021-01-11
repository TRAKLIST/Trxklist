import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  ScrollView,
  Button,
  Dimensions,
  RefreshControl,
  TextInput,
  Text,
  Animated,
  ImageBackground,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";

import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import StickyItemFlatList from "@gorhom/sticky-item";
import Feather from "react-native-vector-icons/Feather";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { LinearGradient } from "expo-linear-gradient";
import { TabView, SceneMap } from "react-native-tab-view";
import { Picker } from "@react-native-picker/picker";
import MainSection from "../components/MainSection";
import axios from "axios";
import * as Animatable from "react-native-animatable";
import { TabBar } from "react-native-tab-view";

import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Octicons from "react-native-vector-icons/Octicons";
import Icon from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import Fontisto from "react-native-vector-icons/Fontisto";

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
const initialLayout = { width: Dimensions.get("window").width };

function Main() {
  const [caption, setCaption] = React.useState("");
  const [pickerHeader, setPickerHeader] = React.useState(true);
  const [captionHeader, setCaptionHeader] = React.useState(false);
  const [selectedValue, setSelectedValue] = React.useState("track");
  const [refreshing, setRefreshing] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "MUSIC" },
    { key: "second", title: "CAPTION" },
  ]);

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

  const handleStickyItemPress = () => alert("pressed");
  const handleCaptionChange = (val) => setCaption(val);

  let data = [];
  UserStore.followingDetails
    .map((user) => data.push(user.image))
    .fill(0)
    .map((_, index) => ({ id: `item-${index}` }));

  // configs
  const ITEM_WIDTH = 65;
  const ITEM_HEIGHT = 65;
  const STICKY_ITEM_WIDTH = 24;
  const STICKY_ITEM_HEIGHT = 24;
  const STICKY_ITEM_BACKGROUNDS = ["#222", "#000"];
  const SEPARATOR_SIZE = 8;
  const BORDER_RADIUS = 30;

  const StickyItemView = ({
    x,
    threshold,
    itemWidth,
    itemHeight,
    stickyItemWidth,
    stickyItemHeight,
    separatorSize,
    isRTL,
  }) => sticky_item_view();

  const renderItemSticky = ({ item, index }) => (
    <ImageBackground
      key={`item-${index}`}
      source={{ uri: data[index] }}
      style={{
        width: 65,
        height: 65,
      }}
      imageStyle={{ borderRadius: 30 }}
    ></ImageBackground>
  );

  let recentPostsMarkup = recent_posts_markup();

  const FirstRoute = () => first_route(selectedValue);

  const SecondRoute = () => second_route(caption, selectedValue);

  const ThirdRoute = () => third_route(caption);

  const makePost = () => {
    axios
      .post(
        "https://europe-west1-projectmelo.cloudfunctions.net/api/post",
        {
          trackID: UserStore.trackDetails.id,
          spotifyID: UserStore.spotifyUserDetails.user_id,
          body: caption,
          status: "Track",
        },
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
            // console.log(res.data);
            UserStore.allPosts = res.data;
            UserStore.enablePostScreen = false;
            setIndex(0);
            setCaption("");
            setPickerHeader(true);
            setCaptionHeader(false);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  // newPosts = () => {
  //   UserStore.isnewPostsAvailable = false
  //   UserStore.allPosts = UserStore.newPosts
  //   console.log(UserStore.newPosts.length, UserStore.newPosts.length)
  // }

  if (!UserStore.enablePostScreen) {
    return (
      <View style={{ backgroundColor: "#292929", flex: 1 }}>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "#292929",
            borderBottomColor: "#fff",
            borderBottomWidth: 2,
          }}
        >
          <ParallaxScrollView
            backgroundColor="#292929"
            contentBackgroundColor="#292929"
            parallaxHeaderHeight={95}
            renderScrollComponent={() => (
              <AnimatedCustomScrollView
                refreshControl={
                  <RefreshControl
                    refreshing={refreshing}
                    onRefresh={onRefresh}
                    tintColor="#1DB954"
                  />
                }
              />
            )}
            renderStickyHeader={() => (
              <View
                style={{
                  padding: 5,
                  marginLeft: 10,
                  marginRight: 10,
                  marginBottom: 10,
                  backgroundColor: "#272D2D",
                  borderWidth: 0,
                  borderColor: "#fff",
                  borderRadius: 15,
                  minHeight: 80,
                  borderBottomWidth: 3,
                }}
              >
                <StickyItemFlatList
                  itemWidth={ITEM_WIDTH}
                  itemHeight={ITEM_HEIGHT}
                  separatorSize={SEPARATOR_SIZE}
                  borderRadius={BORDER_RADIUS}
                  stickyItemWidth={STICKY_ITEM_WIDTH}
                  stickyItemHeight={STICKY_ITEM_HEIGHT}
                  stickyItemBackgroundColors={STICKY_ITEM_BACKGROUNDS}
                  stickyItemContent={StickyItemView}
                  onStickyItemPress={handleStickyItemPress}
                  data={data}
                  renderItem={renderItemSticky}
                />
              </View>
            )}
            stickyHeaderHeight={90}
            // renderBackground = {0}
            renderForeground={() => (
              <View
                style={{
                  padding: 5,
                  marginLeft: 10,
                  marginRight: 10,
                  marginBottom: 10,
                  backgroundColor: "#272D2D",
                  borderWidth: 0,
                  borderColor: "green",
                  borderRadius: 15,
                  minHeight: 80,
                  flexDirection: "row",
                  alignItems: "center",
                }}
              >
                <View style={{ flex: 1, marginRight: 5 }}>
                  {/* <TouchableOpacity onPress={handleStickyItemPress}>
                    <LinearGradient
                      colors={["#272D2D", "#272D2D"]}
                      style={styles.signIn}
                    >
                      <FontAwesome
                        name="plus-circle"
                        size={30}
                        style={{
                          color: "#fff",
                          // padding: 4,
                          // alignSelf: "center",
                          borderRadius: 20,
                          opacity: 0.75,
                        }}
                      />
                      <Text style = {{color : '#fff'}}>Post</Text>
                    </LinearGradient>
                  </TouchableOpacity> */}
                </View>
                <View style={{ flex: 1, marginRight: 5 }}>
                  <TouchableOpacity onPress={() => search(data.track)}>
                    <LinearGradient
                      colors={["#272D2D", "#272D2D"]}
                      style={styles.signIn}
                    >
                      <MaterialCommunityIcons
                        name="circle"
                        color="#fff"
                        size={50}
                      />
                    </LinearGradient>
                  </TouchableOpacity>
                </View>
                <View style={{ flex: 1, marginRight: 5 }}>
                  {/* <TouchableOpacity onPress={() => search(data.track)}>
                    <LinearGradient
                      colors={["#272D2D", "#272D2D"]}
                      style={styles.signIn}
                    >
                      <FontAwesome
                        name="inbox"
                        size={30}
                        style={{
                          color: "#fff",
                          // padding: 4,
                          // alignSelf: "center",
                          borderRadius: 20,
                          opacity: 0.75,
                        }}
                      />
                      <Text style = {{color : '#fff'}}>Inbox</Text>
                    </LinearGradient>
                  </TouchableOpacity> */}
                </View>
              </View>
            )}
          >
            <View style={{ paddingTop: 10 }}>
              <LinearGradient
                colors={["#292929", "#292929", "#292929", "#292929", "#292929"]}
              >
                {/* { UserStore.isnewPostsAvailable == true &&
                  <TouchableOpacity onPress = {newPosts}>
                    <View
                      style={{
                        backgroundColor: "#000",
                        opacity: 0.4,
                        height: 50,
                        flex: 1,
                        marginLeft: 10,
                        marginRight: 10,
                        marginBottom: 5,
                        borderRadius: 15,
                        justifyContent: "center",
                        alignSelf: "center",
                        padding: 15,
                      }}
                    >
                      <Text
                        style={{
                          textAlign: "center",
                          fontWeight: "bold",
                          color: "#fff",
                        }}
                      >
                        new post(s) available...
                      </Text>
                    </View>
                  </TouchableOpacity>
                } */}

                <View>{recentPostsMarkup}</View>
                {/* explore */}
              </LinearGradient>
            </View>
          </ParallaxScrollView>
        </SafeAreaView>
        <TouchableWithoutFeedback
          onPress={() => {
            setPickerHeader(true);
            setCaptionHeader(false);
            setIndex(0);

            UserStore.enablePostScreen = true;
          }}
        >
          <View
            style={{
              backgroundColor: "white",
              height: 50,
              width: 50,
              position: "absolute",
              bottom: 20,
              right: 20,
              borderRadius: 15,
              justifyContent: "center",
              alignItems: "center",
              opacity: 0.8,
            }}
          >
            <FontAwesome
              name="plus-circle"
              size={40}
              style={{
                color: "#000",
                // padding: 4,
                // alignSelf: "center",
                borderRadius: 20,
                opacity: 0.75,
              }}
            />
          </View>
        </TouchableWithoutFeedback>
      </View>
    );
  } else {
    const renderScene = SceneMap({
      first: FirstRoute,
      second: SecondRoute,
    });

    const renderTabBar = (props) => render_tab_bar(props);

    const onIndexChange = (index) => {
      setIndex(index);
      if (index == 0) {
        setPickerHeader(true);
        setCaptionHeader(false);
      } else if (index == 1) {
        setPickerHeader(false);
        setCaptionHeader(true);
      } else {
        setPickerHeader(false);
        setCaptionHeader(false);
      }
    };
    return (
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <KeyboardAvoidingView
          style={{ flex: 1, backgroundColor: "#292929" }}
          behavior="padding"
        >
          <SafeAreaView style={{ flex: 1 }}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flexDirection: "row",
                  // backgroundColor: "#000",
                  opacity: 0.7,
                  margin: 10,
                  borderRadius: 25,
                }}
              >
                <View
                  style={{ padding: 10, flex: 1, justifyContent: "center" }}
                >
                  <TouchableOpacity
                    onPress={() => (UserStore.enablePostScreen = false)}
                  >
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                      }}
                    >
                      <MaterialCommunityIcons
                        name="step-backward"
                        size={30}
                        color="#fff"
                      />
                    </View>
                  </TouchableOpacity>
                </View>

                <View
                  style={{
                    flex: 1,
                    padding: 10,
                    backgroundColor: "#292929",
                  }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <MaterialCommunityIcons
                      name="circle"
                      color="#fff"
                      size={50}
                    />
                  </View>
                </View>
                <View
                  style={{ padding: 10, flex: 1, justifyContent: "center" }}
                >
                  { index == 1 &&
                    <TouchableOpacity onPress={makePost}>
                      <View
                        style={{
                          justifyContent: "center",
                          alignItems: "center",
                        }}
                      >
                        <MaterialCommunityIcons
                          name="step-forward"
                          size={30}
                          color="#fff"
                        />
                      </View>
                    </TouchableOpacity>
                  }
                </View>
              </View>
              {captionHeader == false && pickerHeader == true ? (
                <View>
                  <View
                    style={{
                      backgroundColor: "yellow",
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    <Picker
                      selectedValue={selectedValue}
                      onValueChange={(itemValue, itemIndex) =>
                        setSelectedValue(itemValue)
                      }
                      itemStyle={{
                        color: "#fff",
                      }}
                    >
                      {/* <Picker.Item label="Lyric" value="lyric" />
                      <Picker.Item label="Playlist" value="playlist" /> */}
                      <Picker.Item label="Track" value="track" />
                      {/* <Picker.Item label="Album" value="album" />
                      <Picker.Item label="Artist" value="artist" /> */}
                    </Picker>
                  </View>

                  <View></View>
                </View>
              ) : captionHeader == true && pickerHeader == false ? (
                <KeyboardAvoidingView style = {{flex : 1}} >
                <View
                  style={[
                    {
                      flex: 1,
                      padding : 5
                    },
                  ]}
                >
                  <View style={{ flexDirection: "row", flex: 1 }}>
                    <View style={{ flex: 1, justifyContent : 'center' }}>
                      <Image
                        source={{
                          uri: UserStore.spotifyUserDetails.user_image,
                        }}
                        style={{
                          height: 50,
                          width: 100,
                          borderRadius: 30,
                          alignSelf: "center",
                          flex: 1,
                        }}
                      />
                    </View>

                    <View style={{ flex: 2, justifyContent : 'center' }}>
                      <TextInput
                        placeholder="say something..."
                        autoCapitalize="none"
                        value={caption}
                        autoCorrect={false}
                        multiline="true"
                        onChangeText={(val) => handleCaptionChange(val)}
                        style={{
                          justifyContent: "center",
                          backgroundColor: "#000",
                          borderRadius: 30,
                          borderColor: "grey",
                          flex: 1,
                          textAlign: "center",
                          fontSize: 20,
                          opacity :0.4,
                          color : 'grey',
                          fontWeight : 'bold'
                        }}
                      />
                    </View>
                  </View>
                </View>
                </KeyboardAvoidingView>
              ) : captionHeader == true && pickerHeader == false ? null : null}
            </View>

            <View style={{ backgroundColor: "green", flex: 2 }}>
              <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                onIndexChange={(index) => onIndexChange(index)}
                initialLayout={initialLayout}
                renderTabBar={renderTabBar}
              />
            </View>
          </SafeAreaView>
        </KeyboardAvoidingView>

        {/*  */}
      </TouchableWithoutFeedback>
    );
  }
}

export default observer(Main);

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
