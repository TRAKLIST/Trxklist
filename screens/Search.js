import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    TouchableOpacity,
    Text,
    TextInput,
    ImageBackground,
    Image,
    Button,
    RefreshControl,
    Platform,
    StatusBar,
    Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Octicons from "react-native-vector-icons/Octicons";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import * as Animatable from "react-native-animatable";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import axios from 'axios'

function wait(timeout) {
    return new Promise((res) => {
        setTimeout(res, timeout);
    });
}

function Search() {
    const [refreshing, setRefreshing] = React.useState(false);
    const [searchTerm, setSearchTerm] = React.useState('')
    const [userDetails, setUserDetails] = React.useState([])
    const textInputChange = (val) => {
        setData({
            ...data, search: val,
        });
        console.log(data.search)
    };

    const search = () => {
        console.log(data)

    }

    const follow = (recipient) => {
        console.log(recipient, 'df')
        axios
            .get(
                `https://europe-west1-projectmelo.cloudfunctions.net/api/user/${recipient}/follow`,
                {
                    headers: {
                        Authorization: `Bearer ${UserStore.authCode}`, //the token is a variable which holds the token
                    },
                }
            )
            .then((res) => {
                console.log(res, 'vrrsf')
            })

    }


    React.useEffect(() => {
        axios
            .get(
                `https://europe-west1-projectmelo.cloudfunctions.net/api/users`,
                {
                    headers: {
                        Authorization: `Bearer ${UserStore.authCode}`, //the token is a variable which holds the token
                    },
                }
            )
            .then((res) => {
                // console.log(res.data);
                let array = []
                res.data.map(users => {
                    array.push({
                        user: users.meloID,
                        image: users.image,
                        bio: users.bio
                    })
                    // setUserDetails([...userDetails, users.meloID])
                    // console.log(users.meloID, 'IJOft')
                })
                // console.log(array)
                setUserDetails(array)

            })
            .catch((err) => {
                console.log(err);
            });
    })

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        wait(2000).then(() => {
            setRefreshing(false);
            // new post

        }, [refreshing]);
    });

    return (
        <View style={styles.container}>
            <LinearGradient colors={["#A7A2A9", "#000"]} style={styles.header}>

                <StatusBar backgroundColor="#009387" barStyle="light-content" />
                <View style={styles.action}>
                    <TextInput
                        placeholder="Search for users..."
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => setSearchTerm(val)}
                    />
                </View>




            </LinearGradient>
            <LinearGradient colors={["#000", "#8D8D92"]} style={styles.footer}>
                <ScrollView
                    refreshControl={
                        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1DB954" />
                    }
                >
                    {
                        userDetails.filter(val => {
                            // console.log(val, 'dfweui')
                            if (searchTerm.length == "") {
                                return (
                                    UserStore.followingDetails.map((users) => {
                                        users.meloID
                                    })
                                )
                            } else if (searchTerm.length > 0 && searchTerm.length < 3) {
                                return
                            } else if (val.user.toLowerCase().includes(searchTerm.toLowerCase())) {
                                return val.user
                            } else return
                        }).map((user, key) => {
                            // console.log(user, 'daye')
                            // console.log(meloID.meloID)
                            return (
                                <LinearGradient colors={["#333333", "#000'"]} style={{ margin: 5, flexDirection: 'row', borderRadius: 15 }}>
                                    
                                    <View style={{ borderLeftWidth: 3.5, borderColor: '#1DB954' }} />


                                    <ImageBackground style={{ flex: 1, justifyContent: 'center', height: 70, marginRight: 10 }} imageStyle={{ borderBottomRightRadius: 10, borderTopLeftRadius: 10 }} source={{ uri: user.image }}>
                                        {/* <Image source={{ uri: user.image }} style={{ margin: 0, height: 50, width: 50, borderRadius: 30 }} /> */}
                                    </ImageBackground>
                                    <View style={{ justifyContent: 'center', flex: 2, padding: 5, paddingLeft: 20 }}>
                                        <Text style={{ color: '#1DB954', fontWeight: 'bold', fontSize: 19, fontFamily: 'sans-serif' }}>{user.user}</Text>
                                        <Text style={{ marginLeft: 5, color: '#fff', fontWeight: 'normal', fontStyle: 'italic', fontSize: 14, fontFamily: 'sans-serif', fontWeight: '450' }}>{user.bio}</Text>
                                    </View>
                                    {/* <Button title = "follow" style = {{margin : 5, right : 0, position : 'absolute'}}/> */}
                                    <TouchableOpacity style={{ justifyContent: 'center', flex: 1 }} onPress={() => follow(user.user)}>
                                        {
                                            UserStore.followingDetails.map((users) => {
                                                if (user.user == users.meloID) {
                                                    return (
                                                        <TouchableOpacity style={{ marginRight: 0, marginBottom: 0, right: 15, position: 'absolute' }}>
                                                            <SimpleLineIcons name="user-unfollow" size={30} color='#1DB954' style={{ padding: 10 }} />
                                                        </TouchableOpacity>
                                                    )
                                                }
                                                // else {
                                                //     return (
                                                //         <TouchableOpacity style={{ marginRight: 0, marginBottom: 0, right: 15, position: 'absolute' }}>
                                                //       <SimpleLineIcons name="user-follow" size={30} color='#fff' style={{ padding: 10 }} />
                                                // </TouchableOpacity>
                                                //         
                                                //     )
                                                // }
                                            })
                                        }
                                    </TouchableOpacity>

                                </LinearGradient>
                            )
                        })

                    }
                </ScrollView>
            </LinearGradient>
        </View >
    )
}

export default observer(Search)

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    header: {
        justifyContent: "flex-end",
        paddingHorizontal: 15,
        paddingBottom: 25,
        paddingTop: 50,
    },
    footer: {
        flex: 3,
        backgroundColor: "transparent",
        paddingHorizontal: 10,
        // paddingVertical: 30,
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
        backgroundColor: '#fff',
        flexDirection: "row",
        marginTop: 10,
        borderBottomWidth: 2,
        borderBottomColor: "#1DB954",
        padding: 5,
        borderRadius: 15
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
