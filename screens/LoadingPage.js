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
import spotifyAPI from "../components/SpotifyAPI";

let str = "";

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

  return array;
}

class LoadingPage extends Component {
  componentDidMount() {
    axios
      .get("https://europe-west1-projectmelo.cloudfunctions.net/api/user", {
        headers: {
          Authorization: `Bearer ${UserStore.authCode}`,
        },
      })
      .then((res) => {
        res.data.following.map((item) => {
          axios
            .get(
              `https://europe-west1-projectmelo.cloudfunctions.net/api/user/${item.recipient}`,
              {
                headers: {
                  Authorization: `Bearer ${UserStore.authCode}`,
                },
              }
            )
            .then((res) => {
              UserStore.followingDetails = [
                ...UserStore.followingDetails,
                res.data.user,
              ];
            })
            .catch((err) => console.log(err));
        });
        console.log(UserStore.followingDetails, "gang");
      })
      .catch((err) => console.log(err));

    spotifyAPI.getMyTopArtists().then((data) => {
      let topArtistsArray = [];
      data.items.map((item) => {
        let topArtists = {
          artistName: item.name,
          image: item.images[0].url,
          id: item.id,
        };
        topArtistsArray.push(topArtists);
      });
    });

    spotifyAPI.getMyTopTracks().then((data) => {
      let items = [];
      data.items.map((item) => {
        let topTracks = {
          name: item.name,
          albumName: item.album.name,
          artistName: item.artists[0].name,
          trackName: item.name,
          image: item.album.images[0].url,
          id: item.id,
        };
        items.push(topTracks);
      });

      // Randomise array
      console.log(items, "first");
      shuffle(items);
      console.log(items, "finish");

      // Recommendations - pick 3
      for (i = 0; i < 3; i++) {
        if (str == "") {
          str = `${items[i].id}`;
        } else str = `${str},${items[i].id}`;
      }

      // items.map((item) => {
      //   if (str == "") {
      //     str = `${item.id}`;
      //   } else str = `${str},${item.id}`;
      // });
      UserStore.str = str;
      console.log(str);
    });

    spotifyAPI
      .getUser(UserStore.spotifyUserDetails.user_id)
      .then((response) => {
        (UserStore.image = response.images[0].url), "dsfuy";
      })
      .catch((err) => console.log(err));

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
