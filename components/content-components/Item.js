import React, { useState, useEffect } from 'react'
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
import UserStore from "../../stores/UserStore"
import relativeTime from 'dayjs/plugin/relativeTime'
import dayjs from 'dayjs'
import { LinearGradient } from "expo-linear-gradient";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import ADIcon from "react-native-vector-icons/AntDesign";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import Feather from "react-native-vector-icons/Feather";
import spotifyAPI from '../SpotifyAPI'
import axios from 'axios'

export default function Item(props) {
    const [isSaved, setIsSave] = useState(false);
    const [isLiked, setIsLike] = useState(false);
    const [likesCount, setLikesCount] = useState(0);
    dayjs.extend(relativeTime)


    useEffect(() => {
        spotifyAPI
            .containsMySavedTracks([props.trackID])
            .then((response) => {
                if (response[0] === true) {
                    setIsSave(true);
                    // console.log(`Saved ${status}`);
                }
            })
            .catch((err) => {
                setIsSave(false);
                console.log('err');
            });
    })

    const onSavePressed = () => {
        if (!isSaved) {
            setIsSave(true);
            spotifyAPI
                .addToMySavedTracks([props.trackID])
                .then((response) => {
                    // console.log(response);
                })
                .catch((err) => {
                    setIsSave(false);
                    console.log(err);
                });
        }

    }

    const onLikePressed = () => {
        const amount = isLiked ? -1 : 1;
        setLikesCount(likesCount + amount);
        setIsLike(!isLiked);
        if (!isLiked) {
          axios
            .get(
              `https://europe-west1-projectmelo.cloudfunctions.net/api/post/${props.spotifyID}${props.trackID}/like`,
              {
                headers: {
                  Authorization: `Bearer ${UserStore.authCode}`, //the token is a variable which holds the token
                },
              }
            )
            .then((res) => {
            //   console.log("success");
            })
            .catch((err) => {
              setIsLike(isLiked);
              setLikesCount(likesCount);
              console.log(err);
            });
        } else {
          axios
            .get(
              `https://europe-west1-projectmelo.cloudfunctions.net/api/post/${props.spotifyID}${props.trackID}/unlike`,
              {
                headers: {
                  Authorization: `Bearer ${UserStore.authCode}`, //the token is a variable which holds the token
                },
              }
            )
            .then((res) => {
            //   console.log("success");
            })
            .catch((err) => {
              setIsLike(isLiked);
              setLikesCount(likesCount);
              console.log(err);
            });
        }
      };


    return (
        <View style={{ flexDirection: 'column', padding: 0, marginBottom: 0, borderRadius: 5, borderBottomWidth: 1, borderColor: '#fff' }}>
            <View style={{ borderRadius: 0 }}>
                <View style={[styles.action, { margin: 5 }]}>
                    <View style={{ flexDirection: 'row' }}>
                        <Image source={{ uri: UserStore.spotifyUserDetails.user_image }} style={{ width: 30, height: 30, borderRadius: 20 }} />
                        <Text style={{ padding: 5, fontWeight: 'bold', color: 'whitesmoke', }}>{props.user_name}</Text>
                    </View>
                    <View style={{ right: 0, position: 'absolute', flexDirection: 'row' }}>

                        <View style={{ padding: 5, marginRight: 8 }}>
                            {/* <TouchableOpacity onPress={onLikePressed}>
                                <View style={styles.iconContainer2}>
                                    {isLiked ? (
                                        <ADIcon
                                            name="heart"
                                            size={25}
                                            color={"#e73838"}
                                            style={{ margin: 0 }}
                                        />
                                    ) : (
                                            <ADIcon
                                                name="hearto"
                                                size={25}
                                                color={"#21295c"}
                                                style={{ margin: 0 }}
                                            />
                                        )}
                                    
                                </View>
                            </TouchableOpacity> */}
                        </View>

                        <View style={{ padding: 5, marginRight: 8 }}>
                            {/* <MaterialCommunityIcons
                                name="content-save-outline"
                                size={25}
                                color={"#fff"}
                                style={{ marginRight: 0 }}
                            /> */}

                            <TouchableOpacity onPress={onSavePressed}>
                                <View style={styles.iconContainer2}>
                                    {isSaved ? (
                                        <MaterialCommunityIcons
                                            name="content-save"
                                            size={25}
                                            color={"#1DB954"}
                                            style={{ margin: 0 }}
                                        />
                                    ) : (
                                            <MaterialCommunityIcons
                                                name="content-save-outline"
                                                size={25}
                                                color={"#21295c"}
                                                style={{ margin: 0 }}
                                            />
                                        )}
                                </View>
                            </TouchableOpacity>
                        </View>

                        <View style={{ padding: 5, marginRight: 8 }}>
                            <Feather
                                name="share-2"
                                size={25}
                                color={"#1DB954"}
                                style={{ marginRight: 0 }}
                            />
                        </View>
                    </View>
                </View>
                <View style={styles.action}>
                    {/* <TouchableOpacity style={{ alignItems: 'center', flex: 1, margin: 3 }} >
                                <LinearGradient colors={["#007bff", "#21295c"]} > */}
                    {/* </LinearGradient>
                            </TouchableOpacity> */}

                    <View style={{ flex: 3, alignItems: 'flex-start', justifyContent: 'center', padding: 5 }}>
                        <Text numberOfLines={1} style={{ fontSize: 20, color: 'whitesmoke', fontWeight: 'bold', margin: 2 }}>{props.song}</Text>
                        <Text numberOfLines={1} style={{ fontSize: 15, fontWeight: 'bold', backgroundColor: 'whitesmoke', margin: 2, padding: 5, color: 'grey' }}>{props.artist}</Text>
                        {/* <Text numberOfLines = {1} style = {{margin : 5}}>{props.album}</Text> */}
                        {/* {props.album != props.song ?
                    <View style={{ flexDirection: 'row', alignSelf: 'center', borderRadius: 3, bottom: 0, margin : 10, position: 'relative' }}>
                      <MaterialIcons name='album' size={20} style={{ padding: 0, color: '#EEEEFF' }} />
                      <Text numberOfLines={1} style={styles.text}>{" "}{props.album}</Text>
                    </View>
                    :
                    null
                  } */}
                    </View>


                    <Image source={{ uri: props.artwork }} style={{ width: 90, height: 90, borderRadius: 20, margin: 10 }} />



                </View>
                <View style={styles.action1}>
                    <Text style={{ fontWeight: 'bold', backgroundColor: 'whitesmoke', margin: 2, padding: 5, color: 'grey' }}>{dayjs(props.time).fromNow()}</Text>
                </View>
            </View>

        </View>
    )
}


const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        justifyContent: "flex-end",
        paddingHorizontal: 20,
        paddingBottom: 25,
        paddingTop: 50,
    },
    footer: {
        flex: 3,
        backgroundColor: "transparent",
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    text_header: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: 30,
    },
    text_footer: {
        color: "#05375a",
        fontSize: 18,
    },
    action: {
        flexDirection: "row",
        marginTop: 10,
        borderBottomWidth: 1.5,
        borderBottomColor: "whitesmoke",
        paddingBottom: 5,
        // borderBottomWidth : 3,
        // borderColor : '#fff'
    },
    action1: {
        flexDirection: "row",
        marginTop: 10,
        borderBottomWidth: 1.5,
        borderBottomColor: "yellow",
        paddingBottom: 5,
        alignSelf: 'flex-end'
    },
    actionError: {
        flexDirection: "row",
        marginTop: 10,
        borderBottomWidth: 1,
        borderBottomColor: "#FF0000",
        paddingBottom: 5,
    },
    textInput: {
        flex: 5,
        marginTop: Platform.OS === "ios" ? 0 : -12,
        padding: 10,
        color: "#05375a",
        borderRadius: 10,
    },
    errorMsg: {
        color: "#FF0000",
        fontSize: 14,
    },
    button: {
        alignItems: "center",
        marginTop: 50,
    },
    signIn: {
        width: "100%",
        height: 50,
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 10,
    },
    textSign: {
        fontSize: 18,
        fontWeight: "bold",
    },
    logo: {
        width: "100%",
        height: "100%",
        // backgroundColor: "whitesmoke",
        borderRadius: 20,
    },
});
