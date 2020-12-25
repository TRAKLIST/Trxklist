import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#000",
  },
  iconsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderRadius: 10,
    marginTop : 5
  },
  iconContainer2: {
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },
  number: {
    marginLeft: 5,
    color: "#1150A9",
    textAlign: "center",
  },
  leftIcons: {
    flexDirection: "row",
    width: 120,
    justifyContent: "space-between",
  },
  likes: {
    fontWeight: "bold",
    margin: 3,
  },
  caption: {
    margin: 3,
  },
  postedAt: {
    color: "#21295c",
    margin: 3,
    textAlign: "right",
  },
});

export default styles;
