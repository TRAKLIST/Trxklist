import { StatusBar } from "expo-status-bar";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { DrawerContent } from "./screens/DrawerContent";

import MainTabScreen from "./screens/MainTabScreen";
import RootStackScreen from "./screens/RootStackScreen";
import LoadingPage from "./screens/LoadingPage";
import { AuthSession } from "expo";
import UserStore from "./stores/UserStore";
import { observer } from "mobx-react";

const Drawer = createDrawerNavigator();

function App() {
  console.log = function() {}
  return (
    <NavigationContainer>
      {UserStore.isLoggedIn === true ? (
        UserStore.loading === false ? (
          <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
          >
            <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
          </Drawer.Navigator>
        ) : (
          <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
          >
            <Drawer.Screen name="HomeDrawer" component={LoadingPage} />
          </Drawer.Navigator>
        )
      ) : (
        <RootStackScreen />
      )}
    </NavigationContainer>
  );
}

export default observer(App);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
