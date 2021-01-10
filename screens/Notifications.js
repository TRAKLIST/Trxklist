import React from "react";
import { View, Text, SafeAreaView, ScrollView } from "react-native";
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import { useFocusEffect } from "@react-navigation/native";
import axios from "axios";

function Notifications() {
  useFocusEffect(
    React.useCallback(() => {
      console.log("hi");
      // mark notification read
      let notificationIDs = [];

      let unreadNotificationsIds = UserStore.notifications
        .filter((not) => !not.read)
        .map((not) => not.postID);
      // this.props.markNotificationsRead(unreadNotificationsIds);

      console.log(unreadNotificationsIds, 'fevcih')

      axios
        .post(
          "https://europe-west1-projectmelo.cloudfunctions.net/api/notifications",
          unreadNotificationsIds
        )
        .then((res) => {
          console.log(res);
        })
        .catch((err) => console.log("didnt work"));
    }, [])
  );

  dayjs.extend(relativeTime);
  let item = UserStore.notifications.map((notification) => {
    if (notification.type == "like") {
      return (
        <View
          style={{
            height: 70,
            backgroundColor: notification.read ? "#FFF8E7" : "green",
            width: "100%",
            marginTop: 5,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
          }}
        >
          <View></View>
          <View>
            <Text style={{ fontWeight: "bold", color: "#292929" }}>{`${
              notification.sender
            } liked your post ${dayjs(
              notification.createdAt
            ).fromNow()}.`}</Text>
          </View>
          <View></View>
        </View>
      );
    } else if (notification.type == "save") {
      return (
        <View
          style={{
            height: 70,
            backgroundColor: notification.read ? "#FFF8E7" : "green",
            width: "100%",
            marginTop: 5,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
          }}
        >
          <View></View>
          <View>
            <Text style={{ fontWeight: "bold", color: "#292929" }}>{`${
              notification.sender
            } saved a track you listed ${dayjs(
              notification.createdAt
            ).fromNow()}.`}</Text>
          </View>
          <View></View>
        </View>
      );
    } else if (notification.type == "follow") {
      return (
        <View
          style={{
            height: 70,
            backgroundColor: notification.read ? "#FFF8E7" : "green",
            width: "100%",
            marginTop: 5,
            justifyContent: "center",
            alignItems: "center",
            borderRadius: 20,
          }}
        >
          <View></View>
          <View>
            <Text style={{ fontWeight: "bold", color: "#292929" }}>{`${
              notification.sender
            } followed you ${dayjs(notification.createdAt).fromNow()}.`}</Text>
          </View>
          <View></View>
        </View>
      );
    }
  });

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#292929" }}>
      <SafeAreaView>{item}</SafeAreaView>
    </ScrollView>
  );
}

export default observer(Notifications);
