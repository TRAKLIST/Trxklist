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
    <SafeAreaView>
      <ScrollView>
        <View style={{ backgroundColor: "#000" }}>{recentPostsMarkup}</View>
      </ScrollView>
    </SafeAreaView>
  );
}
