import {
  setCollection,
  getCollection,
  getCollectionwithid
} from "@/services/firestore/methods.js";

export default {
  async getGroupData({ commit, dispatch }, groupId) {
    commit("partials/setLoading", true, { root: true });
    await getCollectionwithid("groups")
      .where("groupId", "==", String(groupId))
      .get()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log("error this group id not found");
        } else {
          let teams = snapshot.docs.map(doc =>
            Object.assign({}, doc.data(), { id: doc.id })
          );
          teams.forEach(element => {
            dispatch("getTeamApi", element).then(data => {
              console.log(data);
              const propertyNames = Object.keys(data);
              const propertyValues = Object.values(data);
              const entries = Object.entries(data);

              let finalData = [];
              entries.forEach(element => {
                finalData.push(element[1]);
              });

              dispatch("sorting", finalData).then(sortedData => {
                const items = [];
                if (sortedData.length > 0) {
                  for (let index = 0; index < sortedData.length; index++) {
                    sortedData[index].rank = index + 1;
                  }
                  commit("setTeamsData", sortedData);
                }
              });

              commit("partials/setLoading", false, { root: true });
            });
          });
        }
      });
  },
  async getTeamApi({}, element) {
    let team = {};
    for (var key in element.teams) {
      var obj = element.teams[key];
      await this.$axios
        .$get(
          `https://intense-refuge-36904.herokuapp.com/https://fantasy.premierleague.com/api/entry/${obj}/`
        )
        .then(data => {
          team[data.id] = {
            gwpoints: data.summary_event_points,
            totalpoints: data.summary_overall_points,
            name: data.player_first_name + " " + data.player_last_name,
            teamName: data.name,
            flag: `https://fantasy.premierleague.com/img/flags/${data.player_region_iso_code_short}.gif`
          };
          // Object.assign(totalarray,{totalpoints : data.summary_overall_points})
        });
    }
    return team;
  },
  async sum({}, array) {
    let sum = array.reduce(function(a, b) {
      return a + b;
    }, 0);
    return sum;
  },
  async getApi({}, element) {
    let totalarray = [];
    let gwarray = [];
    let name = {};
    for (var key in element.teams) {
      var obj = element.teams[key];
      await this.$axios
        .$get(
          `https://intense-refuge-36904.herokuapp.com/https://fantasy.premierleague.com/api/entry/${obj}/`
        )
        .then(data => {
          totalarray.push(data.summary_overall_points);
          gwarray.push(data.summary_event_points);
          name[data.id] = {
            frname: data.player_first_name,
            lsname: data.player_last_name
          };
          // Object.assign(totalarray,{totalpoints : data.summary_overall_points})
        });
    }
    return [totalarray, gwarray, name];
  },
  async mergeData({ dispatch }) {
    let totalGroupPoints = {};
    let gwGroupPoints = {};
    await getCollection("groups").then(snapshot => {
      if (snapshot.empty) {
      } else {
        let groups = snapshot.docs.map(doc =>
          Object.assign({}, doc.data(), { id: doc.id })
        );
        // commit("partials/setLoading", false, { root: true });
        // return groups;
        groups.forEach((element, i) => {
          let gettotal = dispatch("getApi", element);
          gettotal.then(de => {
            let totalsum = de[0].reduce(function(a, b) {
              return a + b;
            }, 0);

            let gwsum = de[1].reduce(function(a, b) {
              return a + b;
            }, 0);
            totalGroupPoints[element.id] = totalsum;
            gwGroupPoints[element.id] = gwsum;
          });
        });
      }
    });
    return [gwGroupPoints, totalGroupPoints];
  },
  async createNewGroup({ commit, state, dispatch }, data) {
    console.log(data);
    commit("partials/setLoadingCom", true, { root: true });
    try {
      await setCollection("groups", data.groupId, {
        groupId: data.groupId.replace(/\s/g, ""),
        teams: {
          team1: data.team1,
          team2: data.team2,
          team3: data.team3,
          team4: data.team4,
          team5: data.team5
        },
        facebookLink: data.facebookLink
      }).then(ref => {
        commit("partials/setLoadingCom", false, { root: true });
      });
    } catch (error) {
      commit("partials/setLoadingCom", false, { root: true });
    } finally {
      commit("partials/setLoadingCom", false, { root: true });
    }
  },

  async waitToGetData({ commit, dispatch }, data) {
    let mainobj = {};
    // let names = [];
    // let gwpoints = [];
    // let totalpoints = [];
    commit("partials/setLoading", true, { root: true });
    setTimeout(function() {
      for (const [key, value] of Object.entries(data[0])) {
        for (const [key2, value2] of Object.entries(data[1])) {
          if (key == key2) {
            mainobj[key] = { name: key, gwpoint: value, totalpoints: value2 };
          }
        }
      }
      const propertyNames = Object.keys(mainobj);
      const propertyValues = Object.values(mainobj);
      const entries = Object.entries(mainobj);

      let finalData = [];
      entries.forEach(element => {
        finalData.push(element[1]);
      });
      // console.log(finalData);
      dispatch("sorting", finalData).then(sortedData => {
        const items = [];
        if (sortedData.length > 0) {
          for (let index = 0; index < sortedData.length; index++) {
            sortedData[index].rank = index + 1;
          }
          commit("setGroupsData", sortedData);
        }
      });
      commit("partials/setLoading", false, { root: true });
    }, 8000);
  },

  sorting({}, sortData) {
    function compare(a, b) {
      // Use toUpperCase() to ignore character casing
      const bandA = a.totalpoints;
      const bandB = b.totalpoints;

      let comparison = 0;
      if (bandA < bandB) {
        comparison = 1;
      } else if (bandA > bandB) {
        comparison = -1;
      }
      return comparison;
    }
    let f = sortData.sort(compare);
    return f;
  },

  async getAllGroups({ commit, state, dispatch }) {
    // console.log(data);
    // commit("partials/setLoading", true, { root: true });
    try {
      await dispatch("mergeData").then(data => {
        dispatch("waitToGetData", data);
      });
      // console.log("allPointsData =>", allPointsData);
    } catch (error) {
      console.log(error);
      // commit("partials/setLoading", false, { root: true });
    } finally {
      // commit("partials/setLoading", false, { root: true });
    }
  },

  async getAllFixures({ commit }, teamIn) {
    // console.log(teamIn);
    commit("partials/setLoading", true, { root: true });
    var allTeams;
    var finalData = [];
    var popagan = {};
    try {
      await this.$axios
        .$get(
          `https://intense-refuge-36904.herokuapp.com/https://fantasy.premierleague.com/api/fixtures`
        )
        .then(data => {
          this.$axios
            .$get(
              "https://intense-refuge-36904.herokuapp.com/https://fantasy.premierleague.com/api/bootstrap-static/"
            )
            .then(teams => {
              allTeams = teams.teams;
              data.forEach((element, index) => {
                if (
                  element.team_a == teamIn.id ||
                  element.team_h == teamIn.id
                ) {
                  teams.teams.forEach(team => {
                    if (
                      element.team_a == team.id ||
                      element.team_h == team.id
                    ) {
                      popagan[index] = {
                        hId: element.team_h,
                        aId: element.team_a,
                        team_h_difficulty: element.team_h_difficulty,
                        team_a_difficulty: element.team_a_difficulty,
                        event: element.event,
                        name: allTeams[element.team_a - 1].name,
                        nameH: allTeams[element.team_h - 1].name,
                        teamAImg: `https://resources.premierleague.com/premierleague/badges/25/t${
                          allTeams[element.team_a - 1].code
                        }.png`,
                        teamHImg: `https://resources.premierleague.com/premierleague/badges/25/t${
                          allTeams[element.team_h - 1].code
                        }.png`,
                        sameId: index
                      };
                    }
                  });
                }
              });
            })
            .then(data => {
              const propertyNamesr = Object.keys(popagan);
              const propertyValuesr = Object.values(popagan);
              const entriesr = Object.entries(popagan);
              entriesr.forEach(element => {
                finalData.push(element[1]);
              });
              console.log(finalData);
              commit("setFixuresData", finalData);
              commit("partials/setLoading", false, { root: true });
            });
          // console.log(finalFix);
        });
    } catch (error) {
      console.log(error);
      commit("partials/setLoading", false, { root: true });
    } finally {
      commit("partials/setLoading", false, { root: true });
    }
  },
  async getAnalyze({ commit }) {
    // console.log(teamIn);
    commit("partials/setLoading", true, { root: true });
    var allTeams;
    var finalData = [];
    var popagan = {};
    try {
      await this.$axios
        .$get(
          `https://intense-refuge-36904.herokuapp.com/https://fantasy.premierleague.com/api/bootstrap-static/`
        )
        .then(event => {
          for (let index = 1; index <= event.events.length; index++) {
            this.$axios
              .$get(
                `https://intense-refuge-36904.herokuapp.com/https://fantasy.premierleague.com/api/entry/2111901/event/${index}/picks/`
              )
              .then(data => {
                data.picks.forEach(el => {
                  if (el.is_captain == true) {
                    // console.log(el)
                    event.elements.forEach(player => {
                      if (el.element == player.id) {
                        // console.log(player.first_name);
                        dispatch("delayToGetData", player.id);
                      }
                    });
                  }
                });
              });
          }
        });
    } catch (error) {
      console.log(error);
      commit("partials/setLoading", false, { root: true });
    } finally {
      commit("partials/setLoading", false, { root: true });
    }
  },

  async delayToGetData({}, id) {
    console.log("dgdf",id)
    this.$axios
      .$get(
        `https://intense-refuge-36904.herokuapp.com/https://fantasy.premierleague.com/api/element-summary/${id}/`
      )
      .then(playerPoints => {
        playerPoints.history.forEach(points => {
          if (
            points.element == player.id &&
            data.entry_history.event == points.round
          ) {
            // console.log(points)
            popagan[data.entry_history.event] = {
              id: el.element,
              name: player.first_name + " " + player.second_name,
              points: points.total_points,
              round: points.round,
              assists: points.assists,
              goals: points.goals_scored,
              bouns: points.bonus,
              selected: points.selected
            };
          }
        });
      })
      .then(ay => {
        const propertyNames = Object.keys(popagan);
        const propertyValues = Object.values(popagan);
        const entries = Object.entries(popagan);
        entries.forEach(element => {
          finalData.push(element[1]);
        });
        // console.log(finalData.length)
        if (finalData.length == 1065) {
          console.log(finalData);
          commit("setCapatinData", finalData);
        }
      });
  }
};
