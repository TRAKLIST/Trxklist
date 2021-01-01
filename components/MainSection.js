import * as React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { TabView, SceneMap } from "react-native-tab-view";

const {
  first_route,
  second_route,
  third_route,
  sticky_item_view,
  recent_posts_markup,
  render_tab_bar,
} = require("../handlers/main");

const FirstRoute = () => (
  <View style={[styles.scene, { backgroundColor: "#ff4081" }]}>
    <View style={{ flex: 1, backgroundColor: "red" }}>
      {recent_posts_markup}
    </View>
  </View>
);

const SecondRoute = () => (
  <View style={[styles.scene, { backgroundColor: "#673ab7" }]} />
);

const initialLayout = { width: Dimensions.get("window").width };

export default function MainSection() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first", title: "First" },
    { key: "second", title: "Second" },
  ]);

  const renderScene = SceneMap({
    first: FirstRoute,
    second: SecondRoute,
  });
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={initialLayout}
    />
  );
}

const styles = StyleSheet.create({
  scene: {
    flex: 1,
  },
});
