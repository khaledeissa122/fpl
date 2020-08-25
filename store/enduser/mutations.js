export default {
  // SET_USER(state, account) {
  //   state.user = account;
  // },
  setGroupsData(state, data) {
    state.groups = data
    // console.log(state.groups)
  },

  setTeamsData(state, data) {
    state.teams = data
    // console.log(state.groups)
  },
  setFixuresData(state, data) {
    state.fixures = data
    // console.log(state.groups)
  },
  setCapatinData(state,data){
    state.capatin = data
  }
  // setAuthUserData(state, data) {
  //   state.authUserData = data;
  // }
};
