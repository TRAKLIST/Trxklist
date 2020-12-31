import React, { useState, useEffect } from "react";
import { View, Text, TouchableWithoutFeedback } from "react-native";
import ADIcon from "react-native-vector-icons/AntDesign";
import FontistoIcon from "react-native-vector-icons/Fontisto";
import IoniconsIcon from "react-native-vector-icons/Ionicons";
import FAIcon from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import styles from "./styles";
import axios from "axios";
import UserStore from "../../../stores/UserStore";
import { observer } from "mobx-react";
import spotifyAPI from "../../SpotifyAPI";
import { TouchableOpacity } from "react-native-gesture-handler";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

const Footer = ({
  likesCount: likesCountProp,
  caption,
  commentCount,
  postID,
  status,
  trackID,
  postedAt,
}) => {
  useEffect;
  const [isLiked, setIsLike] = useState(false);
  const [isSaved, setIsSave] = useState(false);
  const [likesCount, setLikesCount] = useState(0);

  const onLikePressed = () => {
    const amount = isLiked ? -1 : 1;
    setLikesCount(likesCount + amount);
    setIsLike(!isLiked);
    if (!isLiked) {
      axios
        .get(
          `https://europe-west1-projectmelo.cloudfunctions.net/api/post/${postID}/like`,
          {
            headers: {
              Authorization: `Bearer ${UserStore.authCode}`, //the token is a variable which holds the token
            },
          }
        )
        .then((res) => {
          console.log("success");
        })
        .catch((err) => {
          setIsLike(isLiked);
          setLikesCount(likesCount);
          console.log(err);
        });
    } else {
      axios
        .get(
          `https://europe-west1-projectmelo.cloudfunctions.net/api/post/${postID}/unlike`,
          {
            headers: {
              Authorization: `Bearer ${UserStore.authCode}`, //the token is a variable which holds the token
            },
          }
        )
        .then((res) => {
          console.log("success");
        })
        .catch((err) => {
          setIsLike(isLiked);
          setLikesCount(likesCount);
          console.log(err);
        });
    }
  };

  const onSavePressed = () => {
    console.log(status);
    if (!isSaved) {
      setIsSave(true);
      if (status == "Track") {
        spotifyAPI
          .addToMySavedTracks([trackID])
          .then((response) => {
            // console.log(response);
          })
          .catch((err) => {
            setIsSave(false);
            console.log(err);
          });
      } else if (status == "Album") {
        spotifyAPI
          .addToMySavedAlbums([trackID])
          .then((response) => {
            // console.log(response);
          })
          .catch((err) => {
            setIsSave(false);
            console.log(err);
          });
      } else if (status == "Artist") {
        spotifyAPI
          .followArtists([trackID])
          .then((response) => {
            //   console.log(response);
          })
          .catch((err) => {
            setIsSave(false);
            console.log(err);
          });
      } else if (status == "Playlist") {
        spotifyAPI
          .followPlaylist([trackID])
          .then((response) => {
            //   console.log(response);
          })
          .catch((err) => {
            setIsSave(false);
            console.log(err);
          });
      }
    } else {
      setIsSave(false);
      if (status == "Track") {
        spotifyAPI
          .removeFromMySavedTracks([trackID])
          .then((response) => {
            // console.log(response);
          })
          .catch((err) => {
            setIsSave(true);
            console.log(err);
          });
      } else if (status == "Album") {
        spotifyAPI
          .removeFromMySavedAlbums([trackID])
          .then((response) => {
            // console.log(response);
          })
          .catch((err) => {
            setIsSave(true);
            console.log(err);
          });
      } else if (status == "Artist") {
        spotifyAPI
          .unfollowArtists([trackID])
          .then((response) => {
            // console.log(response);
          })
          .catch((err) => {
            setIsSave(true);
            console.log(err);
          });
      } else if (status == "Playlist") {
        spotifyAPI
          .unfollowPlaylist([trackID])
          .then((response) => {
            // console.log(response);
          })
          .catch((err) => {
            setIsSave(true);
            console.log(err);
          });
      }
    }
  };

  dayjs.extend(relativeTime);

  useEffect(() => {
    axios
      .get(
        `https://europe-west1-projectmelo.cloudfunctions.net/api/user/liked`,
        {
          headers: {
            Authorization: `Bearer ${UserStore.authCode}`, //the token is a variable which holds the token
          },
        }
      )
      .then((res) => {
        // console.log(res.data);
        res.data.liked.map((post) => {
          if (post.postID == postID && post.meloID == post.username) {
            setIsLike(true);
          }
        });
      })
      .catch((err) => console.log(err));

    setLikesCount(likesCountProp);

    if (status === "Track") {
      spotifyAPI
        .containsMySavedTracks([trackID])
        .then((response) => {
          if (response[0] === true) {
            setIsSave(true);
            // console.log(`Saved ${status}`);
          }
        })
        .catch((err) => {
          setIsSave(false);
          console.log(err);
        });
    } else if (status === "Album") {
      spotifyAPI
        .containsMySavedAlbums([trackID])
        .then((response) => {
          if (response[0] === true) {
            setIsSave(true);
            // console.log(`Saved ${status}`);
          }
        })
        .catch((err) => {
          setIsSave(false);
          console.log(err);
        });
    } else if (status === "Artist") {
      // spotifyAPI
      //   .followArtists([trackID])
      //   .then((response) => {
      //     if (response[0] === true) {
      //       setIsSave(true);
      //       // console.log(`Saved ${status}`);
      //     }
      //   })
      //   .catch((err) => {
      //     setIsSave(false);
      //     console.log(err);
      //   });
    } else if (status === "Playlist") {
      spotifyAPI
        .areFollowingPlaylist(trackID, [UserStore.spotifyUserDetails.user_id])
        .then((response) => {
          console.log(response);
          if (response[0] === true) {
            setIsSave(true);
            // console.log(`Saved ${status}`);
          }
        })
        .catch((err) => {
          setIsSave(false);
          console.log(err);
        });
    }
  }, []);
  return (
    <View style={[styles.container, { marginBottom: 10 }]}>
      <View style={styles.iconsContainer}>
        <View
          style={[
            styles.leftIcons,
            { marginLeft: 10, borderBottomWidth: 2, borderColor: "green" },
          ]}
        >
          <TouchableOpacity onPress={onLikePressed}>
            <View style={styles.iconContainer2}>
              {isLiked ? (
                <ADIcon
                  name="heart"
                  size={25}
                  color={"#44CF6C"}
                  style={{ marginTop: 8, paddingBottom: 4 }}
                />
              ) : (
                <ADIcon
                  name="hearto"
                  size={25}
                  color={"#44CF6C"}
                  style={{ marginTop: 8, paddingBottom: 4 }}
                />
              )}
              {/* {likesCount == !8 ? (
                <Text style={styles.number}>{likesCount}</Text>
              ) : (
                  <View style={styles.number}></View>
                )} */}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onSavePressed}>
            <View style={styles.iconContainer2}>
              {isSaved ? (
                <MaterialCommunityIcons
                  name="content-save"
                  size={27}
                  color={"#44CF6C"}
                  style={{ marginTop: 8, paddingBottom: 4 }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="content-save-outline"
                  size={27}
                  color={"#44CF6C"}
                  style={{ marginTop: 8, paddingBottom: 4 }}
                />
              )}
            </View>
          </TouchableOpacity>

          {/* <TouchableOpacity>
            <View style={styles.iconContainer2}>
              <FontistoIcon
                name="comment"
                size={25}
                color={"#44CF6C"}
                style={{ marginTop: 8  }}
              />
            </View>
          </TouchableOpacity> */}

          <TouchableOpacity onPress={onSavePressed}>
            <View style={styles.iconContainer2}>
              <Feather
                name="share-2"
                size={24}
                color={"#44CF6C"}
                style={{ marginTop: 8, paddingBottom: 4 }}
              />
            </View>
          </TouchableOpacity>

          {/* <View style={styles.iconContainer2}>
            <FontistoIcon
              name="comment"
              size={23}
              color={"#21295c"}
              style={{ margin: 8 }}
            />
            {commentCount == !0 ? (
              <Text style={styles.number}>{commentCount}</Text>
            ) : (
              <View style={styles.number}></View>
            )}
          </View> */}
        </View>

        <View
          style={[
            styles.iconContainer2,
            { marginRight: 10, borderBottomWidth: 2, borderColor: "green" },
          ]}
        >
          <Text
            style={{
              color: "#71677C",
              fontWeight: "bold",
              textTransform: "uppercase",
              fontSize: 13,
              fontStyle: "italic",
            }}
          >
            {dayjs(postedAt).fromNow()}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default observer(Footer);
