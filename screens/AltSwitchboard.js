import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Categories from "./Categories";
import Search from "./Search";
import People from "./People";
import Tracks from "./Lyrics"
import Artists from "./Artists"
import Albums from "./Albums"
import OtherProfiles from "./OtherProfiles"
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
      <Stack.Screen name="CATEGORIES." component={Categories} />
      <Stack.Screen name="SEARCH." component={Search} />
      <Stack.Screen name="USERS." component={People} />
      <Stack.Screen name="LYRICS." component={Tracks} />
      <Stack.Screen name="ARTISTS." component={Artists} />
      <Stack.Screen name="ALBUMS." component={Albums} />
      <Stack.Screen name="PROFILE." component={OtherProfiles} />
    </Stack.Navigator>
  );
}
