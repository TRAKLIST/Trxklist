import React from "react";
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    TouchableOpacity,
    Text,
    TextInput,
    Image,
    Button,
    Platform,
    StatusBar,
    Dimensions,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import Octicons from "react-native-vector-icons/Octicons";
import * as Animatable from "react-native-animatable";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import axios from 'axios'

function Search() {
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


    React.useEffect(() => {
        // setUserDetails([])
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
                    array.push(users.meloID)
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

    return (
        console.log(searchTerm),
        <View style={styles.container}>
            <LinearGradient colors={["#F4F7F5", "#A7A2A9", "#EAEAEB"]} style={{ flex: 1 }}>

                <StatusBar backgroundColor="#009387" barStyle="light-content" />
                <View style={styles.action}>
                    <TextInput
                        placeholder="Search for users..."
                        style={styles.textInput}
                        autoCapitalize="none"
                        onChangeText={(val) => setSearchTerm(val)}
                    />

                    <TouchableOpacity style={{ alignItems: 'center', flex: 1, margin: 3 }} onPress={search}>
                        <LinearGradient colors={["#007bff", "#21295c"]} style={styles.signIn}>
                            <Octicons name="search" size={26} color='#fff' />
                        </LinearGradient>
                    </TouchableOpacity>
                </View>

                <View>
                    {
                        userDetails.filter(val => {
                            if (searchTerm == "") {
                                return val
                            } else if (val.toLowerCase().includes(searchTerm.toLowerCase())) {
                                return val
                            }
                        }).map((user, key) => {
                            // console.log(user, 'daye')
                            // console.log(meloID.meloID)
                            return (
                                <View style={{ margin: 5, padding: 10 }}>
                                    <View style = {{flexDirection : 'row'}}>
                                        {/* <Image source={{ uri }} style = {{margin : 5}} /> load image into firebase */}  
                                        <Text style = {{ margin : 5}}>{user}</Text>
                                    </View>

                                </View>
                            )
                        })

                    }
                </View>


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
