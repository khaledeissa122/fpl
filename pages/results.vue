<template>
  <v-row justify="center">
    <v-card width="90%">
      <div v-if="results">
        <v-simple-table v-if="results[0].live == true">
          <template v-slot:default>
            <thead>
              <tr>
                <th class="text-center font-weight-bold subtitle-1"></th>
                <th class="text-center font-weight-bold subtitle-1">الضيف</th>
                <th class="text-center font-weight-bold subtitle-1">التوقع</th>
                <th class="text-center font-weight-bold subtitle-1">
                  صاحب الارض
                </th>
                <th class="text-center font-weight-bold subtitle-1"></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, i) in teamsArr" :key="i">
                <td class="text-center">
                  <v-img
                    contain
                    :aspect-ratio="1"
                    class="pr-1 pl-1 mt-3"
                    max-width="20"
                    width="20"
                    height="20"
                    max-height="20"
                    transition="scale-transition"
                    :src="item.teamAImg"
                  ></v-img>
                </td>
                <td class="text-center">{{ item.teamAName }}</td>
                <td class="text-center">{{ results[0][i] }}</td>
                <td class="text-center">{{ item.teamHName }}</td>
                <td class="text-center">
                  <v-img
                    contain
                    :aspect-ratio="1"
                    class="pr-1 pl-1 mt-3"
                    max-width="20"
                    width="20"
                    height="20"
                    max-height="20"
                    transition="scale-transition"
                    :src="item.teamHImg"
                  ></v-img>
                </td>
              </tr>
            </tbody>
          </template>
        </v-simple-table>
        <v-row v-else justify="center">
          <h4 class="text-center my-3">
            سوف يتم اظهار توقع نتائج الجولة القادمة قريبا
          </h4>
        </v-row>
      </div>
      <v-row v-else justify="center">
        <v-img
          contain
          :aspect-ratio="1"
          class="pr-1 pl-1 mt-3"
          max-width="200"
          width="200"
          height="200"
          max-height="200"
          transition="scale-transition"
          src="/loader3.gif"
        ></v-img>
      </v-row>
    </v-card>
  </v-row>
</template>

<script>
import { getCollection } from "@/services/firestore/methods.js";
import { mapState, mapActions } from "vuex";
export default {
  layout: "team",
  data() {
    return {
      results: null,
      fixures: "",
      liveGameweek: "",
      allTeamsA: null,
      allTeamsH: null,
      allTeamData: null,
      teamsArr: null
    };
  },
  methods: {
    // ...mapActions("enduser", ["getFixturesData"]),
    async getFixtures() {
      this.$axios;
      const fixures = await this.$axios.$get(
        `https://intense-refuge-36904.herokuapp.com/https://fantasy.premierleague.com/api/fixtures/?event=${this.liveGameweek}`
      );
      this.fixures = fixures;
      let teamsA = {};
      let teamsH = {};
      let all = [];
      fixures.forEach((element, index) => {
        this.allTeamData.forEach((team, i) => {
          if (element.team_a == team.id) {
            teamsA[i] = {
              teamA: element.team_a,
              teamAName: team.name,
              sameId: index,
              teamAImg: `https://resources.premierleague.com/premierleague/badges/25/t${team.code}.png`
            };
          }
          if (element.team_h == team.id) {
            teamsH[i] = {
              teamH: element.team_h,
              teamHName: team.name,
              sameId: index,
              teamHImg: `https://resources.premierleague.com/premierleague/badges/25/t${team.code}.png`
            };
          }
        });
      });
      // console.log(teamsA);
      // console.log(teamsH);

      const propertyNames1 = Object.keys(teamsA);
      const propertyValues1 = Object.values(teamsA);
      const entries1 = Object.entries(teamsA);

      let finalAData = [];
      entries1.forEach(element => {
        finalAData.push(element[1]);
      });

      const propertyNames2 = Object.keys(teamsH);
      const propertyValues2 = Object.values(teamsH);
      const entries2 = Object.entries(teamsH);

      let finalHData = [];
      entries2.forEach(element => {
        finalHData.push(element[1]);
      });
      this.allTeamsA = finalAData;
      this.allTeamsH = finalHData;
      // console.log(this.allTeamsH);
    },

    async merge() {
      let finalArr = [];
      this.allTeamsA.forEach(A => {
        this.allTeamsH.forEach(H => {
          if (H.sameId == A.sameId) {
            let mainobj = { ...A, ...H };
            finalArr.push(mainobj);
          }
        });
      });
    },

    async getLiveGameweek() {
      this.$axios;
      const liveGameweek = await this.$axios.$get(
        "https://intense-refuge-36904.herokuapp.com/https://fantasy.premierleague.com/api/bootstrap-static/"
      );
      liveGameweek.events.forEach(element => {
        if (element.finished == false) {
          this.liveGameweek = element.id;
        }
      });
      let teamData = {};
      liveGameweek.teams.forEach((element, i) => {
        teamData[i] = {
          id: element.id,
          name: element.name,
          code: element.code
        };
      });

      const propertyNames = Object.keys(teamData);
      const propertyValues = Object.values(teamData);
      const entries = Object.entries(teamData);

      let finalData = [];
      entries.forEach(element => {
        finalData.push(element[1]);
      });
      this.allTeamData = finalData;
    },
    async getResults() {
      await getCollection("results").then(snap => {
        if (snap.empty) {
          console.log("هناك مشكلة برجاء اعادة فتح الصفحه");
        } else {
          let results = snap.docs.map(doc => Object.assign({}, doc.data()));
          this.results = results;
          console.log(this.results[0]);
        }
      });
    }
  },
  computed: {
    ...mapState("enduser", ["teams"]),
    ...mapState("partials", ["loading"])
  },
  async mounted() {
    await this.getLiveGameweek();
    await this.getFixtures();
    await this.merge();
    await this.getResults();
  }
};
</script>
