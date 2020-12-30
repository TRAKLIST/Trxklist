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
import FontAwesome from "react-native-vector-icons/FontAwesome";
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
import Fontisto from "react-native-vector-icons/Fontisto";
import User from "../components/User";

let list;
let array = [];
let array1 = [];
let array2 = [];
let array3 = [];
let soundcloud_tracks = [];
let isFollowing = false
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
  // const [isFollowing, setIsFollowing] = React.useState(false);

  const search = () => {
    axios
      .get(
        `https://api-v2.soundcloud.com/search/tracks?q=${searchTerm}&client_id=NpVHurnc1OKS80l6zlXrEVN4VEXrbZG4&limit=20`
      )
      .then((res) => {
        // let trackQuery = {};
        // console.log(res.data, 'fg')
        res.data.collection.map((track) => {
          let trackQuery = {
            urn: track.urn,
            title: track.title,
            user_or_artist: track.user.username,
            verified: track.user.verified,
            image: track.artwork_url,
            // releaseDate: track.album.release_date,
          };
          soundcloud_tracks.push(trackQuery);
        });
        // console.log(soundcloud_tracks, "yf");
      });

    spotifyAPI.searchTracks(searchTerm).then((data) => {
      array = [];
      //   console.log(data);
      data.tracks.items.map((item) => {
        axios
          .get(
            `https://api.musixmatch.com/ws/1.1/track.lyrics.get?format=jsonp&callback=callback&track_isrc=${item.external_ids.isrc}&apikey=7a375fb4e8e03a7c2f911057ebeb14d9`
          )
          .then((res) => {
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
      } else if (val.user.toLowerCase().includes(searchTerm.toLowerCase())) {
        return val.user;
      } else return;
    })
    .map((user, key) => {

      userDetails.map((user1) => {
        // console.log(isFollowing)
        user1.follow === undefined
          ? null
          : user1.follow.has(user.user) ? isFollowing = true : isFollowing = false
      });

      return <User user={user} isFollowing = {isFollowing} />;
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
            ? // then push
              following.add(users.meloID)
            : null;
          array.push({
            user: users.meloID,
            image: users.image,
            bio: users.bio,
            follow: following,
          });
          
          // setUserDetails([...userDetails, users.meloID])
          // console.log(users.meloID, 'IJOft')

          // console.log(UserStore.followingDetails.some(item => {
          //     item.meloID == users.meloID
          // }))
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
          <View style={[styles.action, { backgroundColor: "#292929" }]}>
            <TextInput
              placeholder="Search for users and music"
              style={[styles.textInput]}
              autoCapitalize="none"
              onChangeText={(val) => setSearchTerm(val)}
            />
            <TouchableOpacity style={{ flex: 1 }} onPress={search}>
              <LinearGradient
                colors={["#000", "#21295c"]}
                style={[styles.signIn]}
              >
                <ADIcon
                  name="find"
                  size={30}
                  style={{
                    color: "#1DB954",
                    padding: 4,
                    alignSelf: "center",
                  }}
                />
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
                  {/* <Text
                    style={{
                      color: "#fff",
                      fontWeight: "900",
                      fontSize: 16,
                      textAlign: "center",
                    }}
                  >
                    profiles
                  </Text> */}

                  {list}
                </View>

                {soundcloud_tracks.map((track, index) => {
                  return (
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
                        <View style={{ flex: 1 }}>
                          <ImageBackground
                            source={{ uri: track.image }}
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
                                backgroundColor: "#ff7700",
                                borderRadius: 60,
                                borderWidth: 0,
                                borderColor: "#ff7700",
                                height: 30,
                                width: 30,
                                justifyContent: "center",
                                alignItems: "center",
                                opacity: 0.8,
                              }}
                            >
                              <Fontisto
                                name="soundcloud"
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
                          <View style={{ flexDirection: "row" }}>
                            <Text
                              numberOfLines={1}
                              style={{ color: "#ff7700", fontWeight: "bold" }}
                            >
                              {track.user_or_artist}{" "}
                            </Text>
                            {track.verified ? (
                              <Octicons
                                name="verified"
                                size={15}
                                color={"#ff7700"}
                                //   style={{ marginTop: 8, paddingBottom: 4 }}
                              />
                            ) : null}
                          </View>

                          <View style={{ flexDirection: "row" }}></View>
                        </View>
                        <View style={{ flex: 0.5, flexDirection: "row" }}>
                          {/* icons */}

                          {/* <TouchableOpacity
                            style={{ justifyContent: "center", margin: 5 }}
                          >
                            <View style={styles.iconContainer2}>
                              <MaterialCommunityIcons
                                name="content-save-outline"
                                size={27}
                                color={"#ff7700"}
                              />
                            </View>
                          </TouchableOpacity> */}
                          <TouchableOpacity
                            style={{ justifyContent: "center", margin: 5 }}
                          >
                            <View style={[styles.iconContainer2]}>
                              <AntDesign
                                name="staro"
                                size={25}
                                color={"#ff7700"}
                              />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </TouchableOpacity>
                  );
                })}

                {array.map((track, index) => {
                  return (
                    <TouchableOpacity onPress={() => lyricsToggle(index)}>
                      <View
                        style={{
                          flexDirection: "row",
                          margin: 5,
                          width: "100%",
                          borderBottomWidth: 1,
                          padding: 10,
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <ImageBackground
                            source={{ uri: track.image }}
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
                              <AntDesign
                                name="staro"
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

                {array1.map((artist) => {
                  return (
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
                            source={{ uri: artist.image }}
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
                          }}
                        >
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
                              <AntDesign
                                name="staro"
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

                {array2.map((album) => {
                  return (
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
                        <View style={{ flex: 1 }}>
                          <ImageBackground
                            source={{ uri: album.image }}
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
                              <AntDesign
                                name="staro"
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
                {/* </View> */}
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
