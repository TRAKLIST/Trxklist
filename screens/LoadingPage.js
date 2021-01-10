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

import { UpdateContext } from "../App";

let str = "";
let items = [];
let topArtistsArray = [];
let image = "";

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

function LoadingPage() {
  const [image, setImage] = React.useState("");
  React.useEffect(() => {
    // this.interval = setInterval(() => {
    UserStore.followingDetails = [];

    // spotifyAPI
    //   .getUser(UserStore.spotifyUserDetails.user_id)
    //   .then((response) => {
    //     setImage(response.images[0].url); // if not null then take value and update image field below
    //   })
    //   .catch((err) => console.log(err));

    //   console.log(image)

    // neeeds to be moved home

    spotifyAPI.getMyTopArtists().then((data) => {
      topArtistsArray = [];
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
      items = [];
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

      UserStore.topTracks = items
      // UserStore.topArtists =

      // Randomise array
      // console.log(items, "first");
      shuffle(items);
      // console.log(items, "finish");

      // Recommendations - pick 3
      for (i = 0; i < 3; i++) {
        if (str == "") {
          str = `${items[i].id}`;
        } else str = `${str},${items[i].id}`;
      }

      UserStore.str = str;
      // console.log(str);
    });

    // needs to be moved home

    // console.log(topArtistsArray, items, "betrvcb");

    axios
      .post(
        "https://europe-west1-projectmelo.cloudfunctions.net/api/user",
        {
          bio: "",
          website: "",
          location: "",
          bookmarked: "",
          playlists: "",
          recentlyPlayed: "",
          topArtists: JSON.stringify(topArtistsArray),
          topTracks: JSON.stringify(items),
          // image: !(image === undefined || image == "")
          //   ? image
          //   : "https://coolbackgrounds.io/images/backgrounds/white/pure-white-background-85a2a7fd.jpg", // look at later
          image: "",
        },
        {
          headers: {
            Authorization: `Bearer ${UserStore.authCode}`,
          },
        }
      )
      .then((res) => {
        // console.log(res.data);
      })
      .catch((err) => console.log(err));

    axios
      .get("https://europe-west1-projectmelo.cloudfunctions.net/api/posts")
      .then((res) => {
        // console.log(res.data);
        UserStore.allPosts = res.data;
      })
      .catch((err) => console.log(err));

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
        // console.log(UserStore.followingDetails, "gang");
      })
      .catch((err) => console.log(err));

    // console.log(UserStore.update);

    UserStore.loading = false;
    // }, 10000);
  }, []);
  return (
    (
      <View style={styles.container}>
        <LinearGradient colors={["#A7A2A9", "#000"]} style={styles.header}>
          <View>
            <View style={{ alignItems: "center", margin: 10 }}>
              <Text style={{ fontWeight: "bold", color: "grey" }}>
                LOADING TRAKLIST....
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
    )
  );
}

// class LoadingPage extends Component {
//   componentDidMount() {
//     // add a timer
//     this.interval = setInterval(() => {
//       UserStore.followingDetails = [];

//       spotifyAPI
//         .getUser(UserStore.spotifyUserDetails.user_id)
//         .then((response) => {
//           image = response.images[0].url; // if not null then take value and update image field below
//         })
//         .catch((err) => console.log(err));

//       spotifyAPI.getMyTopArtists().then((data) => {
//         topArtistsArray = [];
//         data.items.map((item) => {
//           let topArtists = {
//             artistName: item.name,
//             image: item.images[0].url,
//             id: item.id,
//           };
//           topArtistsArray.push(topArtists);
//         });
//       });

//       spotifyAPI.getMyTopTracks().then((data) => {
//         items = [];
//         data.items.map((item) => {
//           let topTracks = {
//             name: item.name,
//             albumName: item.album.name,
//             artistName: item.artists[0].name,
//             trackName: item.name,
//             image: item.album.images[0].url,
//             id: item.id,
//           };
//           items.push(topTracks);
//         });

//         // Randomise array
//         console.log(items, "first");
//         shuffle(items);
//         console.log(items, "finish");

//         // Recommendations - pick 3
//         for (i = 0; i < 3; i++) {
//           if (str == "") {
//             str = `${items[i].id}`;
//           } else str = `${str},${items[i].id}`;
//         }

//         UserStore.str = str;
//         console.log(str);
//       });

//       console.log(topArtistsArray, items, "betrvcb");

//       axios
//         .post(
//           "https://europe-west1-projectmelo.cloudfunctions.net/api/user",
//           {
//             bio: "",
//             website: "",
//             location: "",
//             bookmarked: "",
//             playlists: "",
//             recentlyPlayed: "",
//             topArtists:
//               JSON.stringify(topArtistsArray) != "[]"
//                 ? JSON.stringify(topArtistsArray)
//                 : "",
//             topTracks:
//               JSON.stringify(items) != "[]" ? JSON.stringify(items) : "",
//             image: !(image === undefined || image == "")
//               ? image
//               : "https://coolbackgrounds.io/images/backgrounds/white/pure-white-background-85a2a7fd.jpg", // look at later
//           },
//           {
//             headers: {
//               Authorization: `Bearer ${UserStore.authCode}`,
//             },
//           }
//         )
//         .then((res) => {
//           console.log(res.data);
//         })
//         .catch((err) => console.log(err));

//       axios
//         .get("https://europe-west1-projectmelo.cloudfunctions.net/api/posts")
//         .then((res) => {
//           // console.log(res.data);
//           UserStore.allPosts = res.data;
//         })
//         .catch((err) => console.log(err));

//       axios
//         .get("https://europe-west1-projectmelo.cloudfunctions.net/api/user", {
//           headers: {
//             Authorization: `Bearer ${UserStore.authCode}`,
//           },
//         })
//         .then((res) => {
//           res.data.following.map((item) => {
//             axios
//               .get(
//                 `https://europe-west1-projectmelo.cloudfunctions.net/api/user/${item.recipient}`,
//                 {
//                   headers: {
//                     Authorization: `Bearer ${UserStore.authCode}`,
//                   },
//                 }
//               )
//               .then((res) => {
//                 UserStore.followingDetails = [
//                   ...UserStore.followingDetails,
//                   res.data.user,
//                 ];
//               })
//               .catch((err) => console.log(err));
//           });
//           console.log(UserStore.followingDetails, "gang");
//         })
//         .catch((err) => console.log(err));

//       UserStore.loading = false;
//     }, 30000);
//   }

//   render() {
//     return (
//       <View style={styles.container}>
//         <LinearGradient colors={["#A7A2A9", "#000"]} style={styles.header}>
//           <View>
//             <View style={{ alignItems: "center", margin: 10 }}>
//               <Text style={{ fontWeight: "bold", color: "grey" }}>
//                 LOADING TRAKLIST....
//               </Text>
//             </View>
//             <View>
//               <ActivityIndicator size="large" color="blue" />
//             </View>
//           </View>
//         </LinearGradient>

//         <LinearGradient
//           colors={["#000", "#8D8D92", "#EAEAEB"]}
//           style={styles.footer}
//         ></LinearGradient>
//       </View>
//     );
//   }
// }

export default observer(LoadingPage);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#A7A2A9",
  },
  card: {
    flex: 0.61,
    borderRadius: 20,
    borderRightWidth: 0,
    borderLeftWidth: 0,
    borderTopWidth: 0,
    borderBottomWidth: 2.5,
    borderBottomColor: "#1DB954",
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
