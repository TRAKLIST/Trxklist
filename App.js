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
import Main from "./screens/Main";
import Home from "./screens/Home";
import Notifications from "./screens/Notifications";
import UserProfile from "./screens/UserProfile";

import * as firebase from "firebase";
import { Use } from "react-native-svg";

var firebaseConfig = {
  apiKey: "AIzaSyC-Wt2ZiKhqAbBv1coYVW4lJiFpo6FggVA",
  authDomain: "projectmelo.firebaseapp.com",
  databaseURL: "https://projectmelo.firebaseio.com",
  projectId: "projectmelo",
  storageBucket: "projectmelo.appspot.com",
  messagingSenderId: "1044108628538",
  appId: "1:1044108628538:web:863f52f5ce8f544a2adb03",
  measurementId: "G-BCHC4MPG0Y",
};
firebase.initializeApp(firebaseConfig);

const notificationsRef = firebase.firestore().collection("notifications");
// const postsRef = firebase.firestore().collection("posts");

const Drawer = createDrawerNavigator();

function App() {
  // console.log = function() {}

  // React.useEffect(() => {
  //   notificationsRef.onSnapshot((querySnapShot) => {
  //     // console.log(querySnapShot, "etrji");
  //     let items = [];
  //     querySnapShot.forEach((doc) => {
  //       items.push(doc.data());
  //     });

  //     items.sort(function (a, b) {
  //       return new Date(b.createdAt) - new Date(a.createdAt);
  //     });

  //     UserStore.notifications = items;
  //   });

  //   // postsRef.onSnapshot((querySnapShot) => {
  //   //   let items = [];
  //   //   querySnapShot.forEach((doc) => {
  //   //     items.push(doc.data());
  //   //   });

  //   //   items.sort(function (a, b) {
  //   //     return new Date(b.createdAt) - new Date(a.createdAt);
  //   //   });

  //   //   UserStore.allPosts = items;

  //   // });

  //   // ref.onCreate((snapshot) => {
  //   //   console.log(snapshot)
  //   // return db
  //   //   .doc(`/posts/${snapshot.data().postID}`)
  //   //   .get()
  //   //   .then((doc) => {
  //   //     if (doc.exists && doc.data().meloID !== snapshot.data().meloID) {
  //   //       console.log('new notifications')
  //   //     }
  //   //     return;
  //   //   })
  //   //   .catch((err) => {
  //   //     console.error(err);
  //   // });
  //   // });
  // }, []);

  return (
    <NavigationContainer>
      {UserStore.isLoggedIn === true ? (
        UserStore.loading === false ? (
          <Drawer.Navigator
            drawerContent={(props) => <DrawerContent {...props} />}
          >
            <Drawer.Screen name="HomeDrawer" component={MainTabScreen} />
            <Drawer.Screen name="Home" component={Main} />
            <Drawer.Screen name="Notifications" component={Notifications} />
            <Drawer.Screen name="Recommendations" component={Home} />
            <Drawer.Screen name="Me" component={UserProfile} />
            {/* <Drawer.Screen name="Settings" component={} />
            <Drawer.Screen name="Support" component={MainTabScreen} /> */}
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
