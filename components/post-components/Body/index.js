import React, { useEffect } from "react";
import { Image, Text, View, ScrollView, ImageBackground } from "react-native";
import styles from "./styles";
import ProfilePicture from "../../ProfilePicture";
import Icon from "react-native-vector-icons/Entypo";
import AntDesign from "react-native-vector-icons/AntDesign";
import { TouchableOpacity } from "react-native-gesture-handler";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import spotifyAPI from "../../SpotifyAPI";
import TracklistItem from "./TracklistItem";
import Footer from "../Footer";

const Body = ({ thisTrack, caption, status, imageUri, index }) => {
  const [tracks, setTracks] = React.useState([]);
  // useEffect(() => {
  //   spotifyAPI
  //     .getPlaylist(thisTrack.id)
  //     .then((response) => {
  //       // console.log(response);
  //       response.tracks.items.map((track) => {
  //         track_playlist.push({
  //           id: track.track.id,
  //           title: track.track.name,
  //         });
  //       });
  //       setTracks(track_playlist)
  //       console.log(tracks, "teregyo8gvrwvewrwe");
  //       // this.setState({ thisTrack });
  //     })
  //     .catch((err) => {
  //       console.log(err);
  //     });
  // }, []);

  // console.log(thisTrack.track, "efke");
  let tracklist = thisTrack.track ? (
    thisTrack.track.map((track) => (
      <TracklistItem track={track} index={index} />
    ))
  ) : (
    <Text>Loading</Text>
  );
  if (status === "Track") {
    return (
      // <Text source={{ uri: imageUri }} style={styles.image}>
      <View>
        <View
          style={[
            styles.titleContainer,
            {
              // top: 0,
              // position: "absolute",
              width: "100%",
              padding: 0,
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              // borderRadius: 15,
              // borderWidth : 0,
              // borderColor : index % 2 == 0 ? "grey" : "#292929",
              backgroundColor : index % 2 != 0 ? "grey" : "#292929",
              opacity : 0.6
            },
          ]}
        >
          <View style={{ flexDirection: "row" }}>
            <View style={{ flex: 1 }}>
              <ProfilePicture uri={imageUri} index={index} size={40} />
            </View>
            <View style={{ alignSelf: "center", marginLeft: 0, flex: 5 }}>
              <Text
                style={{
                  color: index % 2 == 0 ? "grey" : "#292929",
                  fontSize: 15,
                  margin: 2,
                  fontFamily: "Arial",
                  fontWeight: "bold",
                  backgroundColor: "transparent",
                  textAlign: "center",
                }}
                numberOfLines={1}
              >
                {thisTrack.name}
              </Text>
              <View
                style={{
                  padding: 0,
                  // backgroundColor: index % 2 == 0 ? "grey" : "#292929",
                  alignSelf: "center",
                }}
              >
                <Text
                  style={{
                    fontWeight: "bold",
                    backgroundColor: index % 2 == 0 ? "grey" : "#292929",
                    color: index % 2 != 0 ? "grey" : "#292929",
                    padding: 3,
                    textAlign: "center",
                    borderRadius : 5,
                  overflow : 'hidden'
                  }}
                  numberOfLines={1}
                >
                  {thisTrack.artist}
                </Text>
              </View>
            </View>
            <View
              style={{
                justifyContent: "center",
                marginLeft: 0,
                flex: 1,
                alignItems: "center",
              }}
            >
              <TouchableOpacity
                onPress={() =>
                  alert("This feature will be availble in the next release.")
                }
              >
                <Icon
                  name="dots-three-vertical"
                  size={16}
                  color={index % 2 == 0 ? "grey" : "#292929"}
                />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <ImageBackground
          style={[styles.image2, { alignItems: "center" }]}
          source={{ uri: thisTrack.image }}
          imageStyle={{
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            // borderRadius: 15,
          }}
        >
          {/* <TouchableOpacity>
            <View
              style={{
                backgroundColor: "green",
                top: 120,
                height: 150,
                width: 150,
                borderRadius: 100,
                opacity: 0.7,
              }}
            >
              <AntDesign name="play" size={150} color="#fff" />
            </View>
          </TouchableOpacity> */}

          <View
            style={{
              bottom: 0,
              position: "absolute",
              backgroundColor: index % 2 != 0 ? "grey" : "#292929",
              width: "100%",
              opacity: 0.9,
              padding: 10,
              borderBottomLeftRadius: 15,
              borderBottomRightRadius: 15,
              marginLeft: 10,
              marginRight: 10,
            }}
          >
            <View>
              <Text
                style={[
                  styles.caption,
                  { color: index % 2 == 0 ? "grey" : "#292929" },
                ]}
              >
                {caption}
              </Text>
            </View>
            {/* <Footer
          likesCount={2}
          savesCount={2}
          commentCount={2}
          postID={'this.props.post.postID'}
          status={'Tracl'}
          trackID={'this.props.post.trackID'}
          postedAt={'this.props.post.createdAt'}
        /> */}
          </View>
        </ImageBackground>
        {/* <Image source={{ uri: thisTrack.image }} style={styles.image2} /> */}
        <View>
          {/* <View>
            <Text style={styles.caption}>{caption}</Text>
          </View> */}
        </View>
      </View>
    );
  } else if (status === "Album" || status === "Playlist") {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View
          style={[
            styles.titleContainer,
            {
              flexDirection: "row",
              borderTopLeftRadius: 15,
              borderTopRightRadius: 15,
              // borderRadius: 15,
              // borderWidth : 2,
              backgroundColor : index % 2 == 0 ? "grey" : "#292929",
              opacity : 0.6
            },
          ]}
        >
          <View style={{ flex: 1 }}>
            <ProfilePicture uri={imageUri} size={40} />
          </View>
          <View style={{ alignSelf: "center", marginLeft: 0, flex: 5 }}>
            <Text
              numberOfLines={1}
              style={{
                fontSize: 15,
                color: index % 2 != 0 ? "grey" : "#292929",
                margin: 2,
                fontFamily: "Arial",
                fontWeight: "bold",
                backgroundColor: "transparent",
                textAlign: "center",
              }}
            >
              {thisTrack.name}
            </Text>
            <View
              style={{
                padding: 0,
                alignSelf: "center",
              }}
            >
              <Text
                numberOfLines={1}
                style={{
                  fontWeight: "bold",
                  color: index % 2 == 0 ? "grey" : "#292929",
                  padding: 3,
                  textAlign: "center",
                  backgroundColor: index % 2 != 0 ? "grey" : "#292929",
                  borderRadius : 5,
                  overflow : 'hidden'
                }}
              >
                {thisTrack.artist}
              </Text>
            </View>
          </View>
          <View
            style={{
              justifyContent: "center",
              marginLeft: 0,
              flex: 1,
              alignItems: "center",
            }}
          >
            <TouchableOpacity>
              <Icon name="dots-three-vertical" size={16} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        <View
          style={{
            flexDirection: "row",
            margin: 0,
            borderRightWidth : 2,
            opacity : 0.9,
            borderColor : index % 2 == 0 ? "grey" : "#292929",
          }}
        >
          <View>
            <Image source={{ uri: thisTrack.image }} style={styles.image} />
          </View>

          <View style={styles.block}>
            <ScrollView style={{ height: 150, padding: 0 }}>
              {tracklist}
            </ScrollView>
          </View>
        </View>

        <View
          style={{
            marginTop: 0,
            backgroundColor: "transparent",
            position: "relative",
            opacity: 0.8,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
            justifyContent: "center",
            backgroundColor: index % 2 == 0 ? "grey" : "#292929",
          }}
        >
          <Text
            style={{
              fontSize: 15,
              fontWeight: "bold",
              color: index % 2 != 0 ? "grey" : "#292929",
              padding: 10,
              // backgroundColor: index % 2 == 0 ? "grey" : "#292929",
              fontFamily: "Arial",
              textAlign: "center",
              minHeight: 30,
              // borderRadius: 15,
              overflow: "hidden",
              justifyContent: "center",
            }}
          >
            {caption}
          </Text>
        </View>
      </View>
    );
  }
  // } else if (status === "Preview") {
  //   return (
  //     <View style={{ flex: 1, justifyContent: "center" }}>
  //       <View
  //         style={[
  //           styles.titleContainer,
  //           {
  //             flexDirection: "row",
  //             borderTopLeftRadius: 15,
  //             borderTopRightRadius: 15,
  //           },
  //         ]}
  //       >
  //         <View style={{ flex: 1 }}>
  //           <ProfilePicture uri={imageUri} size={40} />
  //         </View>
  //         <View style={{ alignSelf: "center", marginLeft: 0, flex: 5 }}>
  //           <Text
  //             numberOfLines={1}
  //             style={{
  //               fontSize: 15,
  //               color: "#fff",
  //               margin: 2,
  //               fontFamily: "Arial",
  //               fontWeight: "bold",
  //               backgroundColor: "transparent",
  //               textAlign: "center",
  //             }}
  //           >
  //             {thisTrack.name}
  //           </Text>
  //           <View>
  //             <Text
  //               numberOfLines={1}
  //               style={{
  //                 fontWeight: "bold",
  //                 color: "#44CF6C",
  //                 padding: 3,
  //                 textAlign: "center",
  //               }}
  //             >
  //               {thisTrack.artist}
  //             </Text>
  //           </View>
  //         </View>
  //         <View
  //           style={{
  //             justifyContent: "center",
  //             marginLeft: 0,
  //             flex: 1,
  //             alignItems: "center",
  //           }}
  //         >
  //           <TouchableOpacity>
  //             <Icon name="dots-three-vertical" size={16} color="#fff" />
  //           </TouchableOpacity>
  //         </View>
  //       </View>

  //       {/* <View
  //         style={{
  //           flexDirection: "row",
  //           margin: 0,
  //         }}
  //       >
  //         <View>
  //           <Image source={{ uri: thisTrack.image }} style={styles.image} />
  //         </View>
  //       </View> */}

  //       <ImageBackground
  //         style={[styles.image2, { alignItems: "center" }]}
  //         source={{ uri: thisTrack.image }}
  //         imageStyle={{
  //           borderBottomLeftRadius: 15,
  //           borderBottomRightRadius: 15,
  //         }}
  //       >
  //         {/* <TouchableOpacity>
  //           <View
  //             style={{
  //               backgroundColor: "green",
  //               top: 120,
  //               height: 150,
  //               width: 150,
  //               borderRadius: 100,
  //               opacity: 0.7,
  //             }}
  //           >
  //             <AntDesign name="play" size={150} color="#fff" />
  //           </View>
  //         </TouchableOpacity> */}

  //         <View
  //           style={{
  //             bottom: 0,
  //             position: "absolute",
  //             backgroundColor: "#000",
  //             width: "100%",
  //             opacity: 0.8,
  //             padding: 10,
  //             borderBottomLeftRadius: 15,
  //             borderBottomRightRadius: 15,
  //             marginLeft: 10,
  //             marginRight: 10,
  //           }}
  //         >
  //           <View>
  //             <Text style={styles.caption}>{caption}</Text>
  //           </View>
  //           {/* <Footer
  //         likesCount={2}
  //         savesCount={2}
  //         commentCount={2}
  //         postID={'this.props.post.postID'}
  //         status={'Tracl'}
  //         trackID={'this.props.post.trackID'}
  //         postedAt={'this.props.post.createdAt'}
  //       /> */}
  //         </View>
  //       </ImageBackground>

  //       <View
  //         style={{
  //           backgroundColor: "#000",
  //           position: "relative",
  //           opacity: 0.8,
  //           borderBottomLeftRadius: 15,
  //           borderBottomRightRadius: 15,
  //           justifyContent: "center",
  //         }}
  //       >
  //         <Text
  //           style={{
  //             fontSize: 15,
  //             fontWeight: "bold",
  //             color: "#F0EFF4",
  //             padding: 10,
  //             fontFamily: "Arial",
  //             textAlign: "center",
  //             minHeight: 30,
  //             justifyContent: "center",
  //           }}
  //         >
  //           {caption}
  //         </Text>
  //       </View>
  //     </View>
  //   );
  // }
};

export default Body;
