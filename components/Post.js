import React, { Component } from "react";
import { View } from "react-native";

import Header from "./post-components/Header";
import Body from "./post-components/Body";
import Footer from "./post-components/Footer";
import UserStore from "../stores/UserStore";
import spotifyAPI from "./SpotifyAPI";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

let track_album = [];

export class Post extends Component {
  constructor(props) {
    super(props);

    this.state = {
      profilePic: "",
      thisTrack: {},
      comments: [],
    };
  }

  componentDidMount() {
    this.props.post.commentCount > 0
      ? axios
          .get(
            `https://europe-west1-projectmelo.cloudfunctions.net/api/post/${this.props.post.postID}`,
            {
              headers: {
                Authorization: `Bearer ${UserStore.authCode}`,
              },
            }
          )
          .then((res) => {
            res.data.comments.map((item) => {
              this.setState({ comments: [...this.state.comments, item] }, () =>
                console.log(this.state.comments, "tjyhtrbfs")
              );
            });
            console.log(this.state.comments, "noceuhgieydcv");
          })
          .catch((err) => console.log(err))
      : null;

    spotifyAPI
      .getUser(this.props.post.spotifyID)
      .then((response) => {
        this.setState({
          profilePic: !(
            response.images === undefined || response.images.length == 0
          )
            ? response.images[0].url
            : "https://coolbackgrounds.io/images/backgrounds/white/pure-white-background-85a2a7fd.jpg",
        });
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
            track_album.push({
              id: track.id,
              title: track.name,
            });
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
          let track_playlist = [];
          response.tracks.items.map((track) => {
            track_playlist.push({
              id: track.track.id,
              title: track.track.name,
            });
          });
          let thisTrack = {
            id: response.id,
            name: response.name,
            artist: response.owner.display_name,
            image: response.images[0].url,
            track: track_playlist,
          };
          console.log(track_playlist, "teregyo8grwe");
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
          borderBottomWidth: 0,
          borderRadius: 15,
          borderColor: "grey",
          backgroundColor: "transparent",
          // borderWidth: 0,

          borderWidth: 0,
          borderRadius: 2,
          // borderColor: '#ddd',
          borderBottomWidth: 0,
          shadowColor: this.props.index % 2 == 0 ? "#000" : "#292929",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.8,
          shadowRadius: 2,
          // paddingVertical : 10,
        }}
      >
        <Body
          thisTrack={this.state.thisTrack}
          caption={this.props.post.body}
          status={this.props.post.status}
          imageUri={this.state.profilePic}
          index={this.props.index}
        />
        <Footer
          likesCount={this.props.post.likeCount}
          savesCount={this.props.post.saveCount}
          commentCount={this.props.post.commentCount}
          comments={this.state.comments}
          postID={this.props.post.postID}
          status={this.props.post.status}
          trackID={this.props.post.trackID}
          postedAt={this.props.post.createdAt}
          index={this.props.index}
        />
      </View>
    );
  }
}

export default Post;
