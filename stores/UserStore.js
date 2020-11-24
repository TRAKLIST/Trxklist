import { extendObservable } from "mobx";

/**
 * UserStore
 */
class UserStore {
  constructor() {
    extendObservable(this, {
      username: "",
      authCode: "",
      loading: true,
      isLoggedIn: false,
      userDetails: {},
      spotifyUserDetails: {},
      allPosts: [],
      trackDetails: {},
      endPost: false,
      str: '',
      recommendArray: [{
        "albumID": "0JRDNN0AuZZiwyrOWkNDXC",
        "albumName": "Wow... That's Crazy",
        "artistName": "Wale",
        "explicit": true,
        "id": "3oYod1daHuFMb2Z0FG79OE",
        "image": "https://i.scdn.co/image/ab67616d0000b27380c9e77ba1ff58e73efce760",
        "name": "Expectations (feat. 6LACK)",
        "popularity": 56,
      }]
    });
  }
}

export default new UserStore();
