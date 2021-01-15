import React from "react";
import { Image, View } from "react-native";
import styles from "./styles";

const ProfilePicture = ({ uri, size = 70, index }) => (
  <View
    style={[
      {
        width: size + 6,
        height: size + 6,
        margin: 7,
        borderRadius: 40,
        borderWidth: 3,
        borderColor: index % 2 == 0 ? "grey" : "#292929",
      },
    ]}
  >
    <Image
      source={{ uri }}
      style={[styles.image, { width: size, height: size }]}
    />
  </View>
);

export default ProfilePicture;
