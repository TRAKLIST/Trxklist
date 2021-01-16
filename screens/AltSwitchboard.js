import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Categories from "./Categories";
import Search from "./Search";
import People from "./People";
import Tracks from "./Tracks"
const Stack = createStackNavigator();

export default function AltSwitchboard() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="Search" component={Search} />
      <Stack.Screen name="People" component={People} />
      <Stack.Screen name="Tracks" component={Tracks} />
    </Stack.Navigator>
  );
}
