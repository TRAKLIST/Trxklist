import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./Home.js";
import UpdatesScreen from "./Updates.js";
import ProfileScreen from "./Profile.js";
import SpotifyScreen from "./Spotify.js";
import PostScreen from "./PostScreen.js";
import SearchScreen from "./Search.js"
import Timeline from './Timeline.js'

import Icon1 from "react-native-vector-icons/MaterialCommunityIcons";
import MI from "react-native-vector-icons/MaterialIcons"
import Icon from "react-native-vector-icons/Ionicons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Octicons from "react-native-vector-icons/Octicons";
import UserStore from "../stores/UserStore.js";
import { observer } from "mobx-react";
import axios from 'axios'

const HomeStack = createStackNavigator();
const UpdatesStack = createStackNavigator();
const PostStack = createStackNavigator();
const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

let recommend = []

const MainTabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      barStyle={{ backgroundColor: '#EAEAEB' }}
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
        name="Spotify"
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

const HomeStackScreen = ({ navigation }) => {


  return (
    // console.log(JSON.parse(UserStore.userDetails.credentials.topArtists)),
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#A7A2A9",
        },
        headerTintColor: "#000",
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "[ • swʌɪp • ]",
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={30}
              backgroundColor="#A7A2A9"
              color="#fff"
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 5 }}
            ></Icon.Button>
          ),
          headerRight: () => (
            <Octicons.Button
              name="settings"
              size={25}
              backgroundColor="#A7A2A9"
              color="#fff"
            ></Octicons.Button>
          ),
        }}
      />
      {/* <HomeStack.Screen name="Updates" component={UpdatesScreen} />
      <HomeStack.Screen name="Me" component={ProfileScreen} />
      <HomeStack.Screen name="Settings" component={SettingsScreen} /> */}
    </HomeStack.Navigator>
  );
};

const TimelineStackScreen = ({ navigation }) => (
  <PostStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#F4F7F5",
      },
      headerTintColor: "#134074",
    }}
  >
    <PostStack.Screen
      name="[ • swʌɪp • ]"
      component={Timeline}
      options={{
        title: "[ • swʌɪp • ]",
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#F4F7F5"
            color="#1DB954"
            onPress={() => navigation.openDrawer()}
          ></Icon.Button>
        ),
      }}
    />
  </PostStack.Navigator>
);

const UpdatesStackScreen = ({ navigation }) => (
  <UpdatesStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#191e3c",
      },
      headerTintColor: "#007bff",
    }}
  >
    <UpdatesStack.Screen
      name="Updates"
      component={UpdatesScreen}
      options={{
        title: "Updates",
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#191e3c"
            color="#007bff"
            onPress={() => navigation.openDrawer()}
          ></Icon.Button>
        ),
      }}
    />
  </UpdatesStack.Navigator>
);

const UserStackScreen = ({ navigation }) => (
  <UpdatesStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#21295c",
      },
      headerTintColor: "#007bff",
    }}
  >
    <UpdatesStack.Screen
      name="Me"
      component={ProfileScreen}
      options={{
        title: "EQUIAKNOW",
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#21295c"
            color="#007bff"
            onPress={() => navigation.openDrawer()}
          ></Icon.Button>
        ),
      }}
    />
  </UpdatesStack.Navigator>
);

const SpotifyStackScreen = ({ navigation }) => (
  <UpdatesStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#F4F7F5",
      },
      headerTintColor: "#007bff",
    }}
  >
    <UpdatesStack.Screen
      name="Spotify"
      component={SearchScreen}
      options={{
        title: "[ • swʌɪp • ]",
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={30}
            backgroundColor="#F4F7F5"
            color="#007bff"
            onPress={() => navigation.openDrawer()}
            style={{ marginLeft: 5 }}
          ></Icon.Button>
        ),
        headerRight: () => (
          <Octicons.Button
            name="settings"
            size={25}
            backgroundColor="#F4F7F5"
            color="#007bff"
          ></Octicons.Button>
        ),
      }}
    />
  </UpdatesStack.Navigator>
);
