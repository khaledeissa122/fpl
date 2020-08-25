<template>
  <v-row no-gutters justify="center">
    <v-col sm="12" xs="12" md="8" lg="8">
      <v-card class="mt-n6 mb-10" width="100%">
        <v-card-title>
          اختر الفريق
          <v-select
            class="mr-4"
            :items="items"
            item-value="items.id"
            label="اختر الفريق"
            item-text="name"
            @change="getAllFixures"
            return-object
          ></v-select>
          <v-spacer></v-spacer>
        </v-card-title>
        <v-row v-if="loading" justify="center" align="center">
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
        <v-data-table
          v-if="fixures"
          :headers="headers"
          :items-per-page="50"
          :items="fixures"
          :sort-desc="true"
          item-key="totalpoints"
          sort-by="totalpoints"
        >
          <template v-slot:item.sameId="props">
            <small
              class="font-weight-thin mx-5 pa-2 rounded"
              :style="
                `background:linear-gradient(to right, ${getColor2(
                  props.item.team_a_difficulty
                )} 50%, ${getColor(props.item.team_h_difficulty)} 50%)`
              "
              >VS</small
            >
          </template>
          <template v-slot:item.name="props">
            <span class="subtitle-1 font-weight-bold">
              {{ props.item.name }}
            </span>

            <v-img
              contain
              :aspect-ratio="1"
              class="pr-1 pl-1 mx-2 tab"
              max-width="30"
              width="30"
              height="30"
              max-height="30"
              transition="scale-transition"
              :src="props.item.teamAImg"
            ></v-img>
          </template>
          <template v-slot:item.nameH="props">
            <v-img
              contain
              :aspect-ratio="1"
              class="pr-1 pl-1 mx-2 tab"
              max-width="30"
              width="30"
              height="30"
              max-height="30"
              transition="scale-transition"
              :src="props.item.teamHImg"
            ></v-img>
            <span class="subtitle-1 font-weight-bold">
              {{ props.item.nameH }}
            </span>
          </template>
        </v-data-table>
      </v-card>
    </v-col>
    <v-col sm="12" md="4" xs="12" lg="4" class="z mt-n6 pr-3">
      <v-col col="12">
        <v-row no-gutters justify="center">
          <iframe
            src="https://www.facebook.com/plugins/page.php?href=https%3A%2F%2Fwww.facebook.com%2Ffantasyplnew%2F&tabs=timeline&width=340&height=500&small_header=false&adapt_container_width=true&hide_cover=false&show_facepile=true&appId=115216769146913"
            width="340"
            height="500"
            style="border:none;overflow:hidden"
            scrolling="no"
            frameborder="0"
            allowTransparency="true"
            allow="encrypted-media"
          ></iframe>
        </v-row>
      </v-col>
    </v-col>
  </v-row>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  layout: "team",
  data() {
    return {
      init: { id: 1 },
      items: [
        { id: 1, name: "Arsenal" },
        { id: 13, name: "Man Utd" },
        { id: 5, name: "Chelsea" },
        { id: 10, name: "Leeds" },
        { id: 17, name: "Spurs" },
        { id: 18, name: "West Brom" },
        { id: 2, name: "Aston Villa" },
        { id: 12, name: "Man City" },
        { id: 3, name: "Brighton" },
        { id: 15, name: "Sheffield Utd" },
        { id: 7, name: "Everton" },
        { id: 20, name: "Wolves" },
        { id: 9, name: "Leicester" },
        { id: 16, name: "Southampton" },
        { id: 14, name: "Newcastle" },
        { id: 4, name: "Burnley" },
        { id: 19, name: "West Ham" },
        { id: 11, name: "Liverpool" },
        { id: 8, name: "Fulham" },
        { id: 6, name: " Crystal Palace" }
      ],
      ip: "",
      headers: [
        {
          text: "# الجولة",
          align: "center",
          sortable: false,
          value: "event"
        },
        {
          text: "  ( H ) الفريق صاحب الارض",
          align: "center",
          sortable: false,
          value: "name"
        },
        {
          text: "درجة الصعوبة",
          align: "center",
          sortable: false,
          value: "sameId"
        },
        {
          text: "  ( A ) الفريق الضيف ",
          align: "center",
          sortable: false,
          value: "nameH"
        }
      ]
    };
  },
  head() {
    return {
      title: `FPL News | Fixtures`,
      meta: [
        {
          hid: "description",
          name: "description",
          content:
            "For fantasy premier league player groups competition make your group now with your friends"
        }
      ]
    };
  },
  methods: {
    ...mapActions("enduser", ["getAllFixures"]),
    // async fetchSomething() {
    //   this.$axios;
    //   const ip = await this.$axios.$get(
    //     "https://intense-refuge-36904.herokuapp.com/https://fantasy.premierleague.com/api/entry/663372/"
    //   );
    //   this.ip = ip;
    // }
    getColor(team_h_difficulty) {
      if (team_h_difficulty == 5) return "#560000";
      if (team_h_difficulty == 4) return "#7f1414";
      if (team_h_difficulty == 3) return "#a93a39";
      if (team_h_difficulty == 2) return "#13eba2";
      else return "#00ff87";
    },
    getColor2(team_a_difficulty) {
      if (team_a_difficulty == 5) return "#560000";
      if (team_a_difficulty == 4) return "#7f1414";
      if (team_a_difficulty == 3) return "#a93a39";
      if (team_a_difficulty == 2) return "#13eba2";
      else return "#00ff87";
    },
    async getData() {
      let id = { id: 1 };
      await this.getAllFixures(id);
    }
  },
  computed: {
    ...mapState("enduser", ["fixures"]),
    ...mapState("partials", ["loading"])
  },
  mounted() {
    this.getData();
    // this.fetchSomething();
  }
};
</script>

<style lang="scss">
table tbody tr:first-child {
  background-color: #2c3e50 !important;
  color: #fff !important;
  box-shadow: 6px 19px 42px -13px rgba(0, 0, 0, 0.26);
  display: table-row !important;
}
table tbody tr:first-child a {
  color: #fff !important;
}

table tbody .v-data-table__mobile-table-row tr:first-child {
  background-color: #2c3e50 !important;
  color: #fff !important;
  box-shadow: 6px 19px 42px -13px rgba(0, 0, 0, 0.26);
  display: table-row !important;
}

.image {
  display: list-item !important;
  list-style-position: inside !important;
  list-style-type: simp-chinese-informal;
}
.tab {
  display: inline-table;
}
.z {
  z-index: 9999 !important;
}
</style>
