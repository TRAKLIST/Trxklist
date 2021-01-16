import React, { useState } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  Dimensions,
  Platform,
  ImageBackground,
} from "react-native";

import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import { LinearGradient } from "expo-linear-gradient";
import * as Animatable from "react-native-animatable";
import FontAwesome from "react-native-vector-icons/FontAwesome";
import Feather from "react-native-vector-icons/Feather";
import { TabView, SceneMap, TabBar } from "react-native-tab-view";
import qs from "qs";
import { makeRedirectUri, useAuthRequest } from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";
import spotifyAPI from "../components/SpotifyAPI";
import axios from "axios";

WebBrowser.maybeCompleteAuthSession();
let topArtistsArray = [];
let items = [];

// Endpoint
const discovery = {
  authorizationEndpoint: "https://accounts.spotify.com/authorize",
  tokenEndpoint: "https://accounts.spotify.com/api/token",
};

const SignUpScreen = ({ navigation }) => {
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
  const [spotifyUserDetails, setSpotifyUserDetails] = useState({});

  const getSpotifyDetails = (access_token, refresh_token) => {
    spotifyAPI.getMyTopArtists().then((data) => {
      topArtistsArray = [];
      data.items.map((item) => {
        let topArtists = {
          artistName: item.name,
          image: item.images[0].url,
          id: item.id,
        };
        topArtistsArray.push(topArtists);
      });
    });

    spotifyAPI.getMyTopTracks().then((data) => {
      items = [];
      data.items.map((item) => {
        let topTracks = {
          name: item.name,
          albumName: item.album.name,
          artistName: item.artists[0].name,
          trackName: item.name,
          image: item.album.images[0].url,
          id: item.id,
        };
        items.push(topTracks);
      });
    });

    spotifyAPI.getMe().then((response) => {
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
        initial_topTracks: items,
        inital_topArtists: topArtistsArray,
      };
      setSpotifyUserDetails(getMe);
      UserStore.spotifyUserDetails = getMe;
    });
  };

  const renderScene = SceneMap({
    first: () => FirstRoute(),
    second: () => SecondRoute(navigation),
  });

  const [index, setIndex] = React.useState(0);

  const [routes] = React.useState([
    { key: "first", title: "Spotify" },
    { key: "second", title: "Traklist" },
  ]);

  const initialLayout = { width: Dimensions.get("window").width };

  const renderTabBar = (props) => (
    <TabBar
      {...props}
      indicatorStyle={{ backgroundColor: "#1DB954" }}
      style={{ backgroundColor: "#292929" }}
      renderLabel={({ route, focused, color }) => (
        <Text style={{ color, margin: 8, fontWeight: "bold" }}>
          {route.title}
        </Text>
      )}
      activeColor="green"
    />
  );

  const FirstRoute = () => {
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
              //   native: "exp://192.168.0.35:19000",
              native: "exp://expo.io/@tsb/projects/swaipify/",
              // native: "exp://172.29.71.10:19000",
            }),
            client_id: "fdb4803bdd0843918698fea00b452d03",
            client_secret: "e7c47d49963b4758885d3dddc1931dde",
          }),
          headers: {
            "content-type": "application/x-www-form-urlencoded;charset=utf-8",
          },
        }).then((res) => {
          const { access_token, refresh_token } = res.data;
          spotifyAPI.setAccessToken(access_token);
          getSpotifyDetails(access_token, refresh_token);
        });
      }
    }, [response]);

    return (
      <View style={([styles.scene], { paddingHorizontal: 5, marginTop: 20 })}>
        <TouchableOpacity
          disabled={!request}
          onPress={() => {
            promptAsync();
          }}
        >
          <View
            style={[
              styles.signIn,
              {
                flexDirection: "row",
                borderWidth: 2,
                borderColor: "#1DB954",
                borderRadius: 15,
              },
            ]}
          >
            {!spotifyUserDetails.user_email && (
              <View style={{ flexDirection: "row" }}>
                <Text
                  style={[
                    styles.textSign,
                    { color: "#1DB954", fontWeight: "500" },
                  ]}
                >
                  sign up with{" "}
                </Text>
                <MaterialCommunityIcons
                  name="spotify"
                  color="#1DB954"
                  size={20}
                />
              </View>
            )}
            {spotifyUserDetails.user_email && (
              <Text style={[styles.textSign, { color: "#fff" }]}>Not You?</Text>
            )}
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const SecondRoute = (navigation) => {
    const [authorizationCode, setAuthorizationCode] = useState("");

    const signUp = () => {
      const newUserData = {
        email: data.email,
        spotifyEmail : spotifyUserDetails.user_email,
        password: data.password,
        confirmPassword: data.confirm_password,
        meloID: data.meloID,
        spotifyID: spotifyUserDetails.user_id,
        refresh_token: spotifyUserDetails.refresh_token,
        image: spotifyUserDetails.user_image,
        topTracks: JSON.stringify(spotifyUserDetails.initial_topTracks),
        topArtists: JSON.stringify(spotifyUserDetails.inital_topArtists),
      };

      axios
        .post(
          "https://europe-west1-projectmelo.cloudfunctions.net/api/signup",
          newUserData
        )
        .then((res) => {
          console.log(res.data);
          UserStore.authCode = res.data.token;
          UserStore.isLoggedIn = true;
        })
        .catch((err) => console.log(err));
      // console.log(UserStore.isLoggedIn);
    };

    const [data, setData] = React.useState({
      meloID: "",
      email: "",
      password: "",
      confirm_password: "",
      check_textInputChange: false,
      secureTextEntry: true,
    });

    const emailInputChange = (val) => {
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
      console.log(data);
    };

    const handleMeloIDChange = (val) => {
      setData({
        ...data,
        meloID: val,
      });
      // console.log(data);
    };

    const handlePasswordChange = (val) => {
      setData({
        ...data,
        password: val,
      });
      // console.log(data);
    };

    const handleConfirmPasswordChange = (val) => {
      setData({
        ...data,
        confirm_password: val,
      });
      // console.log(data);
    };

    const updateConfirmSecureTextEntry = () => {
      setData({
        ...data,
        confirm_secureTextEntry: !data.confirm_secureTextEntry,
      });
    };

    const updateSecureTextEntry = () => {
      setData({
        ...data,
        secureTextEntry: !data.secureTextEntry,
      });
    };
    return (
      <View
        style={
          ([styles.scene],
          {
            paddingHorizontal: 10,
            marginTop: 0,
            backgroundColor: "#292929",
            height: "100%",
          })
        }
      >
        <Text
          style={{
            fontWeight: "bold",
            color: "white",
            opacity: 0.6,
            fontSize: 18,
            marginLeft: 15,
            marginBottom: 5,
            marginTop: 10,
          }}
        >
          trak.id
        </Text>
        <View
          style={{
            backgroundColor: "grey",
            borderRadius: 30,
            flexDirection: "row",
            padding: 10,
            opacity: 0.4,
          }}
        >
          <FontAwesome name="user-o" color="#fff" size={20} />
          <TextInput
            placeholder="Your meloID"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => handleMeloIDChange(val)}
          />
        </View>

        <Text
          style={{
            fontWeight: "bold",
            color: "white",
            marginTop: 10,
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
            backgroundColor: "grey",
            borderRadius: 30,
            flexDirection: "row",
            padding: 10,
            opacity: 0.4,
          }}
        >
          <FontAwesome name="envelope-o" color="#fff" size={20} />
          <TextInput
            placeholder="Your Email"
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => emailInputChange(val)}
          />
          {data.check_textInputChange ? (
            <Animatable.View animation="bounceIn">
              <Feather name="check-circle" color="green" size={20} />
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
            marginTop: 10,
          }}
        >
          password
        </Text>
        <View
          style={{
            backgroundColor: "grey",
            borderRadius: 30,
            flexDirection: "row",
            padding: 10,
            opacity: 0.4,
          }}
        >
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
              <Feather name="eye-off" color="#fff" size={20} />
            ) : (
              <Feather name="eye" color="#fff" size={20} />
            )}
          </TouchableOpacity>
        </View>

        <Text
          style={{
            fontWeight: "bold",
            color: "white",
            opacity: 0.6,
            fontSize: 18,
            marginLeft: 15,
            marginBottom: 5,
            marginTop: 10,
          }}
        >
          confirm password
        </Text>
        <View
          style={{
            backgroundColor: "grey",
            borderRadius: 30,
            flexDirection: "row",
            padding: 10,
            opacity: 0.4,
          }}
        >
          <FontAwesome name="lock" color="#fff" size={20} />
          <TextInput
            placeholder="Your Password"
            secureTextEntry={data.confirm_secureTextEntry ? true : false}
            style={styles.textInput}
            autoCapitalize="none"
            onChangeText={(val) => handleConfirmPasswordChange(val)}
          />
          <TouchableOpacity onPress={updateConfirmSecureTextEntry}>
            {data.confirm_secureTextEntry ? (
              <Feather name="eye-off" color="#fff" size={20} />
            ) : (
              <Feather name="eye" color="#fff" size={20} />
            )}
          </TouchableOpacity>
        </View>

        <TouchableOpacity onPress={signUp}>
          <View style={styles.button}>
            <LinearGradient
              colors={["grey", "grey"]}
              style={[styles.signIn, { flexDirection: "row" }]}
            >
              <Text style={[styles.textSign, { color: "#fff" }]}>
                enter traklist.
              </Text>
            </LinearGradient>
          </View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={[
            styles.signIn,
            { marginTop: 5, flexDirection : 'row' },
          ]}
        >
          <Text
            style={{
              color: "#ADADAD",
              fontSize: 17,
              fontWeight: "600",
            }}
          >
            sign in instead
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ImageBackground
        style={styles.header}
        source={{ uri: spotifyUserDetails.user_image }}
      ></ImageBackground>
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

export default observer(SignUpScreen);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 20,
    paddingBottom: 50,
  },
  footer: {
    flex: 12,
    backgroundColor: "#292929",
    paddingHorizontal: 10,
  },
  text_header: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 30,
  },
  text_footer: {
    color: "#05375a",
    fontSize: 18,
    fontWeight: "bold",
  },
  action: {
    flexDirection: "row",
    marginTop: 10,
    borderBottomWidth: 0,
    borderBottomColor: "green",
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
    fontWeight : 'bold'
  },
  errorMsg: {
    color: "#FF0000",
    fontSize: 14,
  },
  button: {
    alignItems: "center",
    marginTop: 80,
  },
  signIn: {
    width: "60%",
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
  },
});
