import { StyleSheet, Dimensions } from "react-native";

const styles = StyleSheet.create({
  image: {
    width: 150,
    height: 150,
    borderRadius : 20
  },
  image2: {
    height: Dimensions.get("window").width,
    borderRadius : 20
  },
  block: {
    flex: 1,
    justifyContent: "center",
  },
  postText: {
    fontSize: 25,
    textAlign: "center",
    fontStyle: "italic",
    color: "#B9FAF8",
    fontWeight: "bold",
  },
  titleContainer: {
    // alignItems: "center",
    backgroundColor: "#000",
    // marginRight: 10,
    opacity : 0.8
  },
  track: {
    backgroundColor: "#168D40",
    // backgroundColor:
    //   "linear-gradient(72deg, rgba(33,41,92,0.7497373949579832) 35%, rgba(0,123,255,1) 100%)",
    fontSize: 13,
    fontWeight: "bold",
    color: "#fff",
    fontFamily: "Arial",
    flexDirection: "row",
    justifyContent : 'center'
  },
  name: {
    fontSize: 15,
    color: "#fff",
    margin: 2,
    fontFamily: "Arial",
    fontWeight: "bold",
    backgroundColor: "transparent",
    textAlign : 'center'
  },
  artist: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#fff",
    padding: 5,
    fontFamily: "Arial",
  },
  caption: {
    fontSize: 15,
    fontWeight: "bold",
    color: "green",
    padding: 5,
    fontFamily: "Arial",
    textAlign : 'center',
    flex : 1,
  },
});

export default styles;
