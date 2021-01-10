import React, { useState, useEffect } from "react";
import { View, Text } from "react-native";
import ADIcon from "react-native-vector-icons/AntDesign";
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
  savesCount: savesCountProp,
  postID,
  status,
  trackID,
  postedAt,
}) => {
  useEffect;
  const [isLiked, setIsLike] = useState(false);
  const [isSaved, setIsSave] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [savesCount, setSavesCount] = useState(0);

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
              Authorization: `Bearer ${UserStore.authCode}`,
            },
          }
        )
        .then((res) => {
          // console.log("success");
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
              Authorization: `Bearer ${UserStore.authCode}`,
            },
          }
        )
        .then((res) => {
          // console.log("success");
        })
        .catch((err) => {
          setIsLike(isLiked);
          setLikesCount(likesCount);
          console.log(err);
        });
    }
  };

  const onSavePressed = () => {
    // console.log(status);

    const amount = isSaved ? -1 : 1;
    setSavesCount(savesCount + amount);
    setIsSave(!isSaved);

    if (!isSaved) {
      // setIsSave(true);
      if (status == "Track") {
        // add route here

        axios
          .get(
            `https://europe-west1-projectmelo.cloudfunctions.net/api/post/${postID}/save`,
            {
              headers: {
                Authorization: `Bearer ${UserStore.authCode}`,
              },
            }
          )
          .then((res) => {
            // console.log("success");
            spotifyAPI
              .addToMySavedTracks([trackID])
              .then((response) => {
                // console.log(response);
              })
              .catch((err) => {
                //  unsave route here
                axios
                  .get(
                    `https://europe-west1-projectmelo.cloudfunctions.net/api/post/${postID}/unsave`,
                    {
                      headers: {
                        Authorization: `Bearer ${UserStore.authCode}`,
                      },
                    }
                  )
                  .catch((err) => {
                    // remind to perform later
                  });

                setIsSave(false);
                console.log(err);
              });
          })
          .catch((err) => {
            setIsSave(false);
            setSavesCount(savesCount);
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
      // setIsSave(false);
      if (status == "Track") {

        // if savesCount == 0 then dont perfrom route, just unsave

        axios
          .get(
            `https://europe-west1-projectmelo.cloudfunctions.net/api/post/${postID}/unsave`,
            {
              headers: {
                Authorization: `Bearer ${UserStore.authCode}`,
              },
            }
          )
          .then((res) => {
            // console.log("success");
            spotifyAPI
              .removeFromMySavedTracks([trackID])
              .then((response) => {
                // console.log(response);
              })
              .catch((err) => {
                // save route
                axios
                  .get(
                    `https://europe-west1-projectmelo.cloudfunctions.net/api/post/${postID}/save`,
                    {
                      headers: {
                        Authorization: `Bearer ${UserStore.authCode}`,
                      },
                    }
                  )
                  .catch((err) => {
                    // remind to perform later
                  });
                setIsSave(true);
                console.log(err);
              });
          })
          .catch((err) => {
            setIsSave(true);
            setSavesCount(savesCount);
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
            Authorization: `Bearer ${UserStore.authCode}`,
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
    setSavesCount(savesCountProp);

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
          // console.log(response);
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
            <View style={(styles.iconContainer2, { flexDirection: "column" })}>
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

              {likesCount !== 0 ? (
                <Text style={styles.number}>{likesCount}</Text>
              ) : (
                <View style={styles.number}></View>
              )}
            </View>
          </TouchableOpacity>

          <TouchableOpacity onPress={onSavePressed}>
            <View style={(styles.iconContainer2, { flexDirection: "column" })}>
              {isSaved ? (
                <MaterialCommunityIcons
                  name="content-save"
                  size={25}
                  color={"#44CF6C"}
                  style={{ marginTop: 8, paddingBottom: 4 }}
                />
              ) : (
                <MaterialCommunityIcons
                  name="content-save-outline"
                  size={25}
                  color={"#44CF6C"}
                  style={{ marginTop: 8, paddingBottom: 4 }}
                />
              )}
            </View>

            {savesCount !== 0 ? (
              <Text style={styles.number}>{savesCount}</Text>
            ) : (
              <View style={styles.number}></View>
            )}
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

          <TouchableOpacity
            onPress={() =>
              alert("This feature will be available in the next release.")
            }
          >
            <View style={(styles.iconContainer2, { flexDirection: "column" })}>
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
            {
              marginRight: 10,
              borderBottomWidth: 2,
              borderColor: "green",
              flexDirection: "column",
              justifyContent: "center",
            },
          ]}
        >
          <Text
            style={{
              color: "#292929",
              fontWeight: "bold",
              textTransform: "uppercase",
              fontSize: 13,
              fontStyle: "italic",
            }}
          >
            {dayjs(postedAt).fromNow()}
          </Text>

          {likesCount !== 0 ? (
            <Text style={(styles.number, { color: "transparent" })}>
              {likesCount}
            </Text>
          ) : (
            <View style={styles.number}></View>
          )}
        </View>
      </View>
    </View>
  );
};

export default observer(Footer);
