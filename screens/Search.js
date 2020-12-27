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
  Modal,
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
import ParallaxScrollView from "react-native-parallax-scroll-view";
import Icon from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";

let list;
let array = [];
let array1 = [];
let array2 = [];
let array3 = [];
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
  const [lyricsPage, setLyricsPage] = React.useState(false);
  const [trackIndex, setTrackIndex] = React.useState();
  const [trackItems, setTrackItems] = React.useState([]);

  const search = () => {
    // musixmatch
    // axios
    //   .get(
    //     `https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_isrc=${trackQuery.isrc}&apikey=7a375fb4e8e03a7c2f911057ebeb14d9`
    //   )
    //   .then((res) => {
    //     console.log(res.data);
    //   });

    spotifyAPI.searchTracks(searchTerm).then((data) => {
      array = [];
      console.log(data);
      data.tracks.items.map((item) => {
        axios
          .get(
            `https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_isrc=${item.external_ids.isrc}&apikey=7a375fb4e8e03a7c2f911057ebeb14d9`
          )
          .then((res) => {
            console.log(
              JSON.parse(res.data.substring(9, res.data.length - 2)).message
                .body.lyrics.lyrics_body,
              "regfw"
            );
            return JSON.parse(res.data.substring(9, res.data.length - 2))
              .message.body.lyrics.lyrics_body;
          })
          .then((res) => {
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
              isrc: item.external_ids.isrc,
              lyrics: res,
            };
            array.push(trackQuery);
          });

        // console.log(trackQuery)

        // setTrackItems([...trackItems, trackQuery]);
      });
      // console.log(array);
    });

    spotifyAPI.searchArtists(searchTerm).then((data) => {
      array1 = [];
      // console.log(data);
      data.artists.items.map((item) => {
        let artistQuery = {
          id: item.id,
          title: item.name,
          artist: item.name,
          image: item.images[0].url,
          followers: item.followers.total,
        };
        // console.log(trackQuery)
        array1.push(artistQuery);
        // setTrackItems([...trackItems, trackQuery]);
      });
      // console.log(array);
    });

    spotifyAPI.searchAlbums(searchTerm).then((data) => {
      array2 = [];
      // console.log(data);
      data.albums.items.map((item) => {
        let albumQuery = {
          id: item.id,
          title: item.name,
          artist: item.artists[0].name,
          image: item.images[0].url,
        };
        // console.log(trackQuery)
        array2.push(albumQuery);
        // setTrackItems([...trackItems, trackQuery]);
      });
      // console.log(array);
    });

    // spotifyAPI.searchPlaylists(searchTerm).then((data) => {
    //   array3 = [];
    //   // console.log(data);
    //   data.playlists.items.map((item) => {
    //     let playlistQuery = {
    //       id: item.id,
    //       title: item.name,
    //       artist: item.owner.display_name,
    //       image: item.images[0].url,
    //     };
    //     console.log(playlistQuery, 'jtjr')
    //     array3.push(playlistQuery);
    //     // setTrackItems([...trackItems, trackQuery]);
    //   });
    //   // console.log(array);
    // });
  };

  const lyricsToggle = (index) => {
    setTrackIndex(index);
    setLyricsPage(true);
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
              <TouchableOpacity>
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
                      <View
                        style={{ borderRadius: 5, justifyContent: "center" }}
                      >
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
                </View>
              </TouchableOpacity>
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

  if (lyricsPage == false) {
    return (
      <View style={styles.container}>
        <LinearGradient colors={["#000", "#000"]} style={styles.header}>
          <StatusBar backgroundColor="#009387" barStyle="light-content" />
          <View style={[styles.action, {backgroundColor : '#292929'}]}>
            <TextInput
              placeholder="Search for users..."
              style={[styles.textInput]}
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
        <LinearGradient colors={["#000", "#292929"]} style={styles.footer}>
          {/* {lyricsPage == false ? ( */}
          <Animatable.View
            animation="bounceInUp"
            style={{
              height: "100%",
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
            }}
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
                colors={["#292929", "#292929"]}
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
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "900",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    profiles
                  </Text>

                  {list}
                </View>

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
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "900",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    tracks
                  </Text>
                  {array.map((track, index) => {
                    return (
                      <TouchableOpacity onPress={() => lyricsToggle(index)}>
                        <View
                          style={{
                            flexDirection: "row",
                            margin: 5,
                            width: "100%",
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <Image
                              source={{ uri: track.image }}
                              style={{
                                height: 65,
                                width: 65,
                                borderRadius: 30,
                              }}
                            />
                          </View>
                          <View
                            style={{
                              justifyContent: "center",
                              padding: 0,
                              marginBottom: 3,
                              flex: 2,
                            }}
                          >
                            <Text
                              numberOfLines={1}
                              style={{ color: "#fff", fontWeight: "bold" }}
                            >
                              {track.title}
                            </Text>
                            <Text
                              numberOfLines={1}
                              style={{ color: "#44CF6C", fontWeight: "bold" }}
                            >
                              {track.artist}
                            </Text>
                          </View>
                          <View style={{ flex: 1, flexDirection: "row" }}>
                            {/* icons */}

                            <TouchableOpacity
                              style={{ justifyContent: "center", margin: 5 }}
                            >
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
                            <TouchableOpacity
                              style={{ justifyContent: "center", margin: 5 }}
                            >
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
                      </TouchableOpacity>
                    );
                  })}
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
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "900",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    artists
                  </Text>

                  {array1.map((artist) => {
                    return (
                      <TouchableOpacity>
                        <View
                          style={{
                            flexDirection: "row",
                            margin: 5,
                            width: "100%",
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <Image
                              source={{ uri: artist.image }}
                              style={{
                                height: 65,
                                width: 65,
                                borderRadius: 30,
                              }}
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
                            {/* <Text numberOfLines={1} style={{ color: "#fff", fontWeight: "bold" }}>{album.title}</Text>
                            <Text numberOfLines={1} style = {{ color: "#44CF6C", fontWeight: "bold" }}>{album.artist}</Text> */}
                            <Text
                              numberOfLines={1}
                              style={{ color: "#fff", fontWeight: "bold" }}
                            >
                              {artist.title}
                            </Text>
                            <Text
                              numberOfLines={1}
                              style={{ color: "#44CF6C", fontWeight: "bold" }}
                            >{`${artist.followers} followers`}</Text>
                          </View>
                          <View style={{ flex: 1, flexDirection: "row" }}>
                            {/* icons */}

                            <TouchableOpacity
                              style={{ justifyContent: "center", margin: 5 }}
                            >
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
                            <TouchableOpacity
                              style={{ justifyContent: "center", margin: 5 }}
                            >
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
                      </TouchableOpacity>
                    );
                  })}
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
                  <Text
                    style={{
                      color: "#fff",
                      fontWeight: "900",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    albums
                  </Text>

                  {array2.map((album) => {
                    return (
                      <TouchableOpacity>
                        <View
                          style={{
                            flexDirection: "row",
                            margin: 5,
                            width: "100%",
                          }}
                        >
                          <View style={{ flex: 1 }}>
                            <Image
                              source={{ uri: album.image }}
                              style={{
                                height: 65,
                                width: 65,
                                borderRadius: 30,
                              }}
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
                            <Text
                              numberOfLines={1}
                              style={{ color: "#fff", fontWeight: "bold" }}
                            >
                              {album.title}
                            </Text>
                            <Text
                              numberOfLines={1}
                              style={{ color: "#44CF6C", fontWeight: "bold" }}
                            >
                              {album.artist}
                            </Text>
                          </View>
                          <View style={{ flex: 1, flexDirection: "row" }}>
                            {/* icons */}

                            <TouchableOpacity
                              style={{ justifyContent: "center", margin: 5 }}
                            >
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
                            <TouchableOpacity
                              style={{ justifyContent: "center", margin: 5 }}
                            >
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
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </LinearGradient>
            </ScrollView>
          </Animatable.View>
          {/* ) : null} */}
        </LinearGradient>
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, backgroundColor: "#292929" }}>
        <ParallaxScrollView
          backgroundColor="#292929"
          contentBackgroundColor="#292929"
          parallaxHeaderHeight={300}
          // renderBackground={() => (
          //   <ImageBackground
          //     // source={{ uri: array[trackIndex].image }}
          //     source = {{uri : 'https://media.npr.org/assets/img/2020/05/01/dsc_9182_re-1-_wide-de77c30d600c1cfa4ba6e822db63328b5125c113-s800-c85.jpg'}}
          //     style={{
          //       height: 300,
          //       flex: 1,
          //       alignItems: "center",
          //       justifyContent: "center",
          //     }}
          //     imageStyle={{
          //       // borderBottomLeftRadius: 15,
          //       // borderBottomRightRadius: 15,
          //       borderRadius: 15,
          //       paddingHorizontal: 10,
          //     }}
          //   >
          //   </ImageBackground>
          // )}
          renderForeground={() => (
            <ImageBackground
              source={{ uri: array[trackIndex].image }}
              style={{
                height: 300,
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
              imageStyle={{
                // borderBottomLeftRadius: 15,
                // borderBottomRightRadius: 15,
                borderRadius: 15,
                paddingHorizontal: 10,
              }}
            >
              <SafeAreaView
                style={[
                  styles.titleContainer,
                  {
                    top: 0,
                    position: "absolute",
                    width: "100%",
                    padding: 10,
                    borderTopLeftRadius: 15,
                    borderTopRightRadius: 15,
                    backgroundColor: "#000",
                    opacity: 0.7,
                  },
                ]}
              >
                <View style={{ flexDirection: "row" }}>
                  <TouchableOpacity onPress={() => setLyricsPage(false)}>
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignSelf: "center",
                        padding: 10,
                      }}
                    >
                      {/* <Image
                      source={{ uri: UserStore.spotifyUserDetails.user_image }}
                      style={{ borderRadius: 20, height: 50, width: 50 }}
                    /> */}
                      <Icon name="back" size={20} color="#fff" />
                    </View>
                  </TouchableOpacity>

                  <View style={{ alignSelf: "center", marginLeft: 0, flex: 5 }}>
                    <View>
                      <Text
                        style={{
                          textAlign: "center",
                          color: "#fff",
                          fontWeight: "bold",
                        }}
                        numberOfLines={1}
                      >
                        {array[trackIndex].title}
                      </Text>
                    </View>
                    <View
                      style={{
                        padding: 0,
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: "bold",
                          color: "#44CF6C",
                          padding: 0,
                          textAlign: "center",
                        }}
                        numberOfLines={1}
                      >
                        {`${array[trackIndex].artist}`}
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
                      <Icon name="dots-three-vertical" size={20} color="#fff" />
                    </TouchableOpacity>
                  </View>
                </View>
              </SafeAreaView>
            </ImageBackground>
          )}
        >
          <View>
            {/* <Text>Scroll me</Text> */}
            <Animatable.View
              animation="bounceInUp"
              style={{
                backgroundColor: "#292929",
                height: "100%",
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15,
                paddingHorizontal: 10,
              }}
            >
              {/* <Button title="return" onPress={() => setLyricsPage(false)} /> */}
              <ScrollView style={{ padding: 5, marginTop: 5 }}>
                <Text style={{ color: "#CCCCCC", fontSize: 20 }}>
                  {array[trackIndex].lyrics}
                </Text>
              </ScrollView>
            </Animatable.View>
          </View>
        </ParallaxScrollView>
      </View>
    );
  }
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
