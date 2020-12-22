import React, { Component, useState } from "react";
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Image,
  Linking,
  Button,
  Platform,
  ImageBackground,
  StatusBar,
  Dimensions,
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
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
import base64 from "react-native-base64";
import { Buffer } from "buffer";
// import img1 from "/Users/tsb99/Documents/App-Dev/projMELO/images/Sonar1st.png";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import { acc } from "react-native-reanimated";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";

WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const FirstRoute = (request, spotifyUserDetails, promptAsync, lastPlayed) => {
  dayjs.extend(relativeTime);
  return (
    // <View style={[styles.scene, { backgroundColor: "#000" }]}>
    <LinearGradient colors={["grey", "#000"]} style={styles.footer}>
      <TouchableOpacity
        disabled={!request}
        onPress={() => {
          promptAsync();
        }}
      >
        <LinearGradient
          colors={["#1DB954", "green"]}
          style={[styles.signIn, { flexDirection: "row" }]}
        >
          <View style={{ left: 20, position: "absolute" }}>
            <MaterialCommunityIcons
              name="spotify"
              color="#fff"
              size={20}
              style={{ alignSelf: "center", margin: 7 }}
            />
          </View>

          {!spotifyUserDetails.user_email && (
            <Text
              style={[
                styles.textSign,
                {
                  color: "#fff",
                  alignSelf: "center",
                  fontSize: 13,
                  textTransform: "uppercase",
                },
              ]}
            >
              Verify Spotify
            </Text>
          )}
          {spotifyUserDetails.user_email && (
            <Text
              style={[
                styles.textSign,
                {
                  color: "#fff",
                  alignSelf: "center",
                  fontSize: 13,
                  textTransform: "uppercase",
                },
              ]}
            >
              Not You?
            </Text>
          )}
        </LinearGradient>
      </TouchableOpacity>

      <View style={{ marginTop: 10 }}>
        {/* <View> */}
        <View style={{ margin: 5, borderRadius: 15 }}>
          <View style={{ flexDirection: "row", margin: 10 }}>
            <View style={{ flex: 2, padding: 5 }}>
              <Text
                style={{ fontWeight: "bold", color: "white", opacity: 0.6 }}
              >
                name
              </Text>
            </View>
            <View style={{ flex: 4, padding: 5 }}>
              <Text style={{ fontWeight: "bold", color: "#999", opacity: 0.6 }}>
                {spotifyUserDetails.user_name}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", margin: 10 }}>
            <View style={{ flex: 2, padding: 5 }}>
              <Text
                style={{ fontWeight: "bold", color: "white", opacity: 0.6 }}
              >
                email
              </Text>
            </View>
            <View style={{ flex: 4, padding: 5 }}>
              <Text
                style={{ fontWeight: "bold", color: "#999", opacity: 0.6 }}
                numberOfLines={1}
              >
                {spotifyUserDetails.user_email}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", margin: 10 }}>
            <View style={{ flex: 2, padding: 5 }}>
              <Text
                style={{ fontWeight: "bold", color: "white", opacity: 0.6 }}
              >
                spotify uri
              </Text>
            </View>
            <View style={{ flex: 4, padding: 5 }}>
              <Text
                numberOfLines={1}
                style={{
                  fontWeight: "bold",
                  color: "#999",
                  opacity: 0.6,
                  textDecorationLine: "underline",
                }}
                onPress={() => Linking.openURL(spotifyUserDetails.profile_link)}
              >
                {spotifyUserDetails.profile_link}
              </Text>
            </View>
          </View>
          <View style={{ flexDirection: "row", margin: 10 }}>
            <View style={{ flex: 2, padding: 5 }}>
              <Text
                style={{ fontWeight: "bold", color: "white", opacity: 0.6 }}
              >
                country
              </Text>
            </View>
            <View style={{ flex: 4, padding: 5 }}>
              <Text style={{ fontWeight: "bold", color: "#999", opacity: 0.6 }}>
                {spotifyUserDetails.country}
              </Text>
            </View>
          </View>

          {/* user_name: response.display_name,
        user_image: !(response.images === undefined || response.images.length == 0) ? response.images[0].url: null,
        user_id: response.id,
        user_email: response.email,
        access_token: access_token,
        refresh_token: refresh_token,
        profile_link : response.external_urls.spotify,
        followTotal : response.followers.total, */}
        </View>
        {/* </View> */}
      </View>

      {/* <View style={[styles.button, { paddingHorizontal: 40 }]}>
      <LinearGradient colors={["#1DB954", "green"]} style={styles.signIn}>
        <Text style={[styles.textSign, { color: "#fff" }]}>Next</Text>
      </LinearGradient>
    </View> */}

      <ImageBackground
        style={{
          width: "100%",
          height: 300,
        }}
        imageStyle={{ borderRadius: 30 }}
        source={{ uri: lastPlayed.image }}
      >
        {/* {spotifyUserDetails != null && ( */}
        <View
          style={{
            backgroundColor: "green",
            top: 5,
            borderRadius: 10,
            margin: 15,
            padding: 10,
            opacity: 0.8,
            alignSelf: "flex-start",
            borderColor: "#fff",
            borderWidth: 3,
          }}
        >
          <View>
            <Text
              style={{ color: "#fff", padding: 0, fontWeight: "bold" }}
            >{`played ${lastPlayed.trackName} `}</Text>
            <Text style={{ color: "#fff", marginTop: 5, fontWeight: "bold" }}>
              {dayjs(lastPlayed.playedAt).fromNow()}
            </Text>
          </View>
        </View>
        {/* )} */}
      </ImageBackground>
    </LinearGradient>
  );
};

const SecondRoute = (spotifyUserDetails, navigation) => {
  const [authorizationCode, setAuthorizationCode] = useState("");

  const signIn = () => {
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
        // console.log(res.data);
        setAuthorizationCode(res.data.token);
        UserStore.authCode = res.data.token;

        // sessionStorage.setItem("FBIdToken", `Bearer ${res.data.token}`);
        // this.setState({
        //   loading: false,
        // });
        if (userData.email == spotifyUserDetails.user_email) {
          console.log("logged in");
          // global 'logged in signal'

          UserStore.isLoggedIn = true;
        } else {
          alert(
            `E-Mail Mismatch Error : Enter the Email Associated with the Verified Spotify Account`
          );
        }
        // console.log(res.data);
      })
      .catch((err) => {
        console.log(err);
        // this.setState({
        //   errors: err,
        //   loading: false,
        // });
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
  return (
    <LinearGradient colors={["grey", "#000"]} style={styles.footer}>
      <View style={{ marginTop: 70 }}>
        <Text
          style={{
            fontWeight: "bold",
            color: "white",
            opacity: 0.6,
            fontSize: 18,
          }}
        >
          email
        </Text>
        <View style={styles.action}>
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
            marginTop: 35,
          }}
        >
          password
        </Text>
        <View style={styles.action}>
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
          <LinearGradient colors={["#292929", "#292929"]} style={styles.signIn}>
            <Text style={[styles.textSign, { color: "#000" }]}>
              enter traklist.
            </Text>
          </LinearGradient>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignUpScreen")}
          style={{ flexDirection: "row" }}
        >
          <Text style={{ color: "#ADADAD", fontSize: "17", fontWeight: "600" }}>
            create an account
          </Text>
          <MaterialIcons name="navigate-next" color="#ADADAD" size={20} />
          {/* <Text style={[styles.textSign, { color: "#1DB954" }]}>Sign Up</Text> */}
        </TouchableOpacity>
      </View>

      {/* <Text style={(styles.text_footer, { marginTop: 35 })}>Password</Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" color="#05375a" size={20} />
          <TextInput
            placeholder="Your Email"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={() => textInputChange(val)}
          />
          <Feather name="check-circle" color="green" size={20} />
        </View>

        <View style={styles.action}>
          <FontAwesome name="user-o" color="#05375a" size={20} />
          <TextInput
            placeholder="Your Email"
            style={styles.textInput}
            autoCapitalize="none"
          />
          <Feather name="check-circle" color="green" size={20} />
        </View> */}
    </LinearGradient>
  );
};

const initialLayout = { width: Dimensions.get("window").width };

const SignInScreen = ({ navigation }) => {
  const [lastPlayed, setLastPlayed] = React.useState({});
  const [spotifyUserDetails, setSpotifyUserDetails] = useState({});
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "Spotify" },
    { key: "second", title: "Traklist" },
  ]);

  const renderScene = SceneMap({
    first: () =>
      FirstRoute(request, spotifyUserDetails, promptAsync, lastPlayed),
    second: () => SecondRoute(spotifyUserDetails, navigation),
  });

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#1DB954" }}
      style={{ backgroundColor: "grey" }}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color, margin: 8, fontWeight: "bold" }}>
          {route.title}
        </Text>
      )}
      activeColor="green"
    />
  );

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
        native: "exp://expo.io/@tsb/projects/swaipify/",
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
          // console.log(res.data);
          // access_token & refresh_token
          const { access_token, refresh_token } = res.data;
          // alert(access_token, refresh_token)
          spotifyAPI.setAccessToken(access_token);
          getSpotifyDetails(access_token, refresh_token);
          // SpotifySDK.loginWithSession(access_token, )
          // console.log(res.data)
        })
        .catch((err) => alert(err));
    }
  }, [response]);

  const getSpotifyDetails = (access_token, refresh_token) => {
    spotifyAPI.getMe().then((response) => {
      console.log(response);
      var getMe = {
        user_name: response.display_name,
        user_image: !(
          response.images === undefined || response.images.length == 0
        )
          ? response.images[0].url
          : null,
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
      console.log(recentlyPlayed);
      setLastPlayed(recentlyPlayed);
    });
  };

  return (
    <View style={styles.container}>
      <StatusBar backgroundColor="#009387" barStyle="light-content" />
      {/* <View style={styles.header}> */}
      <LinearGradient colors={["#EAEAEB", "grey"]} style={styles.header}>
        {spotifyUserDetails.user_image && (
          // <Animatable.View
          //   style={{
          //     borderRadius: 15,
          //     padding: 10,
          //   }}
          //   animation="fadeInUpBig"
          // >
          //   <Image
          //     style={{borderRadius : 20}}
          //     resizeMode="contain"
          //     source={{
          //       uri: spotifyUserDetails.user_image,
          //     }}
          //   />
          // </Animatable.View>
          <Animatable.View animation="fadeInUpBig">
            <ImageBackground
              source={{ uri: spotifyUserDetails.user_image }}
              style={{ height: "100%", width: "100%" }}
            ></ImageBackground>
          </Animatable.View>
        )}
      </LinearGradient>
      <Animatable.View style={styles.footer} animation="fadeInUpBig">
        <TabView
          navigationState={{ index, routes }}
          renderScene={renderScene}
          onIndexChange={setIndex}
          initialLayout={initialLayout}
          renderTabBar={renderTabBar}
        />
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
    backgroundColor: "#1DB954",
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    // paddingHorizontal: 20,
    // paddingBottom: 25,
    // paddingTop: 50,
  },
  footer: {
    flex: 3,
    marginTop: 5,
    backgroundColor: "grey",
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    paddingHorizontal: 10,
    // paddingVertical: 30,
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
    marginTop: 110,
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
    height: "100%",
    // backgroundColor: "whitesmoke",
    borderRadius: 40,
    borderWidth: 3,
    borderColor: "#fff",
  },
  spotifyAuth: {
    color: "green",
  },
});
