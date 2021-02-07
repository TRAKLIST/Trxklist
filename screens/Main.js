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
import Entypo from "react-native-vector-icons/Entypo";
import Icon from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import Fontisto from "react-native-vector-icons/Fontisto";
import { set } from "mobx";

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
  const [selectedValue, setSelectedValue] = React.useState("Track");
  const [refreshing, setRefreshing] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [loading, setLoading] = React.useState(true);
  const [routes] = React.useState([
    { key: "first", title: "MUSIC" },
    { key: "second", title: "CAPTION" },
  ]);

  React.useEffect(() => {
    setTimeout(() => {
      setLoading(false)
    }, 3000)
    
  }, [])

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
    .map((user) => {
      console.log(user, "efe");
      let data1 = {
        image: user.image,
        user: user.meloID,
      };
      data.push(data1);
    })
    .fill(0)
    .map((_, index) => ({ id: `item-${index}` }));

  // configs
  const ITEM_WIDTH = 65;
  const ITEM_HEIGHT = 65;
  const STICKY_ITEM_WIDTH = 24;
  const STICKY_ITEM_HEIGHT = 24;
  const STICKY_ITEM_BACKGROUNDS = ["#222", "#000"];
  const SEPARATOR_SIZE = 15;
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
    <View
      style={{
        width: 45,
      }}
    >
      <ImageBackground
        key={`item-${index}`}
        source={{ uri: data[index].image }}
        style={{
          width: 45,
          height: 45,
        }}
        imageStyle={{ borderRadius: 15 }}
      ></ImageBackground>
      <View style={{ paddingTop: 5 }}>
        <Text
          numberOfLines={1}
          style={{
            color: "grey",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: 11,
          }}
        >
          {data[index].user}
        </Text>
      </View>
    </View>
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
          status: selectedValue,
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

  if (loading == false) {
    return (
      <View style={{ backgroundColor: "transparent", flex: 1 }}>
        <SafeAreaView
          style={{
            flex: 1,
            backgroundColor: "grey",
            borderBottomColor: "grey",
            borderBottomWidth: 2,
          }}
        >
          <ParallaxScrollView
            backgroundColor="transparent"
            contentBackgroundColor="transparent" // transparent
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
              <View style={{ flex: 1, backgroundColor: "#292929", padding: 0 }}>
                <View
                  style={{
                    flex: 1,
                    backgroundColor: "grey",
                    borderBottomRightRadius: 50,
                  }}
                >
                  <View style={{ flex: 1 }}></View>
                  <View style={{ flex: 1, justifyContent : 'center' }}>
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
                  <View style={{ flex: 1 }}></View>
                </View>
              </View>
            )}
          >
            <View style={{ padding: 0, backgroundColor: "grey" }}>

              <View
                style={{
                  backgroundColor: "#292929",
                  borderTopLeftRadius: 50,
                  paddingTop : index == 0 ? 45 : 0
                }}
              >
                {recentPostsMarkup}
              </View>
              {/* explore */}
            </View>
          </ParallaxScrollView>
        </SafeAreaView>
      </View>
    );
  } else if (loading == true){
    return(
      <View style = {{backgroundColor :'#292929', flex : 1, justifyContent : 'center', alignItems : 'center'}} >
        <Text style = {{color : 'grey', fontSize : 30}}>some fancy loading page with a nice animation...</Text>
      </View>
    )
  }
}

export default observer(Main);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#007bff",
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
