import React, { Component } from "react";
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

import { LinearGradient } from "expo-linear-gradient";
import Octicons from "react-native-vector-icons/Octicons";
import UserStore from "../stores/UserStore";
import Item from '../components/content-components/Item'
import { observer } from "mobx-react";
import axios from 'axios'
import { v4 as uuidv4 } from "uuid";


let array = []
let array1 = []

let array_ = []
let array1_ = []
// import React from 'react'

function wait(timeout) {
    return new Promise((res) => {
        setTimeout(res, timeout);
    });
}

function Timeline() {
    const [timeline, setTimeline] = React.useState([])
    const [refreshing, setRefreshing] = React.useState(false);

    React.useEffect(() => {
        UserStore.followingDetails.map(user => array.push(JSON.parse(user.recentlyPlayed)))

        array.map((user) =>
            user.map(item => array1.push(item)
            )
        )

        array1.sort(function (a, b) {
            return new Date(b.playedAt) - new Date(a.playedAt)
        })

        console.log(array1)

    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        wait(2000).then(() => {
            setRefreshing(false);
            // new post
            UserStore.followingDetails = []
            axios
                .get("https://europe-west1-projectmelo.cloudfunctions.net/api/user", {
                    headers: {
                        Authorization: `Bearer ${UserStore.authCode}`, //the token is a variable which holds the token
                    },
                })
                .then((res) => {
                    let following = []
                    // UserStore.userDetails = res.data;
                    res.data.following.map((item) => {
                        axios
                            .get(`https://europe-west1-projectmelo.cloudfunctions.net/api/user/${item.recipient}`, {
                                headers: {
                                    Authorization: `Bearer ${UserStore.authCode}`, //the token is a variable which holds the token
                                },
                            })
                            .then((res) => {
                                // console.log(res.data.user, 'yikuy')
                                // UserStore.userDetails = res.data;
                                UserStore.followingDetails = [...UserStore.followingDetails, res.data.user]
                                // following.push(res.data.user)
                            })
                            .catch((err) => console.log(err));
                    })
                    console.log(UserStore.followingDetails, 'gang')

                    UserStore.followingDetails.map(user => array_.push(JSON.parse(user.recentlyPlayed)))

                    array_.map((user) =>
                        user.map(item => {
                            // perform check
                            //if item.id == user.topTracks.map(fd).id
                            array1.push(item)
                        }
                        )
                    )

                    array1.sort(function (a, b) {
                        return new Date(b.playedAt) - new Date(a.playedAt)
                    })

                    console.log(array1_)


                })
                .catch((err) => console.log(err));


        }, [refreshing]);
    });
    return (
        <View style={styles.container}>
            <LinearGradient colors={["#F4F7F5", "#A7A2A9", "#EAEAEB"]} style={{ flex: 1 }}>

                <StatusBar backgroundColor="#009387" barStyle="dark-content" />
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
                    }
                >
                    {
                        array1.map(item => <Item trackID={item.id} user_name={item.spotifyID} song={item.trackName} artist={item.artistName} album={item.albumName} artwork={item.image} time={item.playedAt} />)
                    }
                </ScrollView>

            </LinearGradient>
        </View >
    )
}


export default observer(Timeline)

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
        borderBottomColor: "#007bff",
        paddingBottom: 5,
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
