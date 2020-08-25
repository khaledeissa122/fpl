<template v-if="open">
  <v-row justify="center">
    <v-col sm="12" xs="12" md="8" lg="8">
      <v-card class="mt-n6 mb-10" width="100%">
        <v-card-title>
          {{ capatin }}
          اختر الفريق
          <v-select
            class="mr-4"
            :items="items"
            item-value="items.id"
            label="اختر الفريق"
            item-text="name"
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
          v-if="capatin"
          :headers="headers"
          :items-per-page="50"
          :items="capatin"
          :sort-desc="true"
          item-key="round"
          sort-by="round"
        >
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
      open:false,
      ip: "",
      headers: [
        {
          text: "# الجولة",
          align: "center",
          sortable: false,
          value: "round"
        },
        {
          text: " الاسم",
          align: "center",
          sortable: false,
          value: "name"
        },
        {
          text: "النقاط ",
          align: "center",
          sortable: false,
          value: "points"
        },
        {
          text: "الاهداف",
          align: "center",
          sortable: false,
          value: "goals"
        },
        {
          text: "صناعة الاهداف",
          align: "center",
          sortable: false,
          value: "assists"
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
    ...mapActions("enduser", ["getAnalyze"]),
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
      await this.getAnalyze();
    }
  },
  computed: {
    ...mapState("enduser", ["capatin"]),
    ...mapState("partials", ["loading"])
  },
  mounted() {
    this.getData();
  }
};
</script>

<style lang="scss">
.z {
  z-index: 9999 !important;
}
</style>
