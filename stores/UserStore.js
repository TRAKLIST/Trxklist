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
      userDetails: [],
      spotifyUserDetails: {},
      allPosts: [],
      followingDetails: [],
      trackDetails: {},
      endPost: false,
      str: '',
      currentCard: {},
      image : ''
    });
  }
}

export default new UserStore();
