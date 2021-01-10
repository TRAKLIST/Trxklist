import React, { useEffect } from "react";
import { Image, Text, View, ScrollView, ImageBackground } from "react-native";
import styles from "./styles";
import ProfilePicture from "../../ProfilePicture";
import Icon from "react-native-vector-icons/Entypo";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import spotifyAPI from "../../SpotifyAPI";

export default function TracklistItem({ track }) {
  const [isSaved, setIsSave] = React.useState(false);

  React.useEffect(() => {
    spotifyAPI
      .containsMySavedTracks([track.id])
      .then((response) => {
        if (response[0] === true) {
          setIsSave(true);
          // console.log(`Saved ${status}`);
        }
      })
      .catch((err) => {
        setIsSave(false);
        console.log(err);
      });
  }, []);

  const onSavePressed = (trackID) => {
    // console.log(trackID, "SFWE");
    if (!isSaved) {
      setIsSave(true);
      spotifyAPI
        .addToMySavedTracks([trackID])
        .then((response) => {
          // console.log(response);
        })
        .catch((err) => {
          setIsSave(false);
          console.log(err);
        });
    } else {
      setIsSave(false);
      spotifyAPI
        .removeFromMySavedTracks([trackID])
        .then((response) => {
          // console.log(response);
        })
        .catch((err) => {
          setIsSave(true);
          console.log(err);
        });
    }
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <View style={{ flex: 7, justifyContent: "center" }}>
        <Text
          style={[
            styles.track,
            { padding: 5, borderRadius: 5, overflow: "hidden" },
          ]}
          numberOfLines={1}
        >
          {track.title}
        </Text>
      </View>
      <View
        style={{
          flex: 1.5,
          alignItems: "flex-end",
          justifyContent: "center",
          padding: 0,
        }}
      >
        <TouchableOpacity onPress={() => onSavePressed(track.id)}>
          {isSaved ? (
            <MaterialCommunityIcons
              name="content-save"
              size={28}
              color={"#44CF6C"}
            />
          ) : (
            <MaterialCommunityIcons
              name="content-save-outline"
              size={28}
              color={"#44CF6C"}
            />
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
