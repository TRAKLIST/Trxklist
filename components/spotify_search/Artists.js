import React from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  Platform,
} from "react-native";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import spotifyAPI from "../SpotifyAPI";

export default function Artists(props) {
  // const [isSaved, setIsSave] = React.useState(false);
  // React.useEffect(() => {
  //   spotifyAPI
  //     .isFollowingArtists([props.artist.id])
  //     .then((response) => {
  //       if (response[0] === true) {
  //         setIsSave(true);
  //       }
  //     })
  //     .catch((err) => {
  //       setIsSave(false);
  //       console.log(err);
  //     });
  // }, []);

  // const onSavePressed = () => {
  //   if (!isSaved) {
  //     setIsSave(true);
  //     spotifyAPI
  //       .followArtists([props.artist.id])
  //       .then((response) => {
  //         //   console.log(response);
  //       })
  //       .catch((err) => {
  //         setIsSave(false);
  //         console.log(err);
  //       });
  //   }
  // };

  return (
    <View>
      <TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            margin: 5,
            width: "100%",
            borderBottomWidth: 1,
            padding: 10,
          }}
        >
          <View style={{ flegx: 1 }}>
            <ImageBackground
              source={{ uri: props.artist.image }}
              style={{
                height: 65,
                width: 65,
              }}
              imageStyle={{
                borderRadius: 30,
              }}
            >
              <View
                style={{
                  bottom: 0,
                  position: "absolute",
                  backgroundColor: "#44CF6C",
                  borderRadius: 60,
                  borderWidth: 0,
                  // borderColor: "#44CF6C",
                  height: 30,
                  width: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  opacity: 0.8,
                }}
              >
                <Fontisto
                  name="spotify"
                  color="#fff"
                  size={11}
                  style={{ padding: 2 }}
                />
              </View>
            </ImageBackground>
          </View>
          <View
            style={{
              justifyContent: "center",
              padding: 10,
              marginBottom: 3,
              flex: 2,
              // backgroundColor : 'red'
            }}
          >
            <Text
              numberOfLines={1}
              style={{ color: "#fff", fontWeight: "bold", marginLeft: 20 }}
            >
              {props.artist.title}
            </Text>
            <Text
              numberOfLines={1}
              style={{ color: "#44CF6C", fontWeight: "bold", marginLeft: 20 }}
            >{`${props.artist.followers} followers`}</Text>
          </View>
          {/* <View style={{ flex: 0.5, flexDirection: "row" }}>

            <TouchableOpacity
              style={{ justifyContent: "center", margin: 5 }}
              onPress={onSavePressed}
            >
              <View style={styles.iconContainer2}>
                {isSaved ? (
                  <MaterialCommunityIcons
                    name="content-save"
                    size={27}
                    color={"#44CF6C"}
                    style={{ marginTop: 8, paddingBottom: 4 }}
                  />
                ) : (
                  <MaterialCommunityIcons
                    name="content-save-outline"
                    size={27}
                    color={"#44CF6C"}
                    style={{ marginTop: 8, paddingBottom: 4 }}
                  />
                )}
              </View>
            </TouchableOpacity>
          </View> */}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEAEB",
  },
  header: {
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    paddingBottom: 25,
    paddingTop: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "transparent",
    paddingHorizontal: 5,
    // borderRadius: 20
    // paddingVertical: 30,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
  },
  action: {
    backgroundColor: "#fff",
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
    padding: 5,
    borderRadius: 15,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 5,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    padding: 10,
    color: "#fff",
    borderRadius: 10,
    fontWeight: "bold",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 50,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logo: {
    width: "100%",
    height: "100%",
    // backgroundColor: "whitesmoke",
    borderRadius: 20,
  },
  iconContainer2: {
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },
});