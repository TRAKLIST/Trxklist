import React, { useEffect } from "react";
import { Image, Text, View, ScrollView, ImageBackground } from "react-native";
import styles from "./styles";
import ProfilePicture from "../../ProfilePicture";
import Icon from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import spotifyAPI from "../../SpotifyAPI";
import TracklistItem from "./TracklistItem";

const Body = ({ thisTrack, caption, status, imageUri }) => {
  console.log(thisTrack.track, "efke");
  let tracklist = thisTrack.track ? (
    thisTrack.track.map((track) => <TracklistItem track={track} />)
  ) : (
    <Text>Loading</Text>
  );
  if (status === "Track") {
    return (
      // <Text source={{ uri: imageUri }} style={styles.image}>
      <View>
        <ImageBackground
          style={[styles.image2, { alignItems: "center" }]}
          source={{ uri: thisTrack.image }}
          imageStyle={{ borderRadius: 15 }}
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

          {/* <TouchableOpacity>
            <View
              style={{
                backgroundColor: "green",
                top: 120,
                height: 150,
                width: 150,
                borderRadius: 100,
                opacity: 0.7,
              }}
            >
              <AntDesign name="play" size={150} color="#fff" />
            </View>
          </TouchableOpacity> */}

          <View
            style={{
              bottom: 0,
              position: "absolute",
              backgroundColor: "#000",
              width: "100%",
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
      <View style={{ flex: 1 }}>
        <View
          style={[
            styles.titleContainer,
            {
              flexDirection: "row",
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <ProfilePicture uri={imageUri} size={40} />
          </View>
          <View style={{ alignSelf: "center", marginLeft: 0, flex: 5 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 15,
                color: "#fff",
                margin: 2,
                fontFamily: "Arial",
                fontWeight: "bold",
                backgroundColor: "transparent",
                textAlign: "center",
              }}
            >
              {thisTrack.name}
            </Text>
            <View>
              <Text
                numberOfLines={1}
                style={{
                  fontWeight: "bold",
                  color: "#44CF6C",
                  padding: 3,
                  textAlign: "center",
                }}
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

        <View
          style={{
            flexDirection: "row",
            margin: 5,
          }}
        >
          <View>
            <Image source={{ uri: thisTrack.image }} style={styles.image} />
          </View>

          <View style={styles.block}>
            <ScrollView style={{ height: 150, padding: 5 }}>
              {tracklist}
            </ScrollView>
          </View>
        </View>

        <View
          style={{
            // backgroundColor: "#000",
            opacity: 0.8,
            padding: 10,
            // borderRadius: 15,
            marginLeft: 10,
            marginRight: 10,
            bottom: 0,
            position: "absolute",
            alignSelf: "center",
          }}
        >
          <View>
            <Text style={[styles.caption]}>{caption}</Text>
          </View>
        </View>
      </View>
    );
  }
};

export default Body;
