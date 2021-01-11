import React from "react";
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
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
import relativeTime from "dayjs/plugin/relativeTime";
import dayjs from "dayjs";

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
          // console.log(UserStore.followingDetails)
          UserStore.followingDetails.map((user, index) => {
            if (user.meloID == recipient) {
              // console.log(index)
              UserStore.followingDetails.splice(index, 1);
            }
          });
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
          // console.log(res.data, "ferfveu");
          UserStore.followingDetails.push(res.data);
        })
        .catch((err) => {
          console.log(err);
          setFollowing(false);
        });
    }
  };

  return (
    <TouchableWithoutFeedback >
      <View
        style={{
          flexDirection: "column",
          // borderWidth: 2,
          // borderColor: "green",
          margin: 5,
          borderRadius: 10,
          backgroundColor : "#000",
          opacity : 0.7
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            backgroundColor: "transparent",
          }}
        >
          {/* <View
            
          > */}
          <ImageBackground
            source={{ uri: user.image }}
            style={{
              flex: 0.8,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
            
            imageStyle = {{opacity : 1, borderRadius : 10}}
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
          {/* </View> */}
          <View
            style={{
              justifyContent: "center",
              flex: 2,
              backgroundColor: "transparent",
              flexDirection: "column",
            }}
          >
            <View style={{ padding: 0, backgroundColor: "transparent" }}>
              <View style={{ flexDirection: "row", flex: 1 }}>
                <View
                  style={{
                    backgroundColor: "transparent",
                    flex: 1,
                    justifyContent: "center",
                  }}
                >
                  <View>
                    <Text
                      numberOfLines={1}
                      style={{
                        color: "#fff",
                        fontWeight: "bold",
                        textAlign: "center",
                      }}
                    >
                      {user.user}
                    </Text>
                  </View>
                </View>

                {/* here */}

                <View
                  style={{
                    flex: 0.3,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent",
                  }}
                >
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
                    <View
                      style={{
                        backgroundColor: "#000",
                        padding: 10,
                        borderRadius: 15,
                        opacity: 0.4,
                      }}
                    >
                      {/* <AntDesign name="staro" size={25} color={"#ff7700"} /> */}
                      {/* <SimpleLineIcons
                name="user-following"
                size={30}
                color="#44CF6C"
              /> */}

                      {following == true ? (
                        <SimpleLineIcons
                          name="user-following"
                          size={23}
                          color="#44CF6C"
                        />
                      ) : (
                        <SimpleLineIcons
                          name="user-follow"
                          size={23}
                          color="#44CF6C"
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View>
              <View style={{ backgroundColor: "transparent", padding: 5 }}>
                <View style={{ backgroundColor: "transparent", flex: 1 }}>
                  {/* <Text
                    style={{
                      color: "grey",
                      fontWeight: "bold",
                      textAlign: "right",
                      fontSize: 11,
                      textTransform: "uppercase",
                    }}
                  >
                    following x users
                  </Text> */}
                  <Text
                    numberOfLines={1}
                    style={{
                      color: "grey",
                      fontWeight: "bold",
                      textAlign: "right",
                      fontSize: 10,
                    }}
                  >
                    {dayjs(user.createdAt).toString()}{" "}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>
    </TouchableWithoutFeedback>
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
