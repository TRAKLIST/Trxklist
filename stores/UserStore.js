import { extendObservable } from "mobx";

/**
 * UserStore
 */
class UserStore {
  constructor() {
    extendObservable(this, {
      authCode: "",
      loading: true,
      isLoggedIn: false,
      userDetails: [],
      spotifyUserDetails: {},
      followingDetails: [],
      str: '',
    });
  }
}

export default new UserStore();
