import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Keyboard,
  TextInput,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import axios from "axios";
import spotifyAPI from "../components/SpotifyAPI";
import ADIcon from "react-native-vector-icons/AntDesign";
import ParallaxScrollView from "react-native-parallax-scroll-view";
import Icon from "react-native-vector-icons/Entypo";
import User from "../components/User";
import Tracks from "../components/spotify_search/Tracks";
import Albums from "../components/spotify_search/Albums";
import Artists from "../components/spotify_search/Artists";
import SoundCloudTracks from "../components/soundcloud_search/Tracks";
import FontAwesome5 from "react-native-vector-icons/FontAwesome5";
import FontAwesome from "react-native-vector-icons/FontAwesome";
let list;
let array = [];
let array1 = [];
let array2 = [];
let soundcloud_tracks = [];
let isFollowing = false;

function People({navigation}) {
  const [userDetails, setUserDetails] = React.useState([]);
  const [index, setIndex] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState("");

  list = userDetails
    .filter((val) => {
      // console.log(val, 'dfweui')
      if (searchTerm.length == "") {
        return UserStore.followingDetails.map((users) => {
          users.meloID;
        });
      } else if (searchTerm.length > 0 && searchTerm.length < 3) {
        return;
      } else if (val.user.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val.user;
      } else return;
    })
    .map((user, key) => {
      userDetails.map((user1) => {
        // console.log(isFollowing)
        user1.follow === undefined
          ? null
          : user1.follow.has(user.user)
          ? (isFollowing = true)
          : (isFollowing = false);
      });

      return index == 0 ? <User user={user} isFollowing={isFollowing} navigation = {navigation} /> : null;
    });

  React.useEffect(() => {
    axios
      .get(`https://europe-west1-projectmelo.cloudfunctions.net/api/users`, {
        headers: {
          Authorization: `Bearer ${UserStore.authCode}`,
        },
      })
      .then((res) => {
        // console.log(res.data);
        let following = new Set();
        let array = [];
        res.data.map((users) => {
          UserStore.followingDetails.some(
            (item) => users.meloID == item.meloID
          ) == true
            ? following.add(users.meloID)
            : null;
          array.push({
            user: users.meloID,
            image: users.image,
            bio: users.bio,
            follow: following,
            createdAt: users.createdAt,
          });
          // console.log(users.meloID, 'IJOft')
        });
        // console.log(UserStore.followingDetails[0], 'erf')
        // console.log(array, "cgm");
        setUserDetails(array);

        // console.log(UserStore.followingDetails)
      })
      .catch((err) => {
        console.log(err);
      });
  });

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
        <View style={{ backgroundColor: "#292929", flex: 1, padding: 10 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              padding: 0,
              backgroundColor: "transparent",
            }}
          >
            {/* search bar */}
            <View style={{ flex: 5, justifyContent: "center", padding: 5 }}>
              <TextInput
                placeholder="Search for stuff"
                autoCapitalize="none"
                style={{
                  justifyContent: "center",
                  backgroundColor: "#000",
                  borderRadius: 30,
                  borderColor: "#fff",
                  borderWidth: 0,
                  textAlign: "center",
                  fontSize: 20,
                  opacity: 0.4,
                  color: "grey",
                  fontWeight: "bold",
                  height: 50,
                }}
                onChangeText={(val) => setSearchTerm(val)}
              />
            </View>
            {/* <View style={{ flex: 1, justifyContent: "center", padding: 5 }}>
                <TouchableOpacity onPress={search}>
                  <View
                    style={{
                      backgroundColor: "#000",
                      opacity: 0.4,
                      borderRadius: 30,
                      height: 50,
                      justifyContent: "center",
                      borderColor: "#fff",
                      borderWidth: 0,
                    }}
                  >
                    <ADIcon
                      name="search1"
                      size={25}
                      style={{
                        color: "#292929",
                        alignSelf: "center",
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </View> */}
          </View>

          <KeyboardAvoidingView
            behavior="padding"
            style={{
              flex: 7,
              backgroundColor: "transparent",
              justifyContent: "flex-start",
            }}
          >
            <ScrollView style={{ padding: 0, backgroundColor: "transparent" }}>
              <LinearGradient
                colors={["#292929", "#292929"]}
                style={{
                  borderRadius: 20,
                  opacity: 0.9,
                }}
              >
                {/* {index == 0 && (
                    <View
                      style={{
                        height: 40,
                        borderRadius: 10,
                        flexDirection: "row",
                      }}
                    >
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: status1 == 0 ? "#fff" : "#292929",

                          borderRadius: 10,
                        }}
                        onPress={() => setStatus1(0)}
                      >
                        <View>
                          <Text
                            style={{
                              color: status1 == 0 ? "#292929" : "#fff",
                              fontWeight: "bold",
                              fontSize: 13,
                            }}
                          >
                            DISCOVER
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: status1 == 1 ? "#fff" : "#292929",
                          borderRadius: 10,
                        }}
                        onPress={() => setStatus1(1)}
                      >
                        <View>
                          <Text
                            style={{
                              color: status1 == 1 ? "#292929" : "#fff",
                              fontWeight: "bold",
                              fontSize: 13,
                            }}
                          >
                            FOLLOWING
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: "transparent",
                          borderRadius: 10,
                          backgroundColor: status1 == 2 ? "#fff" : "#292929",
                        }}
                        onPress={() => setStatus1(2)}
                      >
                        <View>
                          <Text
                            style={{
                              color: status1 == 2 ? "#292929" : "#fff",
                              fontWeight: "bold",
                              fontSize: 13,
                            }}
                          >
                            FOLLOWERS
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )} */}
                <View>{list}</View>
              </LinearGradient>
            </ScrollView>
          </KeyboardAvoidingView>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
}

export default observer(People);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292929",
  },
  header: {
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    paddingBottom: 10,
    paddingTop: 5,
  },
  footer: {
    flex: 3,
    backgroundColor: "transparent",
    paddingHorizontal: 5,
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
    marginTop: 0,
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
    borderRadius: 20,
  },
  iconContainer2: {
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },
});
