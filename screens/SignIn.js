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
  Button,
  Platform,
  ImageBackground,
  StatusBar,
  Dimensions,
} from "react-native";

import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import axios from "axios";
import qs from "qs";
import * as WebBrowser from "expo-web-browser";
import { makeRedirectUri, useAuthRequest, AuthSession } from "expo-auth-session";
import spotifyAPI from "../components/SpotifyAPI";
import base64 from "react-native-base64";
import { Buffer } from "buffer";
// import img1 from "/Users/tsb99/Documents/App-Dev/projMELO/images/Sonar1st.png";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import { acc } from "react-native-reanimated";
import { TabView, SceneMap, TabBar } from 'react-native-tab-view';


WebBrowser.maybeCompleteAuthSession();

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const FirstRoute = (request, spotifyUserDetails, promptAsync) => (
  <View style={[styles.scene, { backgroundColor: '#ff4081' }]}>
    <TouchableOpacity
      disabled={!request}
      onPress={() => {
        promptAsync();
      }}
    >
      <LinearGradient colors={["#1DB954", "green"]} style={styles.signIn}>
        <MaterialCommunityIcons name="spotify" color="#fff" size={20} />
        {!spotifyUserDetails.user_email && (
          <Text style={[styles.textSign, { color: "#fff" }]}>
            Verify your Spotify Account
          </Text>
        )}
        {spotifyUserDetails.user_email && (
          <Text style={[styles.textSign, { color: "#fff" }]}>
            Not You?
          </Text>
        )}
      </LinearGradient>
    </TouchableOpacity>
  </View>
);

const SecondRoute = (spotifyUserDetails) => {
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
    <View style={[styles.scene]}>
      <View style={{ marginTop: 70 }}>
        <Text style={[styles.text_footer]}>e-mail</Text>
        <View style={styles.action}>
          <FontAwesome name="user-o" color="#fff" size={20} />
          <TextInput
            placeholder="Your Email"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => textInputChange(val)}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
            </Animatable.View>
          ) : null}
        </View>

        <Text style={[styles.text_footer, { marginTop: 35 }]}>password</Text>
        <View style={styles.action}>
          <FontAwesome name="lock" color="#fff" size={20} />
          <TextInput
            placeholder="Your Password"
            secureTextEntry={data.secureTextEntry ? true : false}
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => handlePasswordChange(val)}
          />
          <TouchableOpacity onPress={updateSecureTextEntry}>
            {data.secureTextEntry ? (
              <Feather name="eye-off" color="grey" size={20} />
            ) : (
                <Feather name="eye" color="grey" size={20} />
              )}
          </TouchableOpacity>
        </View>
      </View>


      <View style={styles.button}>
        <TouchableOpacity style={styles.signIn} onPress={signIn}>
          <LinearGradient
            colors={["#1DB954", "green"]}
            style={styles.signIn}
          >
            <Text style={[styles.textSign, { color: "#fff" }]}>
              Sign In
                </Text>
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigation.navigate("SignUpScreen")}
          style={[
            styles.signIn,
            { borderColor: "#1DB954", borderWidth: 1, marginTop: 15 },
          ]}
        >
          <Text style={[styles.textSign, { color: "#1DB954" }]}>
            Sign Up
        </Text>
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
    </View>
  )
};

const initialLayout = { width: Dimensions.get('window').width };

const SignInScreen = ({ navigation }) => {
  const [spotifyUserDetails, setSpotifyUserDetails] = useState({});
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: 'first', title: 'Spotify' },
    { key: 'second', title: 'Traklist' },
  ]);

  const renderScene = SceneMap({
    first: () => FirstRoute(request, spotifyUserDetails, promptAsync),
    second: () => SecondRoute(spotifyUserDetails),
  });

  const renderTabBar = props => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: '#1DB954' }}
      style={{ backgroundColor: 'black' }}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color, margin: 8, fontWeight: 'bold' }}>
          {route.title}
        </Text>
      )}
      activeColor='green'
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
        native: "exp://192.168.0.35:19000",
        // native: "exp://expo.io/@tsb/projects/swaipify/",
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
      var getMe = {
        user_name: response.display_name,
        user_image: response.images[0].url,
        user_id: response.id,
        user_email: response.email,
        access_token: access_token,
        refresh_token: refresh_token,
      };
      setSpotifyUserDetails(getMe);
      UserStore.spotifyUserDetails = getMe;
    });
  };



  return (
    (
      <View style={styles.container}>
        <StatusBar backgroundColor="#009387" barStyle="light-content" />
        {/* <View style={styles.header}> */}
        <LinearGradient colors={['#EAEAEB', "#000",]} style={styles.header}>
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
            <Animatable.View
              animation="fadeInUpBig"
            >
              <ImageBackground source={{ uri: spotifyUserDetails.user_image }} style={{ height: '100%', width: '100%' }}>

              </ImageBackground>
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
    )
  );
};

export default observer(SignInScreen);

const { height } = Dimensions.get("screen");
const height_logo = height * 0.28;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // backgroundColor: "grey",
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
    backgroundColor: "black",
    // borderTopLeftRadius: 30,
    // borderTopRightRadius: 30,
    paddingHorizontal: 20,
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
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f2f2f2",
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
    marginTop: 90,
  },
  signIn: {
    width: "100%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    // borderRadius: 10,
  },
  textSign: {
    fontSize: 18,
    fontWeight: "bold",
  },
  logo: {
    height: "100%",
    // backgroundColor: "whitesmoke",
    borderRadius: 40,
    borderWidth: 3,
    borderColor: '#fff'
  },
});
