import React, { Component } from "react";
import { View } from "react-native";

import Header from "./post-components/Header";
import Body from "./post-components/Body";
import Footer from "./post-components/Footer";
import UserStore from "../stores/UserStore";
import spotifyAPI from "./SpotifyAPI";
import { LinearGradient } from "expo-linear-gradient";

let track_album = [];

let track_playlist = [];

export class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profilePic: "",
      thisTrack: {},
    };
  }

  componentDidMount() {
    spotifyAPI
      .getUser(this.props.post.spotifyID)
      .then((response) => {
        this.setState({ profilePic: response.images[0].url });
      })
      .catch((err) => console.log(err));

    if (this.props.post.status == "Track") {
      spotifyAPI
        .getTrack(this.props.post.trackID)
        .then((response) => {
          // console.log(response);
          let thisTrack = {
            id: response.id,
            name: response.name,
            artist: response.album.artists[0].name,
            image: response.album.images[0].url,
          };
          this.setState({ thisTrack });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (this.props.post.status == "Album") {
      spotifyAPI
        .getAlbum(this.props.post.trackID)
        .then((response) => {
          // console.log(response);
          response.tracks.items.map((track) => {
            track_album.push(track.name);
          });
          let thisTrack = {
            id: response.id,
            name: response.name,
            artist: response.artists[0].name,
            image: response.images[0].url,
            track: track_album,
          };
          track_album = [];
          // console.log(thisTrack);
          this.setState({ thisTrack });
        })
        .catch((err) => {
          console.log(err);
        });
    } else if (this.props.post.status == "Playlist") {
      spotifyAPI
        .getPlaylist(this.props.post.trackID)
        .then((response) => {
          // console.log(response);
          response.tracks.items.map((track) => {
            track_playlist.push(track.track.name);
          });
          let thisTrack = {
            id: response.id,
            name: response.name,
            artist: response.owner.display_name,
            image: response.images[0].url,
            track: track_playlist,
          };
          // console.log(thisTrack);
          this.setState({ thisTrack });
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }
  render() {
    return (
      <View
        style={{
          // borderTopWidth: 1.5,
          // borderBottomWidth: 1.5,
          borderRadius : 10,
          borderColor: "green",
          backgroundColor: "#000",
          borderWidth : 0
          // paddingVertical : 10,
        }}
      >
        {/* <Header
          imageUri={this.state.profilePic}
          name={this.props.post.meloID}
          postedAt={this.props.post.createdAt}
          imageUri={this.state.profilePic}
        /> */}
        <Body
          thisTrack={this.state.thisTrack}
          caption={this.props.post.body}
          status={this.props.post.status}
          imageUri={this.state.profilePic}
        />
        <Footer
          likesCount={this.props.post.likeCount}
          commentCount={this.props.post.commentCount}
          postID={this.props.post.postID}
          status={this.props.post.status}
          trackID={this.props.post.trackID}
          postedAt={this.props.post.createdAt}
        />
      </View>
    );
  }
}

export default Post;
