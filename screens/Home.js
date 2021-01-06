import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
  Image,
  TouchableOpacity,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import Swiper from "react-native-deck-swiper";
import { TabView, SceneMap } from "react-native-tab-view";
import { ProgressBar } from "react-native-paper";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import spotifyAPI from "../components/SpotifyAPI";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import axios from "axios";

import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";

const {
  first_route,
  second_route,
  render_tab_bar,
  save_track,
} = require("../handlers/home");

let getArtist = {};
let recommended = {};
let audioFeatures = {};

const initialLayout = { width: Dimensions.get("window").width };
const FirstRoute = (card) => first_route(card);
const SecondRoute = (card) => second_route(card);
const renderTabBar = (props) => render_tab_bar(props);
const saveTrack = (id) => save_track(id);

function wait(timeout) {
  return new Promise((res) => {
    setTimeout(res, timeout);
  });
}

function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue,
    randomIndex;

  // While there remain elements to shuffle...
  while (0 !== currentIndex) {
    // Pick a remaining element...
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    // And swap it with the current element.
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  let str = ''

  // Recommendations - pick 3
  for (i = 0; i < 3; i++) {
    if (str == "") {
      str = `${array[i].id}`;
    } else str = `${str},${array[i].id}`;
  }
  
  UserStore.str = str;
  // console.log(str);

  return str;
}

export class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recommendations: [],
      index: 0,
      routes: [
        { key: "first", title: "ARTIST" },
        { key: "second", title: "TRACK" },
      ],
      cuurentCard: {},
      audioFeatures: {},
      topArtist_flw: [],
      loading: true,
    };
  }

  renderScene = (card) =>
    SceneMap({
      first: () => FirstRoute(card),
      second: () => SecondRoute(card),
    });

  componentDidMount() {
    let startTimeM = new Date().getTime();

    // console.log(shuffle(UserStore.topTracks), 'erge')

    axios
      .get(
        `https://api.spotify.com/v1/recommendations?limit=15&seed_tracks=${UserStore.str}`,
        {
          headers: {
            Authorization: `Bearer ${UserStore.spotifyUserDetails.access_token}`,
          },
        }
      )
      .then((res) => {
        // console.log(res.data)
        res.data.tracks.map((track) => {
          spotifyAPI
            .getArtist(track.artists[0].id)
            .then((response) => {
              getArtist = {
                followers: response.followers.total,
                image: response.images[0].url,
                popularity: response.popularity,
                id: response.id,
                name: response.name,
              };
              return getArtist;
            })
            .then((response) => {
              spotifyAPI
                .getAudioFeaturesForTrack(track.id)
                .then((data) => {
                  audioFeatures = {
                    acousticness: data.acousticness,
                    danceability: data.danceability,
                    energy: data.energy,
                    instrumentalness: data.instrumentalness,
                    liveness: data.liveness,
                    loudness: data.loudness,
                    speechiness: data.speechiness,
                    valence: data.valence,
                  };

                  let array = [];

                  UserStore.followingDetails.map((user) => {
                    JSON.parse(user.topArtists).map((chunk) => {
                      if (chunk.id == response.id) {
                        array.push(user.spotifyID);
                      }
                    });
                    // console.log(array, 'dami')
                  });

                  return {
                    getArtist: response,
                    array: array,
                  };
                })
                .then((response) => {
                  let array = [];
                  // console.log(response.array, 'jsi')
                  if (
                    !(
                      response.array === undefined || response.array.length == 0
                    )
                  ) {
                    response.array.map((user, i) => {
                      spotifyAPI
                        .getUser(user)
                        .then((res) => {
                          return {
                            image: res.images[0].url,
                            getArtist: response.getArtist,
                          };
                        })
                        .then((res) => {
                          let data = {
                            image: res.image,
                            user: user,
                            artist: response.getArtist.name,
                          };
                          this.setState({
                            topArtist_flw: [...this.state.topArtist_flw, data],
                          });
                          if (i == response.array.length - 1) {
                            this.setState(
                              { audioFeatures: audioFeatures },
                              () => {
                                recommended = {
                                  name: track.name,
                                  releaseDate: track.album.release_date,
                                  popularity: track.popularity,
                                  id: track.id,
                                  artistID: res.getArtist.id,
                                  explicit: track.explicit,
                                  artistName: track.artists[0].name,
                                  followers: res.getArtist.followers,
                                  artistPopularity: res.getArtist.popularity,
                                  artistImage: res.getArtist.image,
                                  albumName: track.album.name,
                                  image: track.album.images[0].url,
                                  albumID: track.album.id,
                                  audioFeatures: this.state.audioFeatures,
                                  topArtists_following: this.state
                                    .topArtist_flw,
                                };
                                this.setState({ topArtist_flw: [] });
                                // console.log(recommended, 'tobio', recommended.artistName)
                                this.setState({
                                  recommendations: [
                                    ...this.state.recommendations,
                                    recommended,
                                  ],
                                });
                              }
                            );
                          }
                        });
                    });
                  } else {
                    this.setState({ audioFeatures: audioFeatures }, () => {
                      recommended = {
                        name: track.name,
                        releaseDate: track.album.release_date,
                        popularity: track.popularity,
                        id: track.id,
                        artistID: response.getArtist.id,
                        explicit: track.explicit,
                        artistName: track.artists[0].name,
                        followers: response.getArtist.followers,
                        artistPopularity: response.getArtist.popularity,
                        artistImage: response.getArtist.image,
                        albumName: track.album.name,
                        image: track.album.images[0].url,
                        albumID: track.album.id,
                        audioFeatures: this.state.audioFeatures,
                      };
                      // console.log(recommended, 'tobio', recommended.artistName)
                      this.setState({
                        recommendations: [
                          ...this.state.recommendations,
                          recommended,
                        ],
                      });
                    });
                  }
                });
            })
            .catch((err) => console.log("saduh"));
          return;
        });
        // console.log(this.state.recommendations)
        let durationM = new Date().getTime() - startTimeM;
        this.setState({ loading: false });
        console.log(durationM, "time");
      });
    return;
  }

  render() {
    let swiper = this.state.recommendations ? (
      <Swiper
        cards={this.state.recommendations}
        renderCard={(card, cardIndex) => {
          if (card != null) {
            // if recommendations.length[index - 3] then rerender
            // if( cardIndex - 2 == this.state.recommendations.length - 3) console.log('fetching')
            // console.log(cardIndex - 2, "yo");
            this.setState({
              cuurentCard: this.state.recommendations[cardIndex - 2],
            });
            return (
              <View style={styles.card}>
                <Animatable.View animation={"bounceIn"}>
                  <ImageBackground
                    source={{ uri: card.image }}
                    style={{ height: "100%", width: "100%" }}
                    imageStyle={{ borderRadius: 15 }}
                  >
                    <View
                      style={{
                        width: Dimensions.get("window").width,
                        top: 0,
                        position: "absolute",
                        backgroundColor: "#292929",
                        opacity: 0.85,
                        padding: 5,
                      }}
                    >
                      {card != undefined ? (
                        <View style={{ width: Dimensions.get("window").width }}>
                          <View
                            style={{
                              flexDirection: "row",
                              alignSelf: "center",
                              paddingLeft: 5,
                              paddingRight: 5,
                            }}
                          >
                            <Text
                              numberOfLines={1}
                              style={{ color: "#fff", fontWeight: "bold" }}
                            >
                              {" "}
                              {card.name}
                            </Text>
                            {card.explicit ? (
                              <MaterialIcons
                                name="explicit"
                                size={16}
                                color="#383D3B"
                                style={{
                                  alignSelf: "center",
                                  bottom: 0,
                                  position: "relative",
                                }}
                              />
                            ) : null}
                          </View>

                          <View
                            style={{
                              flexDirection: "row",
                              alignSelf: "center",
                              paddingLeft: 5,
                              paddingRight: 5,
                            }}
                          >
                            {card.albumName != card.name ? (
                              <View
                                style={{
                                  alignSelf: "center",
                                  borderRadius: 3,
                                  bottom: 0,
                                  position: "relative",
                                  flexDirection: "row",
                                }}
                              >
                                <Text
                                  numberOfLines={1}
                                  style={{
                                    color: "#44CF6C",
                                    fontWeight: "bold",
                                  }}
                                >{`${card.artistName} • ${card.albumName}  `}</Text>
                                <MaterialIcons
                                  name="album"
                                  size={16}
                                  style={{ padding: 0, color: "#44CF6C" }}
                                />
                              </View>
                            ) : (
                              <View
                                style={{
                                  alignSelf: "center",
                                  borderRadius: 3,
                                  justifyContent: "center",
                                }}
                              >
                                <Text
                                  numberOfLines={1}
                                  style={{
                                    color: "#44CF6C",
                                    fontWeight: "bold",
                                  }}
                                >
                                  {card.artistName}
                                </Text>
                              </View>
                            )}
                          </View>
                        </View>
                      ) : null}
                    </View>

                    <View
                      style={{
                        bottom: 160,
                        flexDirection: "row",
                        position: "absolute",
                        // backgroundColor: "whitesmoke",
                        borderTopRightRadius: 5,
                        borderTopLefttRadius: 5,
                        width: "100%",
                        opacity: "0.8",
                        justifyContent: "center",
                      }}
                    >
                      {card.topArtists_following != undefined
                        ? card.topArtists_following.map((item) => (
                            <View
                              style={{
                                alignSelf: "center",
                                justifyContent: "center",
                              }}
                            >
                              <Image
                                source={{ uri: item.image }}
                                style={{
                                  height: 50,
                                  width: 50,
                                  borderRadius: 30,
                                  borderColor: "#fff",
                                  marginTop: 1,
                                  alignSelf: "center",
                                  opacity: 1,
                                  borderWidth: 2,
                                  borderColor: "#1DB954",
                                  margin: 3,
                                }}
                              />
                            </View>
                          ))
                        : null}
                    </View>

                    <View
                      style={{
                        position: "absolute",
                        bottom: 0,
                        height: 160,
                        alignSelf: "center",
                        width: "100%",
                      }}
                    >
                      <View style={[styles.scene]}>
                        <LinearGradient
                          colors={["#292929", "#292929", "#292929"]}
                          style={{
                            opacity: 0.9,
                            borderRadius: 25,
                            borderWidth: 3,
                            borderStyle: "dotted",
                            borderColor: "#292929",
                          }}
                        >
                          <View style={{ flexDirection: "row" }}>
                            <Animatable.View
                              // animation={"bounceIn"}
                              style={{
                                width: Dimensions.get("window").width / 2,
                                justifyContent: "center",
                              }}
                            >
                              <ImageBackground
                                source={{ uri: card.artistImage }}
                                style={{ height: "100%", width: "100%" }}
                                imageStyle={{
                                  borderTopRightRadius: 15,
                                  opacity: 0.8,
                                }}
                              ></ImageBackground>
                            </Animatable.View>

                            <View
                              style={{
                                width: Dimensions.get("window").width / 2,
                                justifyContent: "center",
                                alignItems: "center",
                                opacity: 1,
                              }}
                            >
                              <View
                                style={{
                                  top: 0,
                                  position: "absolute",
                                  color: "#fff",
                                }}
                              >
                                <Text
                                  numberOfLines={1}
                                  style={{
                                    color: "#fff",
                                    textAlign: "center",
                                    fontWeight: "bold",
                                    marginTop: 10,
                                  }}
                                >
                                  {card.artistName}
                                </Text>
                                <Text
                                  numberOfLines={1}
                                  style={{ color: "grey", fontWeight: "400" }}
                                >{`${card.followers} followers`}</Text>
                              </View>

                              {/* Support an independent artist */}
                              <View
                                style={{
                                  bottom: 40,
                                  position: "absolute",
                                  flexDirection: "column",
                                }}
                              >
                                <Text
                                  numberOfLines={1}
                                  style={{
                                    fontSize: 14,
                                    padding: 3,
                                    textTransform: "uppercase",
                                    color: "#3A5A40",
                                    fontWeight: "bold",
                                    textAlign: "center",
                                  }}
                                >
                                  {card.artistPopularity < 5
                                    ? "Independent"
                                    : card.artistPopularity < 7
                                    ? "Independent"
                                    : card.artistPopularity < 10
                                    ? "Independent"
                                    : card.artistPopularity < 20
                                    ? "Independent"
                                    : card.artistPopularity < 35
                                    ? "Hustler"
                                    : card.artistPopularity < 50
                                    ? "Next Up?"
                                    : card.artistPopularity < 70
                                    ? "Blown?"
                                    : card.artistPopularity < 90
                                    ? "Fame"
                                    : card.artistPopularity < 95
                                    ? "Icon"
                                    : "VIP"}
                                </Text>
                                <ProgressBar
                                  progress={card.artistPopularity / 100}
                                  color="#1DB954"
                                  style={{ width: 100, height: 15 }}
                                />
                              </View>
                            </View>
                          </View>
                        </LinearGradient>
                      </View>
                    </View>
                  </ImageBackground>
                </Animatable.View>
              </View>
            );
          }
        }}
        onSwiped={(cardIndex) => {
          console.log(cardIndex, this.state.recommendations.length - 1);

          cardIndex == this.state.recommendations.length - 4
            ?   

          // disable swiping for 1 second
            
            axios
                .get(
                  `https://api.spotify.com/v1/recommendations?limit=15&seed_tracks=${shuffle(UserStore.topTracks)}`,
                  {
                    headers: {
                      Authorization: `Bearer ${UserStore.spotifyUserDetails.access_token}`,
                    },
                  }
                )
                .then((res) => {
                  console.log(res.data);
                  res.data.tracks.map((track) => {
                    spotifyAPI
                      .getArtist(track.artists[0].id)
                      .then((response) => {
                        getArtist = {
                          followers: response.followers.total,
                          image: response.images[0].url,
                          popularity: response.popularity,
                          id: response.id,
                          name: response.name,
                        };
                        return getArtist;
                      })
                      .then((response) => {
                        spotifyAPI
                          .getAudioFeaturesForTrack(track.id)
                          .then((data) => {
                            audioFeatures = {
                              acousticness: data.acousticness,
                              danceability: data.danceability,
                              energy: data.energy,
                              instrumentalness: data.instrumentalness,
                              liveness: data.liveness,
                              loudness: data.loudness,
                              speechiness: data.speechiness,
                              valence: data.valence,
                            };

                            let array = [];

                            UserStore.followingDetails.map((user) => {
                              JSON.parse(user.topArtists).map((chunk) => {
                                if (chunk.id == response.id) {
                                  array.push(user.spotifyID);
                                }
                              });
                              // console.log(array, 'dami')
                            });

                            return {
                              getArtist: response,
                              array: array,
                            };
                          })
                          .then((response) => {
                            let array = [];
                            // console.log(response.array, 'jsi')
                            if (
                              !(
                                response.array === undefined ||
                                response.array.length == 0
                              )
                            ) {
                              response.array.map((user, i) => {
                                spotifyAPI
                                  .getUser(user)
                                  .then((res) => {
                                    return {
                                      image: res.images[0].url,
                                      getArtist: response.getArtist,
                                    };
                                  })
                                  .then((res) => {
                                    let data = {
                                      image: res.image,
                                      user: user,
                                      artist: response.getArtist.name,
                                    };
                                    this.setState({
                                      topArtist_flw: [
                                        ...this.state.topArtist_flw,
                                        data,
                                      ],
                                    });
                                    if (i == response.array.length - 1) {
                                      this.setState(
                                        { audioFeatures: audioFeatures },
                                        () => {
                                          recommended = {
                                            name: track.name,
                                            releaseDate:
                                              track.album.release_date,
                                            popularity: track.popularity,
                                            id: track.id,
                                            artistID: res.getArtist.id,
                                            explicit: track.explicit,
                                            artistName: track.artists[0].name,
                                            followers: res.getArtist.followers,
                                            artistPopularity:
                                              res.getArtist.popularity,
                                            artistImage: res.getArtist.image,
                                            albumName: track.album.name,
                                            image: track.album.images[0].url,
                                            albumID: track.album.id,
                                            audioFeatures: this.state
                                              .audioFeatures,
                                            topArtists_following: this.state
                                              .topArtist_flw,
                                          };
                                          this.setState({ topArtist_flw: [] });
                                          // console.log(recommended, 'tobio', recommended.artistName)
                                          this.setState({
                                            recommendations: [
                                              ...this.state.recommendations,
                                              recommended,
                                            ],
                                          });
                                        }
                                      );
                                    }
                                  });
                              });
                            } else {
                              this.setState(
                                { audioFeatures: audioFeatures },
                                () => {
                                  recommended = {
                                    name: track.name,
                                    releaseDate: track.album.release_date,
                                    popularity: track.popularity,
                                    id: track.id,
                                    artistID: response.getArtist.id,
                                    explicit: track.explicit,
                                    artistName: track.artists[0].name,
                                    followers: response.getArtist.followers,
                                    artistPopularity:
                                      response.getArtist.popularity,
                                    artistImage: response.getArtist.image,
                                    albumName: track.album.name,
                                    image: track.album.images[0].url,
                                    albumID: track.album.id,
                                    audioFeatures: this.state.audioFeatures,
                                  };
                                  // console.log(recommended, 'tobio', recommended.artistName)
                                  this.setState({
                                    recommendations: [
                                      ...this.state.recommendations,
                                      recommended,
                                    ],
                                  });
                                }
                              );
                            }
                          });
                      })
                      .catch((err) => console.log("saduh"));
                    return;
                  });
                  // console.log(this.state.recommendations)
                  let durationM = new Date().getTime() - startTimeM;
                  this.setState({ loading: false });
                  console.log(durationM, "time");
                })
            : null;
        }}
        onSwipedAll={() => console.log("done")}
        verticalSwipe={false}
        onSwipedRight={() => {
          saveTrack(this.state.cuurentCard.id);
          alert(
            `'${this.state.cuurentCard.name}' by ${this.state.cuurentCard.artistName} has been saved to your Spotify library`
          );
        }}
        cardIndex={0}
        backgroundColor={"transparent"}
        stackSize={8}
        stackSeparation={12}
      >
        <ActivityIndicator
          size="large"
          color="#1DB954"
          style={{ top: 300, position: "absolute", alignSelf: "center" }}
        />
      </Swiper>
    ) : (
      <ActivityIndicator size="large" />
    );

    const { index, routes } = this.state;
    if (this.state.loading == false) {
      return (
        <View style={styles.container}>
          <LinearGradient
            colors={["#292929", "#292929", "#292929"]}
            style={styles.header}
          >
            <SafeAreaView
              style={{
                width: Dimensions.get("window").width,
                top: 0,
                position: "absolute",
                alignItems: "center",
              }}
            >
              <View style={{ flex: 1, marginRight: 5 }}>
                {/* <TouchableOpacity onPress={handleStickyItemPress}>
                    <LinearGradient
                      colors={["#272D2D", "#272D2D"]}
                      style={styles.signIn}
                    >
                      <FontAwesome
                        name="plus-circle"
                        size={30}
                        style={{
                          color: "#fff",
                          // padding: 4,
                          // alignSelf: "center",
                          borderRadius: 20,
                          opacity: 0.75,
                        }}
                      />
                      <Text style = {{color : '#fff'}}>Post</Text>
                    </LinearGradient>
                  </TouchableOpacity> */}
              </View>
              <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => search(data.track)}>
                  <LinearGradient
                    colors={["#272D2D", "#272D2D"]}
                    style={styles.signIn}
                  >
                    <MaterialCommunityIcons
                      name="circle"
                      color="#fff"
                      size={25}
                    />
                  </LinearGradient>
                </TouchableOpacity>
              </View>
              <View style={{ flex: 1, marginRight: 5 }}>
                {/* <TouchableOpacity onPress={() => search(data.track)}>
                    <LinearGradient
                      colors={["#272D2D", "#272D2D"]}
                      style={styles.signIn}
                    >
                      <FontAwesome
                        name="inbox"
                        size={30}
                        style={{
                          color: "#fff",
                          // padding: 4,
                          // alignSelf: "center",
                          borderRadius: 20,
                          opacity: 0.75,
                        }}
                      />
                      <Text style = {{color : '#fff'}}>Inbox</Text>
                    </LinearGradient>
                  </TouchableOpacity> */}
              </View>
            </SafeAreaView>

            {swiper}
          </LinearGradient>

          {/* <LinearGradient colors={["#000", "#292929"]} style={styles.footer}>
            <TabView
              navigationState={{ index, routes }}
              renderScene={this.renderScene(this.state.cuurentCard)}
              onIndexChange={(index) => this.setState({ index })}
              initialLayout={initialLayout}
              renderTabBar={renderTabBar}
              sceneContainerStyle={{
                borderBottomLeftRadius: 10,
                borderBottomRightRadius: 10,
              }}
            />
          </LinearGradient> */}
        </View>
      );
    } else {
      return (
        <View style={styles.container}>
          <LinearGradient colors={["#A7A2A9", "#000"]} style={styles.header}>
            <View>
              <View style={{ alignItems: "center", margin: 10 }}>
                <Text style={{ fontWeight: "bold", color: "grey" }}>
                  LOADING RECOMMENDATIONS...
                </Text>
              </View>
              <View>
                <ActivityIndicator size="large" color="blue" />
              </View>
            </View>
          </LinearGradient>

          <LinearGradient
            colors={["#000", "#8D8D92", "#EAEAEB"]}
            style={styles.footer}
          ></LinearGradient>
        </View>
      );
    }
  }
}

export default observer(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A7A2A9",
  },
  card: {
    flex: 1,
    borderRadius: 20,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 2.5,
    borderBottomColor: "#292929",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginTop: 20,
    marginLeft: -20,
    marginRight: -20,
  },
  song: {
    fontSize: 18,
    backgroundColor: "transparent",
    color: "#EEEEFF",
  },
  text: {
    textAlign: "center",
    fontSize: 15,
    color: "#EEEEFF",
  },
  artist: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 3,
    color: "#1DB954",
    fontWeight: "300",
  },
  scene: {
    flex: 1,
    borderBottomRightRadius: 15,
    borderBottomLeftRadius: 15,
  },
  header: {
    flex: 3,
    justifyContent: "center",
  },
  footer: {
    flex: 1.5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 10,
  },
  signIn: {
    padding: 0,
    alignContent: "center",
    borderRadius: 10,
  },
});
