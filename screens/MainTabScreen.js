import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./Home.js";
import SearchScreen from "./Search.js";
import Timeline from "./Timeline.js";
import Main from "./Main";
import Notifications from "./Notifications";
import AddPost from "./AddPost";
import Profile from './UserProfile'

import Icon1 from "react-native-vector-icons/MaterialCommunityIcons";
import MI from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/Ionicons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Octicons from "react-native-vector-icons/Octicons";
import UserStore from "../stores/UserStore.js";
import { observer } from "mobx-react";
import Home from "./Home.js";
import Search from "./Search.js";
import Categories from "./Categories.js";
import AltSwitchboard from "./AltSwitchboard";

const HomeStack = createStackNavigator();
const MainStack = createStackNavigator();
const SearchStack = createStackNavigator();
const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      barStyle={{ backgroundColor: "#292929" }}
      activeColor="green"
      inactiveColor="grey"
      style={{ backgroundColor: "tomato" }}
    >
      <Tab.Screen
        name="Main"
        component={MainStackScreen}
        options={{
          tabBarLabel: "",
          tabBarColor: "#292929",
          tabBarIcon: ({ color }) => <MI name="home" color={color} size={26} />,
        }}
      />
      {/* <Tab.Screen
        name="Post"
        component={Profile}
        options={{
          tabBarLabel: "",
          tabBarColor: "#292929",
          tabBarIcon: ({ color }) => (
            <MI name="add-circle" color={color} size={26} />
            ),
          }}
        /> */}
      {/* <Tab.Screen
        name="Notifications"
        component={Notifications}
        options={{
          tabBarLabel: "",
          tabBarColor: "#292929",
          tabBarIcon: ({ color }) => <Icon1 name="bell" color={color} size={26} />,
        }}
      /> */}
      <Tab.Screen
        name="Swipe"
        component={Home}
        options={{
          tabBarLabel: "",
          tabBarColor: "#292929",
          tabBarIcon: ({ color }) => (
            <Icon1 name="gesture-swipe" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Search"
        component={AltSwitchboard}
        options={{
          tabBarLabel: "",
          tabBarColor: "#292929",
          tabBarIcon: ({ color }) => (
            <MI name="explore" color={color} size={26} />
            
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default observer(MainTabScreen);

const MainStackScreen = ({ navigation }) => {
  return (
    // console.log(JSON.parse(UserStore.userDetails.credentials.topArtists)),
    <MainStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#292929",
        },
        headerTintColor: "grey",
      }}
    >
      <MainStack.Screen
        name="Home"
        component={Main}
        options={{
          title: "TRAKLIST.",
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={30}
              backgroundColor="#292929"
              color="grey"
              onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 5 }}
            ></Icon.Button>
          ),
          headerRight: () => (
            <Icon.Button
              name="ios-send"
              size={25}
              backgroundColor="#292929"
              color="grey"
              onPress={() => navigation.navigate("POST.")}
            ></Icon.Button>
          ),
        }}
      />
      <MainStack.Screen name="POST." component={AddPost} />
      {/* <HomeStack.Screen name="Me" component={ProfileScreen} />
      <HomeStack.Screen name="Settings" component={SettingsScreen} /> */}
    </MainStack.Navigator>
  );
};

const SearchStackScreen = ({ navigation }) => {
  return (
    // console.log(JSON.parse(UserStore.userDetails.credentials.topArtists)),
    <SearchStack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: "#292929",
        },
        headerTintColor: "grey",
      }}
    >
      <SearchStack.Screen
        name="Home"
        component={CategoriesStack}
        options={{
          title: "SEARCH.",
          headerLeft: () => (
            <Icon.Button
              name="ios-menu"
              size={30}
              backgroundColor="#292929"
              color="#fff"
              // onPress={() => navigation.openDrawer()}
              style={{ marginLeft: 5 }}
            ></Icon.Button>
          ),
          headerRight: () => (
            <Icon.Button
              name="ios-settings"
              size={25}
              backgroundColor="#292929"
              color="#fff"
              // onPress={() => setPostScreen(!postScreen)}
            ></Icon.Button>
          ),
        }}
      />
      {/* <SearchStack.Screen name="Updates" component={UpdatesScreen} />
      <SearchStack.Screen name="Me" component={ProfileScreen} />
      <SearchStack.Screen name="Settings" component={SettingsScreen} /> */}
    </SearchStack.Navigator>
  );
};
