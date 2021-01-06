import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  ImageBackground,
  StyleSheet,
} from "react-native";
import SimpleLineIcons from "react-native-vector-icons/SimpleLineIcons";
import Fontisto from "react-native-vector-icons/Fontisto";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";

function User({ user, isFollowing }) {
  const [following, setFollowing] = React.useState(isFollowing);

  const onFollow = (recipient) => {
    if (following) {
      // following = false
      setFollowing(false);
      axios
        .get(
          `https://europe-west1-projectmelo.cloudfunctions.net/api/user/${recipient}/unfollow`,
          {
            headers: {
              Authorization: `Bearer ${UserStore.authCode}`,
            },
          }
        )
        .then((res) => {
          // console.log(res.data, 'ferfveu'); 
          // traverse through array until melo is equal.then delete that element
          console.log(UserStore.followingDetails)
          UserStore.followingDetails.map((user, index) => {
            if(user.meloID == recipient){
              console.log(index)
              UserStore.followingDetails.splice(index, 1)
            }
          })
          
        })
        .catch((err) => {
          console.log(err);
          setFollowing(true);
        });
    } else {
      setFollowing(true);
      axios
        .get(
          `https://europe-west1-projectmelo.cloudfunctions.net/api/user/${recipient}/follow`,
          {
            headers: {
              Authorization: `Bearer ${UserStore.authCode}`,
            },
          }
        )
        .then((res) => {
          console.log(res.data, "ferfveu");
          UserStore.followingDetails.push(res.data)
        })
        .catch((err) => {
          console.log(err);
          setFollowing(false);
        });
    }
  };

  return (
    <TouchableOpacity>
      <View
        style={{
          flexDirection: "row",
          margin: 5,
          width: "100%",
          borderBottomWidth: 1,
          padding: 10,
        }}
      >
        <View style={{ flex: 1 }}>
          <ImageBackground
            source={{ uri: user.image }}
            style={{
              height: 65,
              width: 65,
            }}
            imageStyle={{
              borderRadius: 30,
            }}
          >
            <View
              style={{
                bottom: 0,
                position: "absolute",
                backgroundColor: "#44CF6C",
                borderRadius: 60,
                borderWidth: 0,
                borderColor: "#44CF6C",
                height: 30,
                width: 30,
                justifyContent: "center",
                alignItems: "center",
                opacity: 0.8,
              }}
            >
              <Fontisto
                name="spotify"
                color="#fff"
                size={11}
                style={{ padding: 2 }}
              />
            </View>
          </ImageBackground>
        </View>
        <View
          style={{
            justifyContent: "center",
            padding: 0,
            marginBottom: 3,
            flex: 2,
          }}
        >
          <Text numberOfLines={1} style={{ color: "#fff", fontWeight: "bold" }}>
            {user.user}
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              numberOfLines={1}
              style={{ color: "#ff7700", fontWeight: "bold" }}
            >
              {user.bio}{" "}
            </Text>
          </View>

          <View style={{ flexDirection: "row" }}></View>
        </View>
        <View style={{ flex: 0.5, flexDirection: "row" }}>
          {/* icons */}

          {/* <TouchableOpacity
                              style={{ justifyContent: "center", margin: 5 }}
                            >
                              <View style={styles.iconContainer2}>
                                <MaterialCommunityIcons
                                  name="content-save-outline"
                                  size={27}
                                  color={"#ff7700"}
                                />
                              </View>
                            </TouchableOpacity> */}
          <TouchableOpacity
            style={{ justifyContent: "center", margin: 5 }}
            onPress={() => onFollow(user.user)}
          >
            <View style={[styles.iconContainer2]}>
              {/* <AntDesign name="staro" size={25} color={"#ff7700"} /> */}
              {/* <SimpleLineIcons
                name="user-following"
                size={30}
                color="#44CF6C"
              /> */}

              {following == true ? (
                <SimpleLineIcons
                  name="user-following"
                  size={30}
                  color="#44CF6C"
                />
              ) : (
                <SimpleLineIcons name="user-follow" size={30} color="#44CF6C" />
              )}
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default observer(User);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#EAEAEB",
  },
  header: {
    justifyContent: "flex-end",
    paddingHorizontal: 10,
    paddingBottom: 25,
    paddingTop: 50,
  },
  footer: {
    flex: 3,
    backgroundColor: "transparent",
    paddingHorizontal: 5,
    // borderRadius: 20
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
    backgroundColor: "#fff",
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 2,
    borderBottomColor: "#fff",
    padding: 5,
    borderRadius: 15,
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
    color: "#fff",
    borderRadius: 10,
    fontWeight: "bold",
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
  iconContainer2: {
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },
});
