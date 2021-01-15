import React, { useState, useEffect } from "react";
import { View, Text, TextInput, KeyboardAvoidingView } from "react-native";
import ADIcon from "react-native-vector-icons/AntDesign";
import Fontisto from "react-native-vector-icons/Fontisto";
import Ionicons from "react-native-vector-icons/Ionicons";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
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
  commentCount,
  postID,
  status,
  trackID,
  postedAt,
  index,
  comments,
}) => {
  const [isLiked, setIsLike] = useState(false);
  const [isSaved, setIsSave] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [savesCount, setSavesCount] = useState(0);
  const [toggleComment, setToggleComment] = React.useState(false);
  const [captionTerm, setCaptionTerm] = React.useState("");
  const [toggleComments, setToggleComments] = React.useState(false);

  console.log(comments, "brvcjh");
  // useEffect(() => {
  //   commentCount > 0
  //     ? //https://europe-west1-projectmelo.cloudfunctions.net/api/post/2BzS0xXJEb4eTFDyXzXa

  //       axios
  //         .get(
  //           `https://europe-west1-projectmelo.cloudfunctions.net/api/post/${postID}`,
  //           {
  //             headers: {
  //               Authorization: `Bearer ${UserStore.authCode}`,
  //             },
  //           }
  //         )
  //         .then((res) => {
  //           // setToggleComment(false);
  //           res.data.comments.map((item) => {
  //             setComments([...comments, item]);
  //           });
  //           console.log(comments, "etrijbouyb");
  //         })
  //         .catch((err) => console.log(err))
  //     : null;
  // });

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
          alert(err);
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

  const commentOnPost = () => {
    axios
      .post(
        `https://europe-west1-projectmelo.cloudfunctions.net/api/post/${postID}/comment`,
        {
          trackID: trackID,
          spotifyID: UserStore.spotifyUserDetails.user_id,
          body: captionTerm,
        },
        {
          headers: {
            Authorization: `Bearer ${UserStore.authCode}`,
          },
        }
      )
      .then((res) => {
        setToggleComment(false);
        console.log(res.data);
      })
      .catch((err) => console.log(err));
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
  if (toggleComment == false) {
    return (
      <View style={[styles.container, { flexDirection: "column" }]}>
        <View style={styles.iconsContainer}>
          <View
            style={[
              styles.leftIcons,
              {
                marginLeft: 10,
                borderBottomWidth: 2,
                borderColor: index % 2 == 0 ? "grey" : "#292929",
              },
            ]}
          >
            <TouchableOpacity onPress={onLikePressed}>
              <View
                style={(styles.iconContainer2, { flexDirection: "column" })}
              >
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
                    color={index % 2 != 0 ? "#292929" : "grey"}
                    style={{ marginTop: 8, paddingBottom: 4 }}
                  />
                )}

                {likesCount !== 0 ? (
                  <Text
                    style={{
                      color: index % 2 != 0 ? "#292929" : "grey",
                      textAlign: "center",
                      fontWeight: "bold",
                      marginBottom: 5,
                    }}
                  >
                    {likesCount}
                  </Text>
                ) : (
                  <View style={styles.number}></View>
                )}
              </View>
            </TouchableOpacity>

            <TouchableOpacity onPress={onSavePressed}>
              <View
                style={(styles.iconContainer2, { flexDirection: "column" })}
              >
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
                    color={index % 2 != 0 ? "#292929" : "grey"}
                    style={{ marginTop: 8, paddingBottom: 4 }}
                  />
                )}
              </View>

              {savesCount !== 0 ? (
                <Text
                  style={{
                    color: index % 2 != 0 ? "#292929" : "grey",
                    textAlign: "center",
                    fontWeight: "bold",
                    marginBottom: 5,
                  }}
                >
                  {savesCount}
                </Text>
              ) : (
                <View style={styles.number}></View>
              )}
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setToggleComment(true)}>
              <View
                style={(styles.iconContainer2, { flexDirection: "column" })}
              >
                <Fontisto
                  name="comment"
                  size={25}
                  color={index % 2 != 0 ? "#292929" : "grey"}
                  style={{ marginTop: 8, paddingBottom: 4 }}
                />

                {commentCount !== 0 ? (
                  <Text
                    style={{
                      color: index % 2 != 0 ? "#292929" : "grey",
                      textAlign: "center",
                      fontWeight: "bold",
                      marginBottom: 5,
                    }}
                  >
                    {commentCount}
                  </Text>
                ) : (
                  <View style={styles.number}></View>
                )}
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={[
              styles.iconContainer2,
              {
                marginRight: 10,
                borderBottomWidth: 2,
                borderColor: index % 2 == 0 ? "grey" : "#292929",
                flexDirection: "column",
                justifyContent: "center",
              },
            ]}
          >
            <Text
              style={{
                color: index % 2 != 0 ? "#292929" : "grey",
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

        {!toggleComments && commentCount > 0 && (
          <TouchableOpacity onPress={() => setToggleComments(!toggleComments)}>
            <View
              style={{
                flex: 1,
                // backgroundColor: "red",
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
                borderRadius: 15,
                marginTop: 10,
                backgroundColor: "#292929",
              }}
            >
              <Text style={{ color: "grey", fontWeight: "500" }}>
                see comments
              </Text>
            </View>
          </TouchableOpacity>
        )}
        {toggleComments && commentCount > 0 && (
          <View
            style={{
              backgroundColor: "transparent",
              width: "100%",
              height: 50,
              marginTop: 10,
              borderRadius: 10,
              padding : 5,
              justifyContent: "center",
            }}
          >
            {comments.map((comment) => (
              <View style = {{flexDirection : 'column'}}>
                <View style={{ flexDirection: "row" }}>
                  <View style={{ flex: 1, alignItems: "center" }}>
                    <Text>{comment.data.meloID}</Text>
                  </View>
                  <View style={{ flex: 2,  }}>
                    <Text style={{ color: "#fff" }}>{comment.data.body}</Text>
                  </View>
                </View>
                <View style = {{justifyContent : 'flex-end'}}>
                  <Text style = {{textAlign : 'right'}}>{comment.data.createdAt}</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>
    );
  } else {
    return (
      <KeyboardAvoidingView behavior="height" style={[styles.container]}>
        <View style={styles.iconsContainer}>
          <View
            style={[
              styles.iconContainer2,
              {
                // backgroundColor : 'red',
                borderBottomWidth: 2,
                borderColor: index % 2 == 0 ? "grey" : "#292929",
                justifyContent: "center",
                flex: 0,
              },
            ]}
          >
            <TouchableOpacity onPress={() => setToggleComment(false)}>
              <View
                style={{
                  backgroundColor: "#000",
                  opacity: 0.4,
                  borderRadius: 30,
                  justifyContent: "center",
                  borderColor: "#fff",
                  height: 50,
                  width: 50,
                }}
              >
                <MaterialIcons
                  name="cancel"
                  size={25}
                  style={{
                    color: "grey",
                    alignSelf: "center",
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View
            style={[
              {
                flex: 1,
                marginLeft: 10,
                borderBottomWidth: 2,
                borderColor: index % 2 == 0 ? "grey" : "#292929",
              },
            ]}
          >
            <View style={{ flex: 1, justifyContent: "center", padding: 5 }}>
              <TextInput
                placeholder="Comment sumn..."
                autoCapitalize="none"
                style={{
                  justifyContent: "center",
                  backgroundColor: "#000",
                  borderRadius: 5,
                  borderColor: "#fff",
                  borderWidth: 0,
                  textAlign: "center",
                  // fontSize: 20,
                  opacity: 0.4,
                  color: "grey",
                  fontWeight: "bold",
                  height: 50,
                }}
                onChangeText={(val) => setCaptionTerm(val)}
              />
            </View>
          </View>

          <View
            style={[
              styles.iconContainer2,
              {
                // backgroundColor : 'red',
                borderBottomWidth: 2,
                borderColor: index % 2 == 0 ? "grey" : "#292929",
                justifyContent: "center",
                flex: 0,
              },
            ]}
          >
            <TouchableOpacity onPress={commentOnPost}>
              <View
                style={{
                  backgroundColor: "#000",
                  opacity: 0.4,
                  borderRadius: 30,
                  justifyContent: "center",
                  borderColor: "#fff",
                  height: 50,
                  width: 50,
                }}
              >
                <Ionicons
                  name="ios-send"
                  size={25}
                  style={{
                    color: "grey",
                    alignSelf: "center",
                  }}
                />
              </View>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    );
  }
};

export default observer(Footer);
