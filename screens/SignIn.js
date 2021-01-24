import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Platform,
  ImageBackground,
  StatusBar,
  Dimensions,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
  SafeAreaView,
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import Fontisto from "react-native-vector-icons/Fontisto";
import * as Animatable from "react-native-animatable";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import axios from "axios";
import qs from "qs";
import * as WebBrowser from "expo-web-browser";
import {
  makeRedirectUri,
  useAuthRequest,
  AuthSession,
} from "expo-auth-session";
import spotifyAPI from "../components/SpotifyAPI";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
// import { TouchableWithoutFeedback } from "react-native-gesture-handler";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const initialLayout = { width: Dimensions.get("window").width };

const SignInScreen = ({ navigation }) => {
  const [lastPlayed, setLastPlayed] = React.useState({});
  const [spotifyUserDetails, setSpotifyUserDetails] = useState({});
  const [loading, setLoading] = React.useState(false);
  const [loading2, setLoading2] = React.useState(false);
  const [routes] = React.useState([
    { key: "first", title: "Spotify" },
    { key: "second", title: "Traklist" },
  ]);

  const [authorizationCode, setAuthorizationCode] = useState("");

  const signIn = () => {
    // loading hookset true
    setLoading(true);
    const userData = {
      email: data.email,
      password: data.password,
    };

    axios
      .post(
        "https://europe-west1-projectmelo.cloudfunctions.net/api/login",
        userData
      )
      .then((res) => {
        setAuthorizationCode(res.data.token);
        UserStore.authCode = res.data.token;

        axios
          .get("https://europe-west1-projectmelo.cloudfunctions.net/api/user", {
            headers: {
              Authorization: `Bearer ${res.data.token}`,
            },
          })
          .then((response) => {
            // console.log(response.data.credentials.refresh_token)
            axios({
              method: "post",
              url: "https://accounts.spotify.com/api/token",
              data: qs.stringify({
                grant_type: "refresh_token",
                refresh_token: response.data.credentials.refresh_token,
                client_id: "fdb4803bdd0843918698fea00b452d03",
                client_secret: "e7c47d49963b4758885d3dddc1931dde",
              }),
              headers: {
                "content-type":
                  "application/x-www-form-urlencoded;charset=utf-8",
              },
            })
              .then((res) => {
                // console.log(res.data.access_token, "rtwrsefih");
                spotifyAPI.setAccessToken(res.data.access_token);
                getSpotifyDetails(
                  res.data.access_token,
                  response.data.credentials.refresh_token
                );
                console.log(res.data, "fverijnbyw");
                console.log(response.data.credentials.meloID, "mtrhte");
                UserStore.meloID = response.data.credentials.meloID;

                // loading hookset false
                setLoading(false);

                UserStore.isLoggedIn = true;
              })
              .catch((err) => alert(err));
          });
      })
      .catch((err) => {
        console.log(err);
        alert("Details incorrect : please try again");
      });
  };

  const [data, setData] = React.useState({
    email: "",
    password: "",
    check_textInputChange: false,
    secureTextEntry: true,
  });

  const textInputChange = (val) => {
    if (val.length != 0) {
      setData({
        ...data,
        email: val,
        check_textInputChange: true,
      });
    } else {
      setData({
        ...data,
        email: val,
        check_textInputChange: false,
      });
    }
  };

  const handlePasswordChange = (val) => {
    setData({
      ...data,
      password: val,
    });
  };

  const updateSecureTextEntry = () => {
    setData({
      ...data,
      secureTextEntry: !data.secureTextEntry,
    });
  };

  const signIn2 = () => {
    setLoading2(true)
    axios
      .post("https://europe-west1-projectmelo.cloudfunctions.net/api/login2", {
        email: spotifyUserDetails.user_email,
        refresh_token: spotifyUserDetails.refresh_token,
      })
      .then((res) => {
        // alert(res.data);

        setAuthorizationCode(res.data.token);
        UserStore.authCode = res.data.token;

        axios
          .get("https://europe-west1-projectmelo.cloudfunctions.net/api/user", {
            headers: {
              Authorization: `Bearer ${res.data.token}`,
            },
          })
          .then((response) => {
            console.log(response.data.credentials.meloID, "mtrhte");
            UserStore.meloID = response.data.credentials.meloID;
            setLoading2(false)
            UserStore.isLoggedIn = true;
          });
      })
      .catch((err) =>
        alert(
          `Error 500 : Please report this and sign in using email and password for the meanwhile. Thank you!`
        )
      );
  };

  // const renderScene = SceneMap({
  //   first: () =>
  //     FirstRoute(request, spotifyUserDetails, promptAsync, lastPlayed),
  //   second: () => SecondRoute(spotifyUserDetails, navigation),
  // });

  // const renderTabBar = (props) => (
  //   <TabBar
  //     {...props}
  //     indicatorStyle={{ backgroundColor: "#1DB954" }}
  //     style={{ backgroundColor: "grey" }}
  //     renderLabel={({ route, focused, color }) => (
  //       <Text style={{ color, margin: 8, fontWeight: "bold" }}>
  //         {route.title}
  //       </Text>
  //     )}
  //     activeColor="green"
  //   />
  // );

  const [request, response, promptAsync] = useAuthRequest(
    {
      clientId: "fdb4803bdd0843918698fea00b452d03",
      scopes: [
        "user-read-private",
        "user-read-email",
        "user-read-playback-state",
        "user-library-modify",
        "user-library-read",
        "streaming",
        "user-read-recently-played",
        "user-follow-modify",
        "user-top-read",
        "playlist-modify-public",
        "playlist-modify-private",
        "user-follow-read",
        "user-modify-playback-state",
      ],
      // In order to follow the "Authorization Code Flow" to fetch token after authorizationEndpoint
      // this must be set to false
      usePKCE: false,
      // For usage in managed apps using the proxy
      redirectUri: makeRedirectUri({
        // For usage in bare and standalone
        // native: "exp://192.168.0.67:19000/",
        // native: "exp://172.29.71.10:19000",
        // native: "exp://192.168.0.35:19000",
        // native: "exp://expo.io/@tsb/projects/swaipify/",
        native: "exp://exp.host/@traklist/traklist",
      }),
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      const { code } = response.params;
      // alert(code);

      axios({
        method: "post",
        url: "https://accounts.spotify.com/api/token",
        data: qs.stringify({
          grant_type: "authorization_code",
          code: code,
          redirect_uri: makeRedirectUri({
            // For usage in bare and standalone
            // native: "exp://192.168.0.67:19000/",
            native: "exp://192.168.0.35:19000",
            // native: "exp://expo.io/@tsb/projects/swaipify/",
            // native: "exp://172.29.71.10:19000",
          }),
          client_id: "fdb4803bdd0843918698fea00b452d03",
          client_secret: "e7c47d49963b4758885d3dddc1931dde",
        }),
        headers: {
          "content-type": "application/x-www-form-urlencoded;charset=utf-8",
        },
      })
        .then((res) => {
          const { access_token, refresh_token } = res.data;
          spotifyAPI.setAccessToken(access_token);
          getSpotifyDetails(access_token, refresh_token);
        })
        .catch((err) => alert(err));
    }
  }, [response]);

  const getSpotifyDetails = (access_token, refresh_token) => {
    spotifyAPI.getMe().then((response) => {
      // console.log(response);
      var getMe = {
        user_name: response.display_name,
        user_image: !(
          response.images === undefined || response.images.length == 0
        )
          ? response.images[0].url
          : "https://coolbackgrounds.io/images/backgrounds/white/pure-white-background-85a2a7fd.jpg",
        user_id: response.id,
        user_email: response.email,
        access_token: access_token,
        refresh_token: refresh_token,
        profile_link: response.external_urls.spotify,
        followTotal: response.followers.total,
        country: response.country,
      };
      setSpotifyUserDetails(getMe);
      UserStore.spotifyUserDetails = getMe;
    });
    spotifyAPI.getMyRecentlyPlayedTracks().then((data) => {
      let recentlyPlayed = {
        id: data.items[0].track.id,
        playedAt: data.items[0].played_at,
        albumName: data.items[0].track.album.name,
        artistName: data.items[0].track.artists[0].name,
        trackName: data.items[0].track.name,
        image: data.items[0].track.album.images[0].url,
        spotifyID: UserStore.spotifyUserDetails.user_name,
      };
      // console.log(recentlyPlayed);
      setLastPlayed(recentlyPlayed);
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      <LinearGradient colors={["#EAEAEB", "grey"]} style={styles.header}>
        {spotifyUserDetails.user_image ? (
          <View>
            <Animatable.View animation="fadeInUpBig">
              <ImageBackground
                source={{ uri: spotifyUserDetails.user_image }}
                style={{ height: "100%", width: "100%" }}
              ></ImageBackground>
            </Animatable.View>
          </View>
        ) : (
          <SafeAreaView>
            <View>
              <Animatable.Image
                animation="bounceIn"
                // duration="1500"
                style={[styles.logo, { alignSelf: "center" }]}
                resizeMode="contain"
                // source={img}
              />
              <Text
                style={{
                  textAlign: "center",
                  marginTop: 5,
                  fontSize: 20,
                  fontWeight: "bold",
                  color: "#292929",
                }}
              >
                TRAKLIST.
              </Text>
            </View>
          </SafeAreaView>
        )}
      </LinearGradient>

      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
          <LinearGradient colors={["grey", "#292929"]} style={styles.footer}>
            {/* <KeyboardAvoidingView behavior="padding"> */}
            <View style={{ marginTop: 15 }}>
              <Text
                style={{
                  fontWeight: "bold",
                  color: "white",
                  opacity: 0.6,
                  fontSize: 18,
                  marginLeft: 15,
                  marginBottom: 5,
                }}
              >
                email
              </Text>
              <View
                style={{
                  backgroundColor: "#292929",
                  borderRadius: 30,
                  flexDirection: "row",
                  padding: 10,
                  opacity: 0.4,
                }}
              >
                <FontAwesome
                  name="user-o"
                  color="#fff"
                  size={20}
                  style={{ opacity: 0.6 }}
                />
                <TextInput
                  placeholder="Your Email"
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => textInputChange(val)}
                />
                {data.check_textInputChange ? (
                  <Animatable.View animation="bounceIn">
                    <Feather
                      name="check-circle"
                      color="#fff"
                      size={20}
                      style={{ opacity: 0.6 }}
                    />
                  </Animatable.View>
                ) : null}
              </View>

              <Text
                style={{
                  fontWeight: "bold",
                  color: "white",
                  opacity: 0.6,
                  fontSize: 18,
                  marginLeft: 15,
                  marginBottom: 5,
                  marginTop: 20,
                }}
              >
                password
              </Text>
              <View
                style={{
                  backgroundColor: "#292929",
                  borderRadius: 30,
                  flexDirection: "row",
                  padding: 10,
                  opacity: 0.4,
                }}
              >
                <FontAwesome
                  name="lock"
                  color="#fff"
                  size={20}
                  style={{ opacity: 0.6 }}
                />
                <TextInput
                  placeholder="Your Password"
                  secureTextEntry={data.secureTextEntry ? true : false}
                  style={styles.textInput}
                  autoCapitalize="none"
                  onChangeText={(val) => handlePasswordChange(val)}
                />
                <TouchableOpacity onPress={updateSecureTextEntry}>
                  {data.secureTextEntry ? (
                    <Feather
                      name="eye-off"
                      color="#fff"
                      size={20}
                      style={{ opacity: 0.6 }}
                    />
                  ) : (
                    <Feather
                      name="eye"
                      color="#fff"
                      size={20}
                      style={{ opacity: 0.6 }}
                    />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.button}>
              <TouchableOpacity style={styles.signIn} onPress={signIn}>
                <LinearGradient
                  colors={["#292929", "#292929"]}
                  style={styles.signIn}
                >
                  {!loading ? (
                    <Text style={[styles.textSign, { color: "#000" }]}>
                      enter traklist.
                    </Text>
                  ) : (
                    <ActivityIndicator size="large" color="green" />
                  )}
                </LinearGradient>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => navigation.navigate("SignUpScreen")}
                style={{ flexDirection: "row" }}
              >
                <Text
                  style={{
                    color: "#ADADAD",
                    fontSize: 17,
                    fontWeight: "600",
                  }}
                >
                  create an account
                </Text>
                <MaterialIcons name="navigate-next" color="#ADADAD" size={20} />
              </TouchableOpacity>
            </View>
            {/*  */}
            {/* </KeyboardAvoidingView> */}
            <View
              style={{
                marginTop: 30,
                borderTopWidth: 1,
                borderColor: "#292929",
              }}
            >
              {/* <Text style = {{color : '#ADADAD', fontWeight : 'bold'}}>alternatively...</Text> */}

              <View style={{ marginTop: 65 }}>
                {!spotifyUserDetails.user_image ? (
                  <TouchableOpacity
                    style={styles.signIn}
                    disabled={!request}
                    onPress={() => {
                      promptAsync();
                    }}
                  >
                    <View
                      colors={["transparent"]}
                      style={[
                        styles.signIn,
                        {
                          flexDirection: "row",
                          borderWidth: 2,
                          borderColor: "#1DB954",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.textSign,
                          { color: "#1DB954", fontWeight: "500" },
                        ]}
                      >
                        sign in with {""}
                      </Text>
                      <Fontisto name="spotify" color="#1DB954" size={20} />
                    </View>
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    style={styles.signIn}
                    disabled={!request}
                    onPress={signIn2}
                  >
                    <LinearGradient
                      colors={["#1DB954", "#1DB954"]}
                      style={[styles.signIn, { flexDirection: "row" }]}
                    >
                      {!loading2 ? (
                        <Text
                          style={[
                            styles.textSign,
                            { color: "#fff", fontWeight: "500" },
                          ]}
                        >
                          enter traklist. {""}
                        </Text>
                      ) : (
                        <ActivityIndicator size="large" color="green" />
                      )}
                    </LinearGradient>
                  </TouchableOpacity>
                )}

                <TouchableOpacity style={styles.signIn} onPress={signIn}>
                  <View
                    style={[
                      styles.signIn,
                      {
                        flexDirection: "row",
                        borderWidth: 2,
                        borderColor: "#fc3158",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.textSign,
                        { color: "#fc3158", fontWeight: "500" },
                      ]}
                    >
                      sign in with{" "}
                    </Text>
                    <Fontisto name="applemusic" color="#fc3158" size={20} />
                  </View>
                </TouchableOpacity>

                <TouchableOpacity style={styles.signIn} onPress={signIn}>
                  <View
                    style={[
                      styles.signIn,
                      {
                        flexDirection: "row",
                        borderWidth: 2,
                        borderColor: "#ff7700",
                      },
                    ]}
                  >
                    <Text
                      style={[
                        styles.textSign,
                        { color: "#ff7700", fontWeight: "500" },
                      ]}
                    >
                      sign in with{" "}
                    </Text>
                    <Fontisto name="soundcloud" color="#ff7700" size={20} />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </LinearGradient>
        </TouchableWithoutFeedback>
      </Animatable.View>
    </View>
  );
};

export default observer(SignInScreen);

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#292929",
  },
  header: {
    flex: 1,
    justifyContent: "center",
  },
  footer: {
    flex: 3,
    marginTop: 5,
    backgroundColor: "grey",
    paddingHorizontal: 10,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "green",
    fontSize: 18,
    fontWeight: "bold",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 3,
    borderBottomColor: "#292929",
    borderRadius: 5,
    paddingBottom: 7,
  },
  actionError: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#FF0000",
    paddingBottom: 5,
  },
  textInput: {
    flex: 1,
    marginTop: Platform.OS === "ios" ? 0 : -12,
    paddingLeft: 10,
    color: "#fff",
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 12,
  },
  signIn: {
    width: "80%",
    justifyContent: "center",
    alignSelf: "center",
    borderRadius: 15,
    marginTop: 0,
    marginRight: 10,
    marginLeft: 10,
    padding: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
    alignSelf: "center",
  },
  logo: {
    width: height_logo * 0.55,
    height: height_logo * 0.55,
    backgroundColor: "#fff",
    borderRadius: 120,
  },
  spotifyAuth: {
    color: "green",
  },
});
