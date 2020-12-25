import React, { useEffect } from "react";
import { Image, Text, View, ScrollView } from "react-native";
import styles from "./styles";

const Body = ({ thisTrack, caption, status }) => {
  let tracklist = thisTrack.track ? (
    thisTrack.track.map((track) => (
      <Text style={styles.track}>
        {track}
      </Text>
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
              backgroundColor: "#007bff",
              marginBottom: 5,
            }}
          >
            <Text
              style={{
                backgroundColor: "#fff",
                fontWeight: "bold",
                color: "#21295c",
              }}
            >
              {thisTrack.artist}
            </Text>
          </View>
        </View>
        <Image source={{ uri: thisTrack.image }} style={styles.image2} />
        <View>
          <View>
            <Text style={styles.caption}>{caption}</Text>
          </View>
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
              backgroundColor: "#007bff",
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
            <ScrollView style={{ height: 150 }}>{tracklist}</ScrollView>
          </View>
        </View>

        <View>
          <View style={{ backgroundColor: "#007bff" }}>
            <Text style={styles.caption}>{caption}</Text>
          </View>
        </View>
      </View>
    );
  }
};

export default Body;
