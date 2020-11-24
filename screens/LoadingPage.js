import React, { Component } from "react";
import axios from "axios";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  Button,
  Platform,
  StatusBar,
  Dimensions,
} from "react-native";
import Post from "../components/Post";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import spotifyAPI from '../components/SpotifyAPI'

// let topArtists = {}
// let topArtistsArray = []
let str = ''
let recommend = []

class LoadingPage extends Component {
  componentDidMount() {
    // axios
    //   .get("https://europe-west1-projectmelo.cloudfunctions.net/api/posts")
    //   .then((res) => {
    //     // console.log(res.data);
    //     UserStore.allPosts = res.data;
    //   })
    //   .catch((err) => console.log(err));

    // console.log(UserStore.spotifyUserDetails.access_token);

    // axios
    //   .get("https://europe-west1-projectmelo.cloudfunctions.net/api/user", {
    //     headers: {
    //       Authorization: `Bearer ${UserStore.authCode}`, //the token is a variable which holds the token
    //     },
    //   })
    //   .then((res) => {
    //     UserStore.userDetails = res.data;
    //     // console.log(res.data);
    //   })
    //   .catch((err) => console.log(err));

    spotifyAPI.getMyTopArtists().then((data) => {           // for recommendation
      // console.log(data)
      let topArtistsArray = []
      data.items.map((item) => {
        let topArtists = {
          artistName: item.name,
          image: item.images[0].url,
          id: item.id
        }
        topArtistsArray.push(topArtists)
        // UserStore.topArtists = topArtistsArray
        // console.log(topArtistsArray)
      })
    })

    spotifyAPI.getMyTopTracks({ limit: 3 }).then((data) => {                       // for profile
      // console.log(data.items)

      let items = []
      data.items.map((item) => {
        let topTracks = {
          name: item.name,
          albumName: item.album.name,
          artistName: item.artists[0].name,
          trackName: item.name,
          image: item.album.images[0].url,
          id: item.id
        }
        items.push(topTracks)
        // UserStore.topTracks = items
        // console.log(items)
      })

      items.map(item => {
        if (str == '') {
          str = `${item.id}`
        } else str = `${str},${item.id}`
      })
      UserStore.str = str
      console.log(str)
    })
    UserStore.loading = false;
  }

  render() {
    return (
      <SafeAreaView>
        <Text>Loading</Text>
      </SafeAreaView>
    );
  }
}

export default observer(LoadingPage);
