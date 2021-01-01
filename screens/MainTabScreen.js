import React from "react";
import { createStackNavigator } from "@react-navigation/stack";

import HomeScreen from "./Home.js";
import SearchScreen from "./Search.js";
import Timeline from "./Timeline.js";
import Main from "./Main";

import Icon1 from "react-native-vector-icons/MaterialCommunityIcons";
import MI from "react-native-vector-icons/MaterialIcons";
import Icon from "react-native-vector-icons/Ionicons";
import { createMaterialBottomTabNavigator } from "@react-navigation/material-bottom-tabs";
import Octicons from "react-native-vector-icons/Octicons";
import UserStore from "../stores/UserStore.js";
import { observer } from "mobx-react";

const HomeStack = createStackNavigator();
const UpdatesStack = createStackNavigator();
const PostStack = createStackNavigator();
const Stack = createStackNavigator();
const Tab = createMaterialBottomTabNavigator();

const MainTabScreen = () => {
  return (
    <Tab.Navigator
      initialRouteName="Feed"
      barStyle={{ backgroundColor: "#292929" }}
      activeColor="green"
      style={{ backgroundColor: "tomato" }}
    >
      <Tab.Screen
        name="Main"
        component={Main}
        options={{
          tabBarLabel: "",
          tabBarColor: "#292929",
          tabBarIcon: ({ color }) => <MI name="home" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="Swipe"
        component={HomeScreen}
        options={{
          tabBarLabel: "",
          tabBarColor: "#292929",
          tabBarIcon: ({ color }) => (
            <Icon1 name="gesture-swipe" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Post"
        component={SearchScreen}
        options={{
          tabBarLabel: "",
          tabBarColor: "#292929",
          tabBarIcon: ({ color }) => (
            <MI name="add-circle" color={color} size={26} />
          ),
        }}
      />
      <Tab.Screen
        name="Notifications"
        component={SearchScreen}
        options={{
          tabBarLabel: "",
          tabBarColor: "#292929",
          tabBarIcon: ({ color }) => <Icon1 name="bell" color={color} size={26} />,
        }}
      />
      <Tab.Screen
        name="Search"
        component={SearchScreen}
        options={{
          tabBarLabel: "",
          tabBarColor: "#292929",
          tabBarIcon: ({ color }) => (
            <Octicons name="search" color={color} size={26} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

export default observer(MainTabScreen);
