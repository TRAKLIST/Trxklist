import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
  ImageBackground,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import Swiper from "react-native-deck-swiper";
import { TabView, SceneMap } from "react-native-tab-view";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import spotifyAPI from "../components/SpotifyAPI";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import axios from "axios";

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

  reRender = () => {
    this.setState({loading : true})
    let startTimeM = new Date().getTime();
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
            console.log(cardIndex - 2, "yo");
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
                  ></ImageBackground>
                </Animatable.View>
              </View>
            );
          }
        }}
        onSwiped={(cardIndex) => {
          // topArtists_following = [];
          // if( cardIndex - 2 == this.state.recommendations.length - 3) console.log('fetching')
        }}
        onSwipedAll={this.reRender}
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
            colors={["#000", "#292929", "#000"]}
            style={styles.header}
          >
            <SafeAreaView
              style={{
                width: Dimensions.get("window").width,
                top: 0,
                position: "absolute",
              }}
            >
              {this.state.cuurentCard != undefined ? (
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
                      {this.state.cuurentCard.name}
                    </Text>
                    {this.state.cuurentCard.explicit ? (
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
                    {this.state.cuurentCard.albumName !=
                    this.state.cuurentCard.name ? (
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
                          style={{ color: "#44CF6C", fontWeight: "bold" }}
                        >{`${this.state.cuurentCard.artistName} • ${this.state.cuurentCard.albumName}  `}</Text>
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
                          style={{ color: "#44CF6C", fontWeight: "bold" }}
                        >
                          {this.state.cuurentCard.artistName}
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              ) : null}
            </SafeAreaView>

            {swiper}
          </LinearGradient>

          <LinearGradient colors={["#000", "#292929"]} style={styles.footer}>
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
          </LinearGradient>
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
    flex: 0.55,
    borderRadius: 20,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 2.5,
    borderBottomColor: "#292929",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginTop: 20,
    marginLeft: -10,
    marginRight: -10,
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
    paddingBottom: 20,
    paddingTop: 50,
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
