import React, { Component } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  RefreshControl,
  Text,
  Image,
  Button,
  ActivityIndicator,
  FlatList,
  Dimensions,
  Modal,
  TouchableOpacity,
  StatusBar,
  Picker,
  TextInput,
  ImageBackground,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { ProgressBar } from 'react-native-paper';

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";
import Entypo from "react-native-vector-icons/Entypo";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Swiper from 'react-native-deck-swiper'
import spotifyAPI from '../components/SpotifyAPI'
import Carousel, { Pagination } from 'react-native-snap-carousel';


import { v4 as uuidv4 } from "uuid";

import Post from "../components/Post";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import axios from "axios";

import {
  LineChart,
  BarChart,
  PieChart,
  ProgressChart,
  ContributionGraph,
  StackedBarChart
} from "react-native-chart-kit";

function wait(timeout) {
  return new Promise((res) => {
    setTimeout(res, timeout);
  });
}

let recommend = []

let getArtist = {}

let recommended = {}

let audioFeatures = {}

let topArtists_following = []


const SecondRoute = (card) => {
  if (card != null) {
    if (card.audioFeatures != null) {
      let { acousticness, danceability, energy, instrumentalness, liveness, speechiness } = card.audioFeatures
      // console.log(card.audioFeatures, 'teij')
      return (
        <View style={[styles.scene]}>
          <LinearGradient colors={["#000", "#8D8D92", '#EAEAEB']}>
            <View style={{ flexDirection: 'row' }}>
              <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center', marginBottom: 30 }}>
                <ProgressChart
                  data={{
                    labels: ["acousticness", "danceability", "energy", "instrumentalness", "liveness", "speechiness"], // optional
                    data: [acousticness, danceability, energy, instrumentalness, liveness, speechiness]
                  }}
                  width={Dimensions.get('window').width / 2}
                  height={Dimensions.get('window').width / 2}
                  strokeWidth={5}
                  radius={10}
                  chartConfig={{
                    backgroundGradientFrom: "transparent",
                    backgroundGradientFromOpacity: 0,
                    backgroundGradientTo: "transparent",
                    backgroundGradientToOpacity: 0,
                    color: (opacity = 0.5) => `rgba(29, 185, 84, ${opacity})`,
                    strokeWidth: 2, // optional, default 3
                    barPercentage: 0.5,
                    useShadowColorFromDataset: false // optional
                  }}
                  hideLegend={true}
                />
              </View>
              <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ top: 20, position: 'absolute', color: '#fff', alignContent: 'center' }}>
                  <Text numberOfLines={1} style={{ color: '#fff', textAlign: 'center' }}>RELEASE DATE</Text>
                  <Text numberOfLines={1} style={{ color: 'grey', textAlign: 'center' }}>{card.releaseDate}</Text>
                </View>
                <Text numberOfLines={1} style={{ fontSize: 15, textTransform: "uppercase", color: '#3A5A40', fontWeight: 'bold', }}>
                  {(card.artistPopularity < 5) ? "" : (card.artistPopularity < 7) ? "" : (card.artistPopularity < 10) ? "" : (card.artistPopularity < 20) ? "" : (card.artistPopularity < 35) ? "" : (card.artistPopularity < 50) ? "Tune" : (card.artistPopularity < 70) ? "Bop" : (card.artistPopularity < 90) ? "Hot" : (card.artistPopularity < 95) ? "Banger" : "Banger"}
                </Text>
                <ProgressBar progress={card.artistPopularity / 100} color='#1DB954' style={{ width: 100, height: 15 }} />
              </View>
            </View>
          </LinearGradient>
        </View>
      )
    } else return null
  } else return null
}

const initialLayout = { width: Dimensions.get('window').width };

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: '#1DB954' }}
    style={{ backgroundColor: 'black' }}
    renderLabel={({ route, focused, color }) => (
      <Text style={{ color, margin: 8, fontWeight: 'bold' }}>
        {route.title}
      </Text>
    )}
    activeColor='green'
  />
);

export class HomeScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      recommendations: [],
      index: 0,
      index_carousel: 0,
      routes: [
        { key: 'first', title: 'ARTIST' },
        { key: 'second', title: 'TRACK' },
      ],
      cuurentCard: {},
      audioFeatures: {},
      following_details: [],
      profilePic: '',
      topArtist_flw: [],
    }
  }

  renderScene = (card) => SceneMap({
    first: () => this.FirstRoute(card),
    second: () => SecondRoute(card),
  });

  FirstRoute = (card, topArtist_flw_img) => {
    if (card != null) {
      // console.log(card)
      // console.log(card.topArtists_following, 't') 

      return (
        <View style={[styles.scene]}>

          <LinearGradient colors={["#000", "#8D8D92", '#EAEAEB']} >

            <View style={{ flexDirection: 'row' }}>

              <Animatable.View animation={"bounceIn"} style={{ width: ( Dimensions.get('window').width / 2 ) -10, justifyContent: 'center' }}>
                <ImageBackground source={{ uri: card.artistImage }} style={{ height: '100%', width: '100%' }} imageStyle = {{borderTopRightRadius : 15}}>
                  <View style={{ bottom: 0, flexDirection: 'row', position: 'absolute', backgroundColor: 'whitesmoke', borderTopRightRadius: 5, borderTopLefttRadius: 5, width: '100%', opacity: '0.8', justifyContent: 'center' }}>
                    {card.topArtists_following != undefined ?
                      card.topArtists_following.map((item) => (
                        <View style={{ alignSelf: 'center', justifyContent: 'center' }}>
                          <Image source={{ uri: item.image }} style={{ height: 30, width: 30, borderRadius: 10, borderColor: '#fff', marginTop: 5, alignSelf: 'center', opacity: 1, borderWidth: 2, borderColor: '#1DB954', margin: 5 }} />
                        </View>
                      )
                      ) : null
                    }
                  </View>
                </ImageBackground>
              </Animatable.View>

              <View style={{ width: Dimensions.get('window').width / 2, justifyContent: 'center', alignItems: 'center' }}>
                <View style={{ top: 20, position: 'absolute', color: '#fff' }}>
                  <Text numberOfLines={1} style={{ color: '#fff', textAlign: 'center', fontWeight: 'bold' }}>{card.artistName}</Text>
                  <Text numberOfLines={1} style={{ color: 'grey', fontWeight: '400' }}>{`${card.followers} followers`}</Text>
                </View>

                <View style={{ bottom: -30, position: 'relative', flexDirection: 'column' }}>
                  <Text numberOfLines={1} style={{ fontSize: 14, padding: 3, textTransform: "uppercase", color: '#3A5A40', fontWeight: 'bold', textAlign: 'center' }}>
                    {(card.artistPopularity < 5) ? "Novice Amateur" : (card.artistPopularity < 7) ? "Amateur" : (card.artistPopularity < 10) ? "Advanced Amateur" : (card.artistPopularity < 20) ? "Novice Pro" : (card.artistPopularity < 35) ? "Pro" : (card.artistPopularity < 50) ? "Next Up" : (card.artistPopularity < 70) ? "Blown?" : (card.artistPopularity < 90) ? "Fame" : (card.artistPopularity < 95) ? "Icon" : "VIP"}
                  </Text>
                  <ProgressBar progress={card.artistPopularity / 100} color='#1DB954' style={{ width: 100, height: 15 }} />
                </View>
              </View>

            </View>

          </LinearGradient>

        </View>
      )
    } else return null
  }

  _renderItem = ({ item, index }) => {
    return (
      <View style={{ borderRadius: 5, }}>
        <Image style={{ alignSelf: 'center', height: 50, width: 50 }} source={{ uri: item.image }} />
      </View>
    );
  }

  componentDidMount() {
    // console.log(UserStore.image, 'gyu')
    // console.log(UserStore.followingDetails[0])
    this.setState({ following_details: UserStore.followingDetails })

    this.interval = setInterval(() => {
      spotifyAPI.getMyRecentlyPlayedTracks().then((data) => {
        let items = []
        // console.log(data, 'deeio')
        data.items.map((item) => {
          let recentlyPlayed = {
            id: item.track.id,
            playedAt: item.played_at,
            albumName: item.track.album.name,
            artistName: item.track.artists[0].name,
            trackName: item.track.name,
            image: item.track.album.images[0].url,
            spotifyID: UserStore.spotifyUserDetails.user_name
          }
          items.push(recentlyPlayed)
          //to firebase

        })
        axios.post('https://europe-west1-projectmelo.cloudfunctions.net/api/user', {
          bio: '',
          website: '',
          location: '',
          bookmarked: '',
          playlists: '',
          recentlyPlayed: JSON.stringify(items),
          topArtists: '',
          topTracks: '',
          image : UserStore.image
        },
          {
            headers: {
              Authorization: `Bearer ${UserStore.authCode}`,
            }
          })
          .then(res => {
            // console.log(res.data)
          })
          .catch(err => console.log('err'))
        // console.log(items, 'yohy')
      })
        .catch(err => console.log("saduh"))
    }, 30000);


    wait(2000).then(() => {
      this.interval = setInterval(() => {
        axios.get(`https://api.spotify.com/v1/recommendations?limit=15&seed_tracks=${UserStore.str}`, {
          headers: {
            Authorization: `Bearer ${UserStore.spotifyUserDetails.access_token}`
          }
        }).then((res) => {
          // console.log(res.data)
          res.data.tracks.map((track) => {

            spotifyAPI.getArtist(track.artists[0].id)
              .then((response) => {
                getArtist = {
                  followers: response.followers.total,
                  image: response.images[0].url,
                  popularity: response.popularity,
                  id: response.id,
                  name: response.name
                }
                return getArtist
              })
              .then((response) => {
                spotifyAPI.getAudioFeaturesForTrack(track.id).then((data) => {
                  audioFeatures = {
                    acousticness: data.acousticness,
                    danceability: data.danceability,
                    energy: data.energy,
                    instrumentalness: data.instrumentalness,
                    liveness: data.liveness,
                    loudness: data.loudness,
                    speechiness: data.speechiness,
                    valence: data.valence
                  }

                  let array = []

                  UserStore.followingDetails.map((user) => {
                    JSON.parse(user.topArtists).map((chunk) => {
                      if (chunk.id == response.id) {
                        array.push(user.spotifyID)
                      }
                    })
                    // console.log(array, 'dami')
                  })

                  return {
                    getArtist: response,
                    array: array
                  }
                })
                  .then((response) => {
                    let array = []
                    // console.log(response.array, 'jsi')
                    if (!(response.array === undefined || response.array.length == 0)) {
                      response.array.map((user, i) => {
                        spotifyAPI
                          .getUser(user)
                          .then((res) => {
                            return {
                              image: res.images[0].url,
                              getArtist: response.getArtist
                            }
                          })
                          .then((res) => {
                            let data = {
                              image: res.image,
                              user: user,
                              artist: response.getArtist.name
                            }
                            this.setState({ topArtist_flw: [...this.state.topArtist_flw, data] })
                            if (i == response.array.length - 1) {
                              this.setState({ audioFeatures: audioFeatures }, () => {
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
                                  topArtists_following: this.state.topArtist_flw
                                  //topTracks_following : array of image links
                                  //recommended_following : array of image links
                                }
                                this.setState({ topArtist_flw: [] })
                                // console.log(recommended, 'tobio', recommended.artistName)
                                this.setState({ recommendations: [...this.state.recommendations, recommended] })
                              })
                            }
                          })
                      })
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
                          // topArtists_following: this.state.topArtist_flw
                          //topTracks_following : array of image links
                          //recommended_following : array of image links
                        }
                        // console.log(recommended, 'tobio', recommended.artistName)
                        this.setState({ recommendations: [...this.state.recommendations, recommended] })
                      })
                    }
                  })
              })
              .catch(err => console.log("saduh"))
            return
          })
          // console.log(this.state.recommendations)
        })
        return
      }, 10000);
    })
  }

  saveTrack = (id) => {
    spotifyAPI
      .addToMySavedTracks([id])
      .then((response) => {
        // console.log(response);
      })
      .catch((err) => {
        console.log(err);
      });
  }

  // followArtist = (id) => {
  //   spotifyAPI
  //     .followArtists([id])
  //     .then((response) => {
  //       console.log(response, 'dyi');
  //     })
  //     .catch((err) => {
  //       console.log('damns');
  //     });
  // }


  // reRender = () => {
  //   axios.get(`https://api.spotify.com/v1/recommendations?limit=15&seed_tracks=${UserStore.str}`, {
  //     headers: {
  //       Authorization: `Bearer ${UserStore.spotifyUserDetails.access_token}`
  //     }
  //   }).then((res) => {
  //     // console.log(res.data)
  //     res.data.tracks.map((track) => {

  //       spotifyAPI.getArtist(track.artists[0].id)
  //         .then((response) => {
  //           getArtist = {
  //             followers: response.followers.total,
  //             image: response.images[0].url,
  //             popularity: response.popularity,
  //             id: response.id
  //           }
  //           return getArtist
  //         })
  //         .then((response) => {
  //           spotifyAPI.getAudioFeaturesForTrack(track.id).then((data) => {
  //             audioFeatures = {
  //               acousticness: data.acousticness,
  //               danceability: data.danceability,
  //               energy: data.energy,
  //               instrumentalness: data.instrumentalness,
  //               liveness: data.liveness,
  //               loudness: data.loudness,
  //               speechiness: data.speechiness,
  //               valence: data.valence
  //             }
  //             this.setState({ audioFeatures: audioFeatures }, () => {
  //               recommended = {
  //                 name: track.name,
  //                 releaseDate: track.album.release_date,
  //                 popularity: track.popularity,
  //                 id: track.id,
  //                 artistID: response.id,
  //                 explicit: track.explicit,
  //                 artistName: track.artists[0].name,
  //                 followers: response.followers,
  //                 artistPopularity: response.popularity,
  //                 artistImage: response.image,
  //                 albumName: track.album.name,
  //                 image: track.album.images[0].url,
  //                 albumID: track.album.id,
  //                 audioFeatures: this.state.audioFeatures
  //               }
  //               // console.log(recommended, 'tobio')
  //               this.setState({ recommendations: [...this.state.recommendations, recommended] })
  //             })
  //           })

  //         })
  //         .catch(err => console.log("saduh"))
  //       // recommend.push(recommended)

  //     })
  //     // console.log(this.state.recommendations)
  //     // console.log('yuh')

  //   })
  // }


  render() {
    let swiper = this.state.recommendations ? (

      <Swiper
        cards={this.state.recommendations}
        renderCard={(card, cardIndex) => {
          if (card != null) {
            // console.log(cardIndex - 2, 'yo')
            this.setState({ cuurentCard: this.state.recommendations[cardIndex - 2] })
            return (
              <View style={styles.card}>

                <Animatable.View animation={"bounceIn"} >

                  <ImageBackground source={{ uri: card.image }} style={{ height: '100%', width: '100%' }} imageStyle = {{borderRadius : 15}}>
                    <View style={{ bottom: 7, position: 'absolute', flexDirection: 'row', alignSelf: 'center', backgroundColor: 'whitesmoke', opacity: 0.8, borderRadius: 15 }}>

                      <View style = {{ alignSelf : 'center', margin : 10 }}>
                        <TouchableOpacity style={{ marginRight: 0, marginBottom: 0 }}>
                          <LinearGradient
                            colors={["#000", "#21295c"]}
                            style={styles.signIn}
                          >
                            <Entypo name='spotify' size={30} style={{ color: '#1DB954', padding: 4, alignSelf : 'center' }} />
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>

                      <View style = {{ alignSelf : 'center', margin : 10 }}>
                        <TouchableOpacity style={{ marginRight: 0 }}>
                          <LinearGradient
                            colors={["#000", "#21295c"]}
                            style={styles.signIn}
                          >
                            <Entypo name='soundcloud' size={30} style={{ color: '#1DB954', padding: 4, alignSelf : 'center'}} />
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>

                      <View style = {{alignSelf : 'center', margin : 10}}>
                        <TouchableOpacity style={{ marginRight: 0 }}>
                          <LinearGradient
                            colors={["#000", "#21295c"]}
                            style={styles.signIn}
                          >
                            <MaterialCommunityIcons name='instagram' size={30} style={{ color: '#1DB954', padding: 4, alignSelf : 'center' }} />
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>

                      <View style = {{alignSelf : 'center', margin : 10}}>
                        <TouchableOpacity style={{ marginRight: 0 }}>
                          <LinearGradient
                            colors={["#000", "#21295c"]}
                            style={styles.signIn}>

                            <MaterialCommunityIcons name='twitter' size={30} style={{ color: '#1DB954', padding: 4, alignSelf : 'center' }} />
                          </LinearGradient>
                        </TouchableOpacity>
                      </View>


                    </View>
                  </ImageBackground>

                </Animatable.View>

              </View>
            )
          }
        }}
        onSwiped={(cardIndex) => {
          topArtists_following = []
        }}
        onSwipedAll={this.reRender}
        // onSwipedTop={() => this.saveTrack(this.state.cuurentCard.id)}
        // onSwipedBottom={() => this.followArtist(this.state.cuurentCard.artistID)}
        verticalSwipe={false}
        onSwipedRight={() => {
          this.saveTrack(this.state.cuurentCard.id)
          alert(`'${this.state.cuurentCard.name}' by ${this.state.cuurentCard.artistName} has been saved to your Spotify library`)
        }}
        cardIndex={0}
        backgroundColor={'transparent'}
        stackSize={3}
        stackSeparation = {12}
        >
        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
          {/* <TouchableOpacity style={{ alignItems: 'center', margin: 10 }}>
            <LinearGradient colors={["#21295c", "grey"]} style={styles.signIn}>
              <MaterialCommunityIcons name="content-save-outline" color="#fff" size={22} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={{ alignItems: 'center', margin: 10 }}>
            <LinearGradient colors={["#007bff", "grey"]} style={styles.signIn}>
              <FontAwesome name="refresh" color="#fff" size={22} />
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity style={{ alignItems: 'center', margin: 10 }}>
            <LinearGradient colors={["#21295c", "grey"]} style={styles.signIn}>
              <Ionicons name="md-share" color="#fff" size={22} />
            </LinearGradient>
          </TouchableOpacity> */}


        </View>

        <ActivityIndicator size="large" color="#1DB954" style={{ top: 300, position: 'absolute', alignSelf: 'center' }} />

      </Swiper>
    )
      :
      (
        <ActivityIndicator size="large" />
      )
    const { index, routes } = this.state
    return (
      <View style={styles.container}>
        {/* <StatusBar backgroundColor="#007bff" barStyle="dark-content" /> */}
        <LinearGradient colors={["#A7A2A9", "#000"]} style={styles.header}>

          <SafeAreaView style={{ width: Dimensions.get('window').width, top: 0, position: 'absolute' }}>

            {
              this.state.cuurentCard != undefined ?
                <View style={{ width: Dimensions.get('window').width }}>
                  <View style={{ flexDirection: 'row', alignSelf: 'center', paddingLeft: 5, paddingRight: 5 }}>
                    <Text numberOfLines={1} style={{ color: '#fff', fontWeight: 'bold' }}>{" "}{this.state.cuurentCard.name}</Text>
                    {
                      this.state.cuurentCard.explicit ?
                        <MaterialIcons name='explicit' size={16} color='#383D3B' style={{ alignSelf: 'center', bottom: 0, position: 'relative' }} />
                        :
                        null
                    }
                  </View>

                  <View style={{ flexDirection: 'row', alignSelf: 'center', paddingLeft: 5, paddingRight: 5 }}>
                    {this.state.cuurentCard.albumName != this.state.cuurentCard.name ?
                      <View style={{ alignSelf: 'center', borderRadius: 3, bottom: 0, position: 'relative', flexDirection: 'row' }}>
                        {/* <MaterialIcons name='album' size={20} style={{ padding: 0, color: '#1DB954' }} /> */}
                        <Text numberOfLines={1} style={{ color: '#44CF6C', fontWeight: 'bold' }}>{`${this.state.cuurentCard.artistName} • ${this.state.cuurentCard.albumName}  `}</Text>
                        <MaterialIcons name='album' size={16} style={{ padding: 0, color: '#44CF6C' }} />
                        {/* <Text numberOfLines={1} style={{ color: '#1DB954' }}>{" "}{this.state.cuurentCard.albumName}</Text> */}
                      </View>
                      :
                      <View style={{ alignSelf: 'center', borderRadius: 3, justifyContent: 'center' }}>
                        <Text numberOfLines={1} style={{ color: '#44CF6C', fontWeight: 'bold', }}>{this.state.cuurentCard.artistName}</Text>
                      </View>
                    }
                  </View>
                </View>
                : null

            }

          </SafeAreaView>

          {swiper}

        </LinearGradient>

        {/* <View style={styles.footer}> */}
        <LinearGradient colors={["#000", "#8D8D92", '#EAEAEB']} style={styles.footer}>

          <TabView
            navigationState={{ index, routes }}
            renderScene={this.renderScene(this.state.cuurentCard)}
            onIndexChange={(index) => this.setState({ index })}
            initialLayout={initialLayout}
            renderTabBar={renderTabBar}
          />
        </LinearGradient>

      </View>
    )
  }
}

export default observer(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A7A2A9"
  },
  card: {
    flex: 0.61,
    borderRadius: 20,
    // borderWidth: 3,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 2.5,
    borderBottomColor: "#1DB954",
    // borderRightColor : ,
    // borderRightColor : ,
    // borderRightColor : ,
    // borderColor: "#1DB954",
    justifyContent: "center",
    backgroundColor: "transparent",
    marginTop: 20,
    marginLeft: -10,
    marginRight: -10,
  },
  song: {
    fontSize: 18,
    backgroundColor: "transparent",
    color: '#EEEEFF'
  },
  text: {
    textAlign: "center",
    fontSize: 15,
    color: "#EEEEFF"
  },
  artist: {
    textAlign: "center",
    fontSize: 18,
    marginTop: 3,
    color: '#1DB954',
    fontWeight: '300',
  },
  scene: {
    flex: 1,
    borderBottomRightRadius : 15,
    borderBottomLeftRadius : 15,
  },
  header: {
    flex: 3,
    justifyContent: "flex-end",
    // paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 50,
  },
  footer: {
    flex: 1.5,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal : 10
  },
  signIn: {
    padding: 0,
    // justifyContent: "center",
    alignContent: "center",
    borderRadius: 10,
  },
});