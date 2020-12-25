import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  RefreshControl,
  Text,
  Image,
  Button,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Modal,
  TouchableOpacity,
  StatusBar,
  Picker,
  TextInput,
  ImageBackground,
} from "react-native";

import Post from "../components/Post";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import axios from "axios";
import StickyItemFlatList from "@gorhom/sticky-item";
import * as Animatable from "react-native-animatable";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import { LinearGradient } from "expo-linear-gradient";

// dummy data
const data = [...Array(20)]
  .fill(0)
  .map((_, index) => ({ id: `item-${index}` }));

// configs
const ITEM_WIDTH = 100;
const ITEM_HEIGHT = 100;
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
}) => {
  const amazingAnimation = {
    // here you add your custom interactive animation
    // based on the animated value `x`
  };

  return <Animatable.View style={amazingAnimation} />;
};

const renderItem = ({ item, index }) => (
  <View
    key={`item-${index}`}
    style={{
      backgroundColor: "green",
      width: ITEM_WIDTH,
      height: ITEM_HEIGHT,
      borderRadius: 30,
    }}
  />
);

const renderItemSticky = ({ item, index }) => (
  <View
    key={`item-${index}`}
    style={{
      backgroundColor: "green",
      width: 65,
      height: 65,
      borderRadius: 30,
    }}
  />
);
const handleStickyItemPress = () => Alert.alert("Sticky Item Pressed");

export default function Main() {
  let recentPostsMarkup = UserStore.allPosts ? (
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
  return (
    <View style={{ backgroundColor: "black", flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        {/* <StickyItemFlatList
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
        renderItem={renderItem}
      /> */}
        {/* <ScrollView>
        <View style={{ backgroundColor: "#000" }}>{recentPostsMarkup}</View>
      </ScrollView> */}

        <ParallaxScrollView
          // backgroundColor="blue"
          contentBackgroundColor="black"
          parallaxHeaderHeight={110}
          renderStickyHeader={() => (
            <View style={{ padding: 5 }}>
              <StickyItemFlatList
                itemWidth={65}
                itemHeight={65}
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
          stickyHeaderHeight={80}
          renderForeground={() => (
            <View style={{ padding: 5 }}>
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
                renderItem={renderItem}
              />
            </View>
          )}
        >
          <View style={{ paddingTop: 10 }}>
            <LinearGradient colors={["#000", "#8D8D92", "#EAEAEB", "#8D8D92", "#000"]}>
              <View>{recentPostsMarkup}</View>
              {/* explore */}
            </LinearGradient>
          </View>
        </ParallaxScrollView>
      </SafeAreaView>
    </View>
  );
}
