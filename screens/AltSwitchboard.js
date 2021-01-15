import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import Categories from "./Categories";
import Search from "./Search";

const Stack = createStackNavigator();

export default function AltSwitchboard() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Categories" component={Categories} />
      <Stack.Screen name="Search" component={Search} />
      {/* <Stack.Screen name="Profile" component={Profile} />
      <Stack.Screen name="Settings" component={Settings} /> */}
    </Stack.Navigator>
  );
}
