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

function Search() {
  const [searchTerm, setSearchTerm] = React.useState("");
  const [userDetails, setUserDetails] = React.useState([]);
  const [lyricsPage, setLyricsPage] = React.useState(false);
  const [index, setIndex] = React.useState(0);
  const [status, setStatus] = React.useState(0);

  const search = () => {
    axios
      .get(
        `https://api-v2.soundcloud.com/search/tracks?q=${searchTerm}&client_id=NpVHurnc1OKS80l6zlXrEVN4VEXrbZG4&limit=20`
      )
      .then((res) => {
        // console.log(res.data, 'fg')
        soundcloud_tracks = [];
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
      });
      // console.log(array);
    });
  };

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

      return index == 0 ? <User user={user} isFollowing={isFollowing} /> : null;
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

  if (UserStore.lyricsPage == false) {
    return (
      <SafeAreaView style={styles.container}>
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <View style={{ backgroundColor: "#292929", flex: 1, padding: 10 }}>
            <View style={{ flex: 1, flexDirection: "row", padding: 5 }}>
              {/* search bar */}
              <View style={{ flex: 5, justifyContent: "center", padding: 5 }}>
                <TextInput
                  placeholder="Search for stuff"
                  autoCapitalize="none"
                  style={{
                    justifyContent: "center",
                    backgroundColor: "#000",
                    borderRadius: 30,
                    borderColor: "grey",
                    textAlign: "center",
                    // fontSize: 20,
                    opacity: 0.4,
                    color: "grey",
                    fontWeight: "bold",
                    height: 50,
                  }}
                  onChangeText={(val) => setSearchTerm(val)}
                />
              </View>
              <View style={{ flex: 1, justifyContent: "center", padding: 5 }}>
                <TouchableOpacity onPress={search}>
                  <View
                    style={{
                      backgroundColor: "#000",
                      opacity: 0.4,
                      borderRadius: 30,
                      height: 50,
                      justifyContent: "center",
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
              </View>
            </View>

            <View
              style={{
                flex: 1,
                justifyContent: "center",
              }}
            >
              <View
                style={{
                  height: 50,
                  borderRadius: 10,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: index == 0 ? "#fff" : "#292929",
                    borderColor: index == 1 ? "#292929" : "#fff",
                    margin: 5,
                    borderRadius: 10,
                  }}
                  onPress={() => setIndex(0)}
                >
                  <View>
                    <Text style={{ color: index == 0 ? "#292929" : "#fff" }}>
                      <FontAwesome5
                        name="user-alt"
                        size={20}
                        color={index == 0 ? "#292929" : "#fff"}
                      />
                    </Text>
                  </View>
                </TouchableOpacity>
                <TouchableOpacity
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: index == 1 ? "#fff" : "#292929",
                    borderWidth: 3,
                    borderColor: index == 1 ? "#292929" : "#fff",
                    borderRadius: 10,
                    margin: 5,
                  }}
                  onPress={() => setIndex(1)}
                >
                  <View>
                    <Text style={{ color: index == 1 ? "#292929" : "#fff" }}>
                      <FontAwesome5
                        name="spotify"
                        size={20}
                        color={index == 1 ? "#292929" : "#fff"}
                      />
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
                    margin: 5,
                    borderWidth: 3,
                    borderColor: index == 1 ? "#292929" : "#fff",
                    backgroundColor: index == 2 ? "#fff" : "#292929", //
                  }}
                  onPress={() => setIndex(2)}
                >
                  <View>
                    <Text style={{ color: index == 2 ? "#292929" : "#fff" }}>
                      <FontAwesome5
                        name="soundcloud"
                        size={20}
                        color={index == 2 ? "#292929" : "#fff"}
                      />
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <KeyboardAvoidingView
              behavior="padding"
              style={{
                flex: 7,
                backgroundColor: "transparent",
                justifyContent: "center",
              }}
            >
              <ScrollView
                style={{ padding: 10, backgroundColor: "transparent" }}
              >
                <LinearGradient
                  colors={["#292929", "#292929"]}
                  style={{
                    borderRadius: 20,
                    opacity: 0.9,
                  }}
                >
                  <View>{list}</View>

                  {index == 2 &&
                    soundcloud_tracks.map((track, index) => {
                      return <SoundCloudTracks track={track} />;
                    })}

                  {index == 1 && (
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
                          backgroundColor: status == 0 ? "#fff" : "#292929",

                          borderRadius: 10,
                        }}
                        onPress={() => setStatus(0)}
                      >
                        <View>
                          <Text
                            style={{
                              color: status == 0 ? "#292929" : "#fff",
                              fontWeight: "bold",
                              fontSize: 13,
                            }}
                          >
                            TRACKS
                          </Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={{
                          flex: 1,
                          justifyContent: "center",
                          alignItems: "center",
                          backgroundColor: status == 1 ? "#fff" : "#292929",
                          borderRadius: 10,
                        }}
                        onPress={() => setStatus(1)}
                      >
                        <View>
                          <Text
                            style={{
                              color: status == 1 ? "#292929" : "#fff",
                              fontWeight: "bold",
                              fontSize: 13,
                            }}
                          >
                            ARTISTS
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
                          backgroundColor: status == 2 ? "#fff" : "#292929",
                        }}
                        onPress={() => setStatus(2)}
                      >
                        <View>
                          <Text
                            style={{
                              color: status == 2 ? "#292929" : "#fff",
                              fontWeight: "bold",
                              fontSize: 13,
                            }}
                          >
                            ALBUMS
                          </Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}

                  {index == 1 &&
                    status == 0 &&
                    array.map((track, index) => {
                      return <Tracks track={track} index={index} />;
                    })}

                  {index == 1 &&
                    status == 1 &&
                    array1.map((artist) => {
                      return <Artists artist={artist} />;
                    })}

                  {index == 1 &&
                    status == 2 &&
                    array2.map((album) => {
                      return <Albums album={album} />;
                    })}
                </LinearGradient>
              </ScrollView>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </SafeAreaView>
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
              source={{ uri: array[UserStore.trackIndex].image }}
              style={{
                height: 300,
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
              }}
              imageStyle={{
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
                  <TouchableOpacity
                    onPress={() => (UserStore.lyricsPage = false)}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignSelf: "center",
                        padding: 10,
                      }}
                    >
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
                        {array[UserStore.trackIndex].title}
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
                        {`${array[UserStore.trackIndex].artist}`}
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
              <ScrollView style={{ padding: 5, marginTop: 5 }}>
                <Text style={{ color: "#CCCCCC", fontSize: 20 }}>
                  {array[UserStore.trackIndex].lyrics}
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
