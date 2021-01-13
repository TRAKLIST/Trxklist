import React from "react";
import {
  SafeAreaView,
  StyleSheet,
  View,
  Image,
  ScrollView,
  Button,
  Dimensions,
  RefreshControl,
  TextInput,
  Text,
  Animated,
  ImageBackground,
  ActivityIndicator,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { TabView, SceneMap } from "react-native-tab-view";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import axios from "axios";
import UserStore from "../stores/UserStore";
import { observer } from "mobx-react";

const {
  first_route,
  second_route,
  render_tab_bar,
} = require("../handlers/main");
const initialLayout = { width: Dimensions.get("window").width };

export default function AddPost({ navigation }) {
  // Caption Stuff
  const [captionHeader, setCaptionHeader] = React.useState(false);
  const [caption, setCaption] = React.useState("");
  const handleCaptionChange = (val) => setCaption(val);

  // Picker Stuff
  const [pickerHeader, setPickerHeader] = React.useState(true);
  const [selectedValue, setSelectedValue] = React.useState("Track");

  const [refreshing, setRefreshing] = React.useState(false);
  const [routes] = React.useState([
    { key: "first", title: "MUSIC" },
    { key: "second", title: "CAPTION" },
  ]);
  const [loading, setLoading] = React.useState(false);

  // TabView Stuff

  const FirstRoute = () => first_route(selectedValue);

  const SecondRoute = () => second_route(caption, selectedValue);

  const [index, setIndex] = React.useState(0);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });

  const renderTabBar = (props) => render_tab_bar(props);

  const onIndexChange = (index) => {
    setIndex(index);
    if (index == 0) {
      setPickerHeader(true);
      setCaptionHeader(false);
    } else if (index == 1) {
      setPickerHeader(false);
      setCaptionHeader(true);
    } else {
      setPickerHeader(false);
      setCaptionHeader(false);
    }
  };

  const makePost = () => {
    setLoading(true);
    Keyboard.dismiss();
    console.log("hi");
    axios
      .post(
        "https://europe-west1-projectmelo.cloudfunctions.net/api/post",
        {
          trackID: UserStore.trackDetails.id,
          spotifyID: UserStore.spotifyUserDetails.user_id,
          body: caption,
          status: selectedValue,
        },
        {
          headers: {
            Authorization: `Bearer ${UserStore.authCode}`,
          },
        }
      )
      .then((res) => {
        axios
          .get("https://europe-west1-projectmelo.cloudfunctions.net/api/posts")
          .then((res) => {
            // console.log(res.data);
            UserStore.allPosts = res.data;
            navigation.goBack();
            setLoading(false);
            setIndex(0);
            setCaption("");
            setPickerHeader(true);
            setCaptionHeader(false);
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  };

  return (
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: "transparent" }}
        behavior="padding"
      >
        <View
          style={{
            flex: 1,
            paddingHorizontal: 2,
            backgroundColor: "#292929",
          }}
        >
          <View style={{ flex: 1 }}>
            {captionHeader == false && pickerHeader == true ? (
              <View
                style={{
                  flex: 1,
                  paddingHorizontal: 2,
                  justifyContent: "center",
                }}
              >
                <Picker
                  selectedValue={selectedValue}
                  onValueChange={(itemValue, itemIndex) =>
                    setSelectedValue(itemValue)
                  }
                  itemStyle={{
                    color: "#fff",
                  }}
                >
                  {/* <Picker.Item label="Lyric" value="lyric" /> */}
                  {/* <Picker.Item label="Playlist" value="Playlist" />  */}
                  <Picker.Item label="Track" value="Track" />
                  {/* <Picker.Item label="Album" value="Album" /> */}
                  {/* <Picker.Item label="Artist" value="artist" /> */}
                </Picker>
              </View>
            ) : captionHeader == true && pickerHeader == false ? (
              <KeyboardAvoidingView style={{ flex: 1 }}>
                <View
                  style={[
                    {
                      flex: 1,
                      paddingTop: 10,
                      flexDirection: "column",
                    },
                  ]}
                >
                  <View
                    style={{
                      flexDirection: "row",
                      flex: 1,
                      justifyContent: "center",
                    }}
                  >
                    <View style={{ flex: 1, justifyContent: "center" }}>
                      <Image
                        source={{
                          uri: UserStore.spotifyUserDetails.user_image,
                        }}
                        style={{
                          height: 50,
                          width: 100,
                          borderRadius: 30,
                          alignSelf: "center",
                          flex: 1,
                        }}
                      />
                    </View>

                    <View
                      style={{
                        flex: 2,
                        justifyContent: "center",
                        paddingLeft: 10,
                      }}
                    >
                      <TextInput
                        placeholder="say sumn..."
                        autoCapitalize="none"
                        value={caption}
                        // autoCorrect={false}
                        multiline="true"
                        numberOfLines={4}
                        onChangeText={(val) => handleCaptionChange(val)}
                        style={{
                          justifyContent: "center",
                          backgroundColor: "#000",
                          borderRadius: 30,
                          borderColor: "grey",
                          flex: 1,
                          textAlign: "center",
                          // fontSize: 20,
                          opacity: 0.4,
                          color: "grey",
                          fontWeight: "bold",
                          paddingTop: 25,
                          paddingBottom: 25,
                        }}
                      />
                    </View>
                  </View>
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      paddingTop: 5,
                    }}
                  >

                      {!loading ? (
                        <View
                      style={{
                        backgroundColor: "grey",
                        borderRadius: 10,
                        backgroundColor: "#000",
                        opacity: 0.4,
                        flexDirection: "row",
                        justifyContent: "center",
                        alignItems: "center",
                        borderRadius: 30,
                      }}
                    >

                        <TouchableWithoutFeedback onPress={makePost}>
                          <MaterialCommunityIcons
                            name="send-circle"
                            color="#fff"
                            size={50}
                          />
                        </TouchableWithoutFeedback>

                        </View>
                      ) : (
                        <ActivityIndicator size="large" color="green" />
                      )}
                    
                  </View>
                </View>
              </KeyboardAvoidingView>
            ) : captionHeader == true && pickerHeader == false ? null : null}
          </View>
          <View style={{ flex: 2, paddingHorizontal: 10 }}>
            <TabView
              navigationState={{ index, routes }}
              renderScene={renderScene}
              onIndexChange={(index) => onIndexChange(index)}
              initialLayout={initialLayout}
              renderTabBar={renderTabBar}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}
