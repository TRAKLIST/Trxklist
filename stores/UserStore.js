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
      allPosts : [],
      trackDetails : [],
      enablePostScreen : false,
      isFollowing : false,
      topTracks : [],
      topArtists : [],
      notifications : [],
      lyricsPage : false,
      trackIndex : 0,
      allUsers : [],
      lyricsToggle : false
    });
  }
}

export default new UserStore();
