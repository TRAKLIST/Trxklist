import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./Home.js";
import UpdatesScreen from "./Updates.js";
import SpotifyScreen from "./Spotify.js";
import SearchScreen from "./Search.js";
import Timeline from "./Timeline.js";

import Icon1 from "react-native-vector-icons/MaterialCommunityIcons";
import MI from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/Ionicons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Octicons from "react-native-vector-icons/Octicons";
import UserStore from "../stores/UserStore.js";
import { observer } from "mobx-react";
import axios from "axios";

const HomeStack = createStackNavigator();
const UpdatesStack = createStackNavigator();
const PostStack = createStackNavigator();
const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      barStyle={{ backgroundColor: "#EAEAEB" }}
      activeColor="#1DB954"
      style={{ backgroundColor: "tomato" }}
    >
      <Tab.Screen
        name="Swipe"
        component={HomeScreen}
        options={{
          tabBarLabel: "",
          tabBarColor: "#fff",
          tabBarIcon: ({ color }) => (
            <Icon1 name="gesture-swipe" color={color} size={26} />
          ),
        }}
      />
      {/* <Tab.Screen
        name="Me"
        component={TimelineStackScreen}
        options={{
          tabBarLabel: "",
          tabBarColor: "#004BA8",
          tabBarIcon: ({ color }) => (
            <MI name="track-changes" color={color} size={26} />
          ),
        }}
      /> */}
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: "",
          tabBarColor: "red",
          tabBarIcon: ({ color }) => (
            <Octicons name="search" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default observer(MainTabScreen);
