import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Categories from "./Categories";
import Search from "./Search";
import People from "./People";
import Tracks from "./Tracks"
import Artists from "./Artists"
import Albums from "./Albums"
import LyricsNav from "./LyricsNav"
const Stack = createStackNavigator();

export default function AltSwitchboard() {
  return (
    <Stack.Navigator
    screenOptions={{
      headerStyle: {
        backgroundColor: "#292929",
      },
      headerTintColor: "grey",
    }}>
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="Users" component={People} />
      <Stack.Screen name="Lyrics" component={Tracks} />
      <Stack.Screen name="Artists" component={Artists} />
      <Stack.Screen name="Albums" component={Albums} />
    </Stack.Navigator>
  );
}
