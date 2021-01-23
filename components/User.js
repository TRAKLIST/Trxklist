import React from "react";
import {
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Text,
  Image,
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

function User({ user, isFollowing, navigation }) {
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
    <TouchableWithoutFeedback
      onPress={() => {
        navigation.navigate("Me", { user });
      }}
    >
      <View
        style={{
          flexDirection: "column",
          borderBottomWidth: 2,
          borderColor: "grey",
          marginBottom: 5,
          borderRadius: 10,
          padding: 10,
          // opacity: 0.7,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            width: "100%",
            backgroundColor: "transparent",
            borderRadius: 10,
          }}
        >
          <View
            style={{
              flex: 0.5,
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "transparent",
            }}
          >
            <Image
              source={{ uri: user.image }}
              style={{ height: 55, width: 55, borderRadius: 30 }}
            />
          </View>
          <View></View>
          <View></View>

          <View
            style={{
              justifyContent: "center",
              flex: 2,
              backgroundColor: "transparent",
              flexDirection: "column",
            }}
          >
            <View style={{ padding: 0, backgroundColor: "" }}>
              <View
                style={{
                  flexDirection: "row",
                  flex: 1,
                  backgroundColor: "transparent",
                }}
              >
                <View
                  style={{
                    backgroundColor: "transparent",
                    flex: 1,
                    justifyContent: "center",
                    flexDirection: "column",
                  }}
                >
                  <View
                    style={{
                      backgroundColor: "transparent",
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    <View
                      style={{
                        // borderBottomWidth: 2,
                        // borderRadius: 15,
                        borderColor: "#292929",
                        backgroundColor: "transparent",
                        paddingLeft: 10,
                        // margin: 10,
                        justifyContent: "center",
                      }}
                    >
                      <Text
                        numberOfLines={1}
                        style={{
                          color: "#fff",
                          fontWeight: "bold",
                          textAlign: "left",
                          fontSize: 18,
                        }}
                      >
                        {user.user}
                      </Text>
                    </View>
                  </View>
                  <View
                    style={{
                      // backgroundColor: "red",
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    <View style={{ backgroundColor: "transparent" }}>
                      <View
                        style={{
                          backgroundColor: "transparent",
                          flex: 1,
                          paddingLeft: 10,
                        }}
                      >
                        <Text
                          numberOfLines={1}
                          style={{
                            color: "grey",
                            fontWeight: "bold",
                            textAlign: "left",
                            fontSize: 10,
                          }}
                        >
                          {dayjs(user.createdAt).toString()}{" "}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                <View
                  style={{
                    flex: 0.25,
                    flexDirection: "row",
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "transparent",
                  }}
                >
                  <TouchableOpacity
                    style={{ justifyContent: "center", flex: 1 }}
                    onPress={() => onFollow(user.user)}
                  >
                    <View
                      style={{
                        // backgroundColor: following == true ? "green" : "#fff",
                        padding: 10,
                        height: 50,
                        width: 50,
                        // borderRadius: 30,
                        // opacity: 0.3,
                        // flex: 1,
                        alignItems: "center",
                        justifyContent: "center",
                        alignSelf: "center",
                      }}
                    >
                      {following == true ? (
                        <SimpleLineIcons
                          name="user-following"
                          size={25}
                          color={following == true ? "green" : "grey"}
                        />
                      ) : (
                        <SimpleLineIcons
                          name="user-follow"
                          size={25}
                          color={following == true ? "green" : "grey"}
                        />
                      )}
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <View>
              {/* <View style={{ backgroundColor: "transparent", padding: 5 }}>
                <View style={{ backgroundColor: "transparent", flex: 1 }}>
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
              </View> */}
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
