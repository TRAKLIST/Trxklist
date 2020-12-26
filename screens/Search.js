import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  ImageBackground,
  Image,
  Button,
  RefreshControl,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Octicons from "react-native-vector-icons/Octicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import * as Animatable from "react-native-animatable";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import axios from "axios";
import spotifyAPI from "../components/SpotifyAPI";
import ADIcon from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

let list;
let array = [];

function wait(timeout) {
  return new Promise((res) => {
    setTimeout(res, timeout);
  });
}

function Search() {
  const [following, setFollowing] = React.useState(false);
  const [refreshing, setRefreshing] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [userDetails, setUserDetails] = React.useState([]);
  const [trackItems, setTrackItems] = React.useState([]);

  const search = () => {
    // setTrackItems([]);
    let trackQuery = {};
    // console.log(val);

    spotifyAPI.searchTracks(searchTerm).then((data) => {
      array = [];
      // console.log(data);
      data.tracks.items.map((item) => {
        let trackQuery = {
          id: item.id,
          title: item.name,
          artist: item.artists[0].name,
          artistID: item.artists[0].id,
          albumName: item.album.name,
          image: item.album.images[0].url,
          releaseDate: item.album.release_date,
          popularity: item.popularity,
          duration: item.duration_ms,
        };
        // console.log(trackQuery)
        array.push(trackQuery);
        // setTrackItems([...trackItems, trackQuery]);
      });
      console.log(array);
    });
  };

  const follow = (recipient) => {
    console.log(recipient, "df");
    axios
      .get(
        `https://europe-west1-projectmelo.cloudfunctions.net/api/user/${recipient}/follow`,
        {
          headers: {
            Authorization: `Bearer ${UserStore.authCode}`,
          },
        }
      )
      .then((res) => {
        // console.log(res, 'vrrsf')
      });
  };

  const unfollow = (recipient) => {
    console.log(recipient, "df");
    axios
      .get(
        `https://europe-west1-projectmelo.cloudfunctions.net/api/user/${recipient}/unfollow`,
        {
          headers: {
            Authorization: `Bearer ${UserStore.authCode}`,
          },
        }
      )
      .then((res) => {
        // console.log(res, 'vrrsf')
      });
  };

  React.useEffect(() => {
    axios
      .get(`https://europe-west1-projectmelo.cloudfunctions.net/api/users`, {
        headers: {
          Authorization: `Bearer ${UserStore.authCode}`,
        },
      })
      .then((res) => {
        // console.log(res.data);
        let array = [];
        res.data.map((users) => {
          array.push({
            user: users.meloID,
            image: users.image,
            bio: users.bio,
            // follow: UserStore.followingDetails.some(item => {
            //     item.meloID == users.meloID
            // })
          });
          // setUserDetails([...userDetails, users.meloID])
          // console.log(users.meloID, 'IJOft')

          // console.log(UserStore.followingDetails.some(item => {
          //     item.meloID == users.meloID
          // }))
        });
        // console.log(UserStore.followingDetails[0], 'erf')
        // console.log(array, 'cgm')
        setUserDetails(array);
        // console.log(UserStore.followingDetails)

        list = userDetails
          .filter((val) => {
            // console.log(val, 'dfweui')
            if (searchTerm.length == "") {
              return UserStore.followingDetails.map((users) => {
                // if(users.meloID.toLowerCase() !== UserStore.userDetails.credentials.meloID){
                users.meloID;
                // }
              });
            } else if (searchTerm.length > 0 && searchTerm.length < 3) {
              return;
            } else if (
              val.user.toLowerCase().includes(searchTerm.toLowerCase())
            ) {
              return val.user;
            } else return;
          })
          .map((user, key) => {
            // console.log(user, 'daye')
            // console.log(meloID.meloID)

            // here

            // for (i = 0; i < UserStore.followingDetails.length; i++) {
            //     if (user.user == users.meloID) {
            //         setUnfollowSetting(true)
            //         break
            //     }
            // }
            // if (unfollowSetting == false) {
            //     let icon = (
            //         <TouchableOpacity style={{ marginRight: 0, marginBottom: 0, right: 15, position: 'absolute' }}>
            //             <SimpleLineIcons name="user-unfollow" size={30} color='#1DB954' style={{ padding: 10 }} />
            //         </TouchableOpacity>
            //     )
            // } else {
            //     let icon = (
            //         <TouchableOpacity style={{ marginRight: 0, marginBottom: 0, right: 15, position: 'absolute' }}>
            //             <SimpleLineIcons name="user-follow" size={30} color='#1DB954' style={{ padding: 10 }} />
            //         </TouchableOpacity>
            //     )
            // }

            return (
              <View
                style={{
                  margin: 8,
                  flexDirection: "row",
                  borderRadius: 10,
                  opacity: 1,
                  borderWidth: 2,
                  borderColor: "#fff",
                }}
              >
                {/* <View style={{ borderLeftWidth: 0, borderColor: '#1DB954', padding: 5 }} /> */}

                <View></View>
                <ImageBackground
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    height: 60,
                    width: "100%",
                    marginRight: 0,
                    opacity: 1,
                  }}
                  imageStyle={{
                    borderTopLeftRadius: 7,
                    borderBottomRightRadius: 7,
                    borderBottomLeftRadius: 7,
                    borderTopRightRadius: 7,
                  }}
                  source={{ uri: user.image }}
                >
                  <View
                    style={{
                      justifyContent: "center",
                      flex: 2,
                      padding: 5,
                      paddingLeft: 20,
                    }}
                  >
                    <View style={{ borderRadius: 5, justifyContent: "center" }}>
                      <Text
                        style={{
                          color: "#fff",
                          alignSelf: "flex-start",
                          padding: 5,
                          backgroundColor: "#1DB954",
                          fontWeight: "bold",
                          fontSize: 15,
                          fontFamily: "sans-serif",
                          opacity: 0.7,
                          borderRadius: 5,
                          overflow: "hidden",
                        }}
                      >
                        {user.user}
                      </Text>
                    </View>
                    <Text
                      style={{
                        marginLeft: 5,
                        color: "#fff",
                        fontWeight: "normal",
                        fontStyle: "italic",
                        fontSize: 14,
                        fontFamily: "sans-serif",
                        fontWeight: "450",
                        fontWeight: "500",
                      }}
                    >
                      {user.bio}
                    </Text>
                  </View>
                  {/* <Button title = "follow" style = {{margin : 5, right : 0, position : 'absolute'}}/> */}

                  {
                    // UserStore.followingDetails.map((users) => {
                    UserStore.followingDetails.some(
                      (users) => user.user == users.meloID
                    ) == true ? (
                      <TouchableOpacity
                        style={{
                          marginRight: 0,
                          marginBottom: 0,
                          right: 15,
                          position: "absolute",
                          backgroundColor: "#A72608",
                          borderRadius: 10,
                        }}
                        onPress={() => unfollow(user.user)}
                      >
                        <SimpleLineIcons
                          name="user-unfollow"
                          size={25}
                          color="#1DB954"
                          style={{ padding: 10 }}
                        />
                      </TouchableOpacity>
                    ) : (
                      <TouchableOpacity
                        style={{
                          marginRight: 0,
                          marginBottom: 0,
                          right: 15,
                          position: "absolute",
                          backgroundColor: "green",
                          borderRadius: 10,
                        }}
                        onPress={() => follow(user.user)}
                      >
                        <SimpleLineIcons
                          name="user-follow"
                          size={25}
                          color="#1DB954"
                          style={{ padding: 10 }}
                        />
                      </TouchableOpacity>
                    )
                    // }
                    // )
                    //     })
                    //         variable = UserStore.followingDetails.some(user.user == users.meloID),
                    //     UserStore.followingDetails.some(user.user == users.meloID) ? true
                    //             return (
                    //                 <TouchableOpacity style={{ marginRight: 0, marginBottom: 0, right: 15, position: 'absolute' }}>
                    //     <SimpleLineIcons name="user-following" size={30} color='#1DB954' style={{ padding: 10 }} />
                    // </TouchableOpacity>
                    //             )
                    //             : null
                    //         }
                    //     })

                    //     UserStore.followingDetails.some((users) => {
                    //         if (user.user == users.meloID) {
                    //     setFollowing(true)
                    //             return (
                    //                 <TouchableOpacity style={{ marginRight: 0, marginBottom: 0, right: 15, position: 'absolute' }}>
                    //     <SimpleLineIcons name="user-following" size={30} color='#1DB954' style={{ padding: 10 }} />
                    // </TouchableOpacity>
                    //             )
                    //         }
                    //     })

                    // UserStore.followingDetails.map((users, key) => {
                    //     if (user.user == users.meloID) {
                    //         setFollowing(true)
                    //         return (
                    //             <TouchableOpacity style={{ marginRight: 0, marginBottom: 0, right: 15, position: 'absolute' }}>
                    //                 <SimpleLineIcons name="user-following" size={30} color='#1DB954' style={{ padding: 10 }} />
                    //             </TouchableOpacity>
                    //         )
                    //     }
                    // })
                  }
                </ImageBackground>

                <View />
              </View>
            );
          });
      })
      .catch((err) => {
        console.log(err);
      });
  });

  const onRefresh = React.useCallback(() => {
    setRefreshing(true);

    wait(2000).then(() => {
      setRefreshing(false);
      // new post
    }, [refreshing]);
  });

  return (
    <View style={styles.container}>
      <LinearGradient colors={["#000", "#A7A2A9"]} style={styles.header}>
        <StatusBar backgroundColor="#009387" barStyle="light-content" />
        <View style={styles.action}>
          <TextInput
            placeholder="Search for users..."
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => setSearchTerm(val)}
          />
          <TouchableOpacity style={{ flex: 1 }} onPress={search}>
            <LinearGradient
              colors={["#000", "#21295c"]}
              style={[styles.signIn]}
            >
              {/* <Entypo
              name="spotify"
              size={30}
              style={{
                color: "#1DB954",
                padding: 4,
                alignSelf: "center",
              }}
            /> */}
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <LinearGradient
        colors={["#A7A2A9", "#A7A2A9", "#000", "#000", "#8D8D92", "#EAEAEB"]}
        style={styles.footer}
      >
        <ScrollView
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              tintColor="#1DB954"
            />
          }
        >
          <LinearGradient
            colors={["#A7A2A9", "#fff"]}
            style={{
              minHeight: Dimensions.get("window").height,
              backgroundColor: "grey",
              margin: 5,
              borderRadius: 20,
              opacity: 0.9,
            }}
          >
            <View
              style={{
                margin: 15,
                padding: 5,
                borderBottomWidth: 3,
                borderColor: "#fff",
                opacity: 1,
                color: "#",
                borderRadius: 0,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>
                profiles
              </Text>
            </View>

            {list}

            {/* <View style={{ margin: 15, padding: 5, borderBottomWidth: 1.5, borderColor: '#1DB954' }}>
                            <Text style={{ color: '#1DB954', fontWeight: 'bold', fontSize: 17, fontStyle: 'italic' }}>Tracks</Text>
                        </View>



                        <View style={{ margin: 15, padding: 5, borderBottomWidth: 1.5, borderColor: '#1DB954' }}>
                            <Text style={{ color: '#1DB954', fontWeight: 'bold', fontSize: 17, fontStyle: 'italic' }}>Artists</Text>
                        </View>

                        <View style={{ margin: 15, padding: 5, borderBottomWidth: 1.5, borderColor: '#1DB954' }}>
                            <Text style={{ color: '#1DB954', fontWeight: 'bold', fontSize: 17, fontStyle: 'italic' }}>Albums</Text>
                        </View>

                        <View style={{ margin: 15, padding: 5, borderBottomWidth: 1.5, borderColor: '#1DB954' }}>
                            <Text style={{ color: '#1DB954', fontWeight: 'bold', fontSize: 17, fontStyle: 'italic' }}>News</Text>
                        </View> */}

            <View
              style={{
                margin: 10,
                padding: 5,
                borderBottomWidth: 3,
                borderColor: "#fff",
                opacity: 1,
                color: "#",
                borderRadius: 0,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>
                tracks
              </Text>
              {array.map((track) => {
                return (
                    <View style={{ flexDirection: "row", margin: 5, width : '100%'}}>
                      <View style = {{ flex: 1 }}>
                        <Image
                          source={{ uri: track.image }}
                          style={{ height: 50, width: 50, borderRadius: 30 }}
                        />
                      </View>
                      <View
                        style={{
                          justifyContent: "center",
                          padding: 10,
                          marginBottom: 3,
                          flex: 2,
                        }}
                      >
                        <Text numberOfLines={1}>{track.title}</Text>
                        <Text numberOfLines = {1}>{track.artist}</Text>
                      </View>
                      <View style={{ flex: 1, flexDirection: "row", }}>
                        {/* icons */}

                        <TouchableOpacity style = {{ justifyContent : 'center', margin : 5 }}>
                          <View style={styles.iconContainer2}>
                            {/* {isSaved ? (
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
                            )} */}
                            <MaterialCommunityIcons
                              name="content-save-outline"
                              size={27}
                              color={"#44CF6C"}
                            />
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity style = {{ justifyContent : 'center', margin : 5 }}>
                          <View style={[styles.iconContainer2]}>
                            {/* {isLiked ? (
                              <ADIcon
                                name="heart"
                                size={25}
                                color={"#44CF6C"}
                                style={{ marginTop: 8, paddingBottom: 4 }}
                              />
                            ) : (
                              <ADIcon
                                name="hearto"
                                size={25}
                                color={"#44CF6C"}
                                style={{ marginTop: 8, paddingBottom: 4 }}
                              />
                            )} */}
                            <ADIcon
                              name="hearto"
                              size={25}
                              color={"#44CF6C"}
                            />
                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                );
              })}
            </View>

            {/* <View
              style={{
                margin: 15,
                padding: 5,
                borderBottomWidth: 3,
                borderColor: "#fff",
                opacity: 1,
                color: "#",
                borderRadius: 0,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>
                artists
              </Text>
            </View>

            <View
              style={{
                margin: 15,
                padding: 5,
                borderBottomWidth: 3,
                borderColor: "#fff",
                opacity: 1,
                color: "#",
                borderRadius: 0,
              }}
            >
              <Text style={{ color: "#fff", fontWeight: "900", fontSize: 16 }}>
                albums
              </Text>
            </View> */}
          </LinearGradient>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

export default observer(Search);

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
    borderBottomColor: "#1DB954",
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
    color: "#05375a",
    borderRadius: 10,
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
