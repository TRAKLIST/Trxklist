import React, { useEffect } from "react";
import { Image, Text, View, ScrollView, ImageBackground } from "react-native";
import styles from "./styles";
import ProfilePicture from "../../ProfilePicture";
import Icon from "react-native-vector-icons/Entypo";
import { TouchableOpacity } from "react-native-gesture-handler";


const Body = ({ thisTrack, caption, status, imageUri }) => {
  let tracklist = thisTrack.track ? (
    thisTrack.track.map((track) => <Text style={styles.track}>{track}</Text>)
  ) : (
    <Text>Loading</Text>
  );
  if (status === "Track") {
    return (
      // <Text source={{ uri: imageUri }} style={styles.image}>
      <View>
        <ImageBackground
          style={[styles.image2, {alignItems : 'center'}]}
          source={{ uri: thisTrack.image }}
          imageStyle = {{borderRadius :15}}
        >
          <View
            style={[
              styles.titleContainer,
              {
                top: 0,
                position: "absolute",
                width: "100%",
                padding: 0,
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
              },
            ]}
          >
            <View style={{ flexDirection: "row" }}>
              <View style={{ flex: 1 }}>
                <ProfilePicture uri={imageUri} size={40} />
              </View>
              <View style={{ alignSelf: "center", marginLeft: 0, flex: 5 }}>
                <Text style={styles.name} numberOfLines={1}>
                  {thisTrack.name}
                </Text>
                <View
                  style={{
                    padding: 0,
                  }}
                >
                  <Text
                    style={{
                      fontWeight: "bold",
                      color: "#44CF6C",
                      padding: 3,
                      textAlign: "center",
                    }}
                    numberOfLines={1}
                  >
                    {thisTrack.artist}
                  </Text>
                </View>
              </View>
              <View
                style={{
                  justifyContent: "center",
                  marginLeft: 0,
                  flex: 1,
                  alignItems: "center",
                }}
              >
                <TouchableOpacity>
                  <Icon name="dots-three-vertical" size={16} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <View
            style={{
              bottom: 0,
              position: "absolute",
              backgroundColor: "#000",
              width : '100%',
              opacity: 0.8,
              padding: 10,
              // borderRadius: 15,
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <View>
              <Text style={styles.caption}>{caption}</Text>
            </View>
          </View>
        </ImageBackground>
        {/* <Image source={{ uri: thisTrack.image }} style={styles.image2} /> */}
        {/* <View>
          <View>
            <Text style={styles.caption}>{caption}</Text>
          </View>
        </View> */}
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
