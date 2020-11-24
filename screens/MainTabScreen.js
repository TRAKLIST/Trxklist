import React, { useEffect } from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./Home.js";
import UpdatesScreen from "./Updates.js";
import ProfileScreen from "./Profile.js";
import SpotifyScreen from "./Spotify.js";
import PostScreen from "./PostScreen.js";

import Icon1 from "react-native-vector-icons/MaterialCommunityIcons";
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
      activeColor="#007bff"
      style={{ backgroundColor: "tomato" }}
    >
      <Tab.Screen
        name="Swipe"
        component={HomeStackScreen}
        options={{
          tabBarLabel: "Swipe",
          tabBarColor: "#fff",
          tabBarIcon: ({ color }) => (
            <Icon1 name="gesture-swipe" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Me"
        component={HomeStackScreen}
        options={{
          tabBarLabel: "Me",
          tabBarColor: "#fff",
          tabBarIcon: ({ color }) => (
            <Icon name="ios-person" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Spotify"
        component={SpotifyStackScreen}
        options={{
          tabBarLabel: "Spotify",
          tabBarColor: "#1DB954",
          tabBarIcon: ({ color }) => (
            <Icon1 name="spotify" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default observer(MainTabScreen);

const HomeStackScreen = ({ navigation }) => {
  const [postScreen, setPostScreen] = React.useState(false);
  const [recommendArray, setRecommendArray] = React.useState([])

  useEffect;

  useEffect(() => {
    axios.get(`https://api.spotify.com/v1/recommendations?limit=15&seed_tracks=${UserStore.str}`, {
      headers: {
        Authorization: `Bearer ${UserStore.spotifyUserDetails.access_token}`
      }
    }).then((res) => {
      // console.log(res.data)
      res.data.tracks.map((track) => {
        let recommended = {
          name: track.name,
          popularity: track.popularity,
          id: track.id,
          explicit: track.explicit,
          artistName: track.artists[0].name,
          albumName: track.album.name,
          image: track.album.images[0].url,
          albumID: track.album.id
        }
        // console.log(recommended)

        recommend.push(recommended)
      })
      console.log(recommend)
      console.log('guy')
      setRecommendArray([...recommendArray, recommend])

      console.log(recommendArray)
      console.log('dem')

    })
  }, []);

  return (
    // console.log(JSON.parse(UserStore.userDetails.credentials.topArtists)),
    <HomeStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#F4F7F5",
        },
        headerTintColor: "#007bff",
      }}
    >
      <HomeStack.Screen
        name="Home"
        component={HomeScreen}
        options={{
          title: "[ swʌɪp•ɪf•ʌɪ ]",
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
      {/* <HomeStack.Screen name="Updates" component={UpdatesScreen} />
      <HomeStack.Screen name="Me" component={ProfileScreen} />
      <HomeStack.Screen name="Settings" component={SettingsScreen} /> */}
    </HomeStack.Navigator>
  );
};

const PostStackScreen = ({ navigation }) => (
  <PostStack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#191e3c",
      },
      headerTintColor: "#007bff",
    }}
  >
    <PostStack.Screen
      name="Post"
      component={PostScreen}
      options={{
        title: "Post",
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
        backgroundColor: "#1DB954",
      },
      headerTintColor: "white",
    }}
  >
    <UpdatesStack.Screen
      name="Spotify"
      component={SpotifyScreen}
      options={{
        title: "Certified Lover Boy : A Side",
        headerLeft: () => (
          <Icon.Button
            name="ios-menu"
            size={25}
            backgroundColor="#1DB954"
            color="#191e3c"
            onPress={() => navigation.openDrawer()}
          ></Icon.Button>
        ),
      }}
    />
  </UpdatesStack.Navigator>
);
