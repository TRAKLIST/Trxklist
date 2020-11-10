import React from "react";
import { Image, Text, View, ScrollView } from "react-native";
import styles from "./styles";
import { v4 as uuidv4 } from "uuid";

const Body = ({ thisTrack, caption, status }) => {
  let tracklist = thisTrack.track ? (
    thisTrack.track.map((track) => (
      <View
        style={{
          borderBottomWidth: 1,
          borderColor: "black",
          borderRadius: 5,
        }}
      >
        <Text key={uuidv4()} style={styles.track}>
          {track}
        </Text>
      </View>
    ))
  ) : (
    <Text>Loading</Text>
  );
  if (status === "Track") {
    return (
      // <Text source={{ uri: imageUri }} style={styles.image}>
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{thisTrack.name}</Text>
          <View
            style={{
              borderRadius: 1,
              backgroundColor: "#007bff",
              borderRadius: 10,
              marginBottom: 5,
            }}
          >
            <Text style={styles.artist}>{thisTrack.artist}</Text>
          </View>
        </View>
        <Image source={{ uri: thisTrack.image }} style={styles.image2} />
        <View>
          <Text style={styles.caption}>{caption}</Text>
        </View>
      </View>
    );
  } else {
    return (
      <View>
        <View style={styles.titleContainer}>
          <Text style={styles.name}>{thisTrack.name}</Text>
          <View
            style={{
              borderRadius: 1,
              backgroundColor: "#007bff",
              borderRadius: 10,
              marginBottom: 5,
            }}
          >
            <Text style={styles.artist}>{thisTrack.artist}</Text>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            marginTop: 3,
            marginBottom: 3,
            backgroundColor: "#fff",
          }}
        >
          <View>
            <Image source={{ uri: thisTrack.image }} style={styles.image} />
          </View>

          <View style={styles.block}>
            <ScrollView style={{ height: 150, borderRadius: 10 }}>
              {tracklist}
            </ScrollView>
          </View>
        </View>

        <View>
          <Text style={styles.caption}>{caption}</Text>
        </View>
      </View>
    );
  }
};

export default Body;
