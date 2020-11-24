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
  TouchableOpacity,
  StatusBar,
  Picker,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Ionicons from "react-native-vector-icons/Ionicons";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import Swiper from 'react-native-deck-swiper'

import Post from "../components/Post";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import axios from "axios";

function wait(timeout) {
  return new Promise((res) => {
    setTimeout(res, timeout);
  });
}

let recommend = []

const FirstRoute = () => (
  <View style={[styles.scene]}>
    <LinearGradient colors={["#000", "#8D8D92", '#EAEAEB']} style={styles.header}>

    </LinearGradient>
  </View>
);

const SecondRoute = () => (
  <View style={[styles.scene]}>
    <LinearGradient colors={["#000", "#8D8D92", '#EAEAEB']} style={styles.header}>

    </LinearGradient>
  </View>
);

const initialLayout = { width: Dimensions.get('window').width };

const renderScene = SceneMap({
  first: FirstRoute,
  second: SecondRoute,
});

const renderTabBar = props => (
  <TabBar
    {...props}
    indicatorStyle={{ backgroundColor: 'yellow' }}
    style={{ backgroundColor: 'black' }}
  />
);


export class HomeScreen extends Component {
  constructor(props) {
    super(props)

    this.state = {
      recommendations: [],
      index: 0,
      routes: [{ key: 'first', title: 'Features' },
      { key: 'second', title: 'Engagements' }]
    }
  }

  componentDidMount() {
    wait(2000).then(() => {
      axios.get(`https://api.spotify.com/v1/recommendations?limit=15&seed_tracks=${UserStore.str}`, {
        headers: {
          Authorization: `Bearer ${UserStore.spotifyUserDetails.access_token}`
        }
      }).then((res) => {
        console.log(res.data)
        res.data.tracks.map((track) => {
          let recommended = {
            name: track.name,
            popularity: track.popularity,
            id: track.id,
            explicit: track.explicit,
            artistName: track.artists[0].name,
            albumName: track.album.name,
            image: track.album.images[0].url,
            albumID: track.album.id
          }
          recommend.push(recommended)
        })
        this.setState({ recommendations: recommend }, () => {
          console.log(this.state.recommendations)
          console.log('yuh')
        })
      })
    })
  }

  componentDidUpdate() {
    axios.get(`https://api.spotify.com/v1/recommendations?limit=15&seed_tracks=${UserStore.str}`, {
      headers: {
        Authorization: `Bearer ${UserStore.spotifyUserDetails.access_token}`
      }
    }).then((res) => {
      // console.log(res.data)
      res.data.tracks.map((track) => {
        let recommended = {
          name: track.name,
          popularity: track.popularity,
          id: track.id,
          explicit: track.explicit,
          artistName: track.artists[0].name,
          albumName: track.album.name,
          image: track.album.images[0].url,
          albumID: track.album.id
        }
        recommend.push(recommended)
      })
      this.setState({ recommendations: recommend })
      // console.log(JSON.stringify(recommend))
      // console.log('yuh')
    })

  }

  reRender = () => {
    axios.get(`https://api.spotify.com/v1/recommendations?limit=15&seed_tracks=${UserStore.str}`, {
      headers: {
        Authorization: `Bearer ${UserStore.spotifyUserDetails.access_token}`
      }
    }).then((res) => {
      // console.log(res.data)
      res.data.tracks.map((track) => {
        let recommended = {
          name: track.name,
          popularity: track.popularity,
          id: track.id,
          explicit: track.explicit,
          artistName: track.artists[0].name,
          albumName: track.album.name,
          image: track.album.images[0].url,
          albumID: track.album.id
        }
        recommend.push(recommended)
      })
      this.setState({ recommendations: recommend })
      // console.log(JSON.stringify(recommend))
      // console.log('yuh')
    })
  }


  render() {
    let swiper = this.state.recommendations ? (
      <Swiper
        cards={this.state.recommendations}
        renderCard={(card) => {
          if (card != null) {
            return (
              <LinearGradient colors={["grey", "black"]} style={styles.card}>

                <View>
                  <Image source={{ uri: card.image }} style={{ height: 200, width: 200, alignSelf: 'center', borderRadius: 10 }} />
                </View>

                <View style={{ margin: 10 }}>
                  <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                    {card.explicit ?
                      <MaterialIcons name='explicit' size={25} color='grey' />
                      :
                      null
                    }
                    <Text numberOfLines={1} style={styles.song}>{" "}{card.name}</Text>
                  </View>
                  <View style={{ backgroundColor: "#EEEEFF", alignSelf: 'center', padding: 3, marginTop: 3, borderRadius: 3, justifyContent: 'center' }}>
                    <Text numberOfLines={1} style={styles.artist}>{card.artistName}</Text>
                  </View>

                  {card.albumName != card.name ?
                    <View style={{ flexDirection: 'row', alignSelf: 'center', marginTop: 7, padding: 5, borderRadius: 3, bottom: 0, position: 'relative' }}>
                      <MaterialIcons name='album' size={20} style={{ padding: 0, color: '#EEEEFF' }} />
                      <Text numberOfLines={1} style={styles.text}>{" "}{card.albumName}</Text>
                    </View>
                    :
                    null
                  }

                </View>


              </LinearGradient>
            )
          }

        }}
        onSwiped={(cardIndex) => { console.log(cardIndex) }}
        onSwipedAll={() => { console.log('onSwipedAll') }}
        cardIndex={0}
        backgroundColor={'transparent'}
        stackSize={3}>
        <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
          <TouchableOpacity style={{ alignItems: 'center', margin: 10 }}>
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
          </TouchableOpacity>
        </View>

        <ActivityIndicator size="large" color="#007bff" style={{ marginTop: 100 }} />

      </Swiper>
    )
      :
      (
        <ActivityIndicator size="large" />
      )
    const { index, routes } = this.state
    return (
      <SafeAreaView style={styles.container}>
        <LinearGradient colors={["#F4F7F5", "#A7A2A9", "#000000"]} style={styles.header}>
          {swiper}
        </LinearGradient>
        <View style={styles.footer}>
          <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            onIndexChange={(index) => this.setState({ index })}
            initialLayout={initialLayout}
            renderTabBar={renderTabBar}
          />
        </View>

      </SafeAreaView>
    )
  }
}


export default observer(HomeScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F5FCFF"
  },
  card: {
    height: 360,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: "#E8E8E8",
    justifyContent: "center",
    backgroundColor: "transparent",
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
    color: 'black',
  },
  scene: {
    flex: 1
  },
  header: {
    flex: 3,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 25,
    paddingTop: 50,
  },
  footer: {
    flex: 1.8,
    backgroundColor: "#fff",
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
  },
  signIn: {
    padding: 10,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
  },
});