<template>
  <v-row justify="center">
    <v-card class="mt-n6" width="90%">
      <v-card-title>
        ترتيب مجموعة {{ $route.params.id ? $route.params.id : "" }}
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
        v-if="teams"
        :headers="headers"
        :items="teams"
        :sort-desc="true"
        item-key="totalpoints"
        sort-by="totalpoints"
        :hide-default-footer="true"
      >
        <template v-slot:item.gwpoints="props">
          {{ props.item.gwpoints == 0 ? "-" : props.item.gwpoints }}<br />
        </template>

        <template v-slot:item.name="props">
          <h4>{{ props.item.name }}</h4>
          <small> {{ props.item.teamName }}</small>
        </template>

        <template class="man" v-slot:item.flag="props">
          <!-- {{ props.item.flag == 0 ? "-" : props.item.flag }} -->
          <v-img
            contain
            :class="$vuetify.breakpoint.mobile ? 'image' : ''"
            :aspect-ratio="9"
            transition="scale-transition"
            :src="props.item.flag"
          ></v-img>
        </template>

        <template v-slot:item.rank="{ item }">
          {{ item.rank == 1 ? "" : item.rank }}
          <v-img
            v-if="item.rank == 1"
            contain
            :class="$vuetify.breakpoint.mobile ? 'image' : ''"
            :aspect-ratio="4"
            transition="scale-transition"
            :src="getColor(item.rank)"
          ></v-img>
        </template>
        <!-- <template v-slot:item.totalpoint="{ item }">
          <v-chip :color="getColor(item.totalpoint)" dark>{{
            item.totalpoint
          }}</v-chip>
        </template> -->
        <!-- <template v-slot:item.name="props">
          <v-card
            flat
            color="transparent"
            nuxt
            :to="{
              name: 'groups-id',
              params: { id: props.item.name }
            }"
          >
            {{ props.item.name }}
          </v-card>
        </template> -->
      </v-data-table>
      <!-- <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-center  font-weight-bold subtitle-1">اسم اللاعب</th>
            <th class="text-center font-weight-bold subtitle-1">نقاط الاسبوع</th>
            <th class="text-center font-weight-bold subtitle-1">مجموع النقاط</th>
          </tr>
        </thead>
        <tbody v-if="teams">
          <tr v-for="team in teams" :key="team.frname">
            <td class="text-center">{{ team.frname +' '+ team.lsname }}</td>
            <td class="text-center">{{ team.gwpoints }}</td>
            <td class="text-center">{{ team.totalpoints }}</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table> -->
    </v-card>
  </v-row>
</template>

<script>
import { mapState, mapActions } from "vuex";
export default {
  layout: "team",
  data() {
    return {
      ip: "",
      headers: [
        {
          text: "# الترتيب",
          align: "center",
          sortable: false,
          value: "rank"
        },
        {
          text: "الدولة",
          align: "center",
          sortable: false,
          value: "flag"
        },
        {
          text: "اسم اللاعب",
          align: "center",
          sortable: false,
          value: "name"
        },
        {
          text: "مجموع النقاط",
          align: "center",
          sortable: false,
          align: "center",
          value: "totalpoints"
        },
        {
          align: "center",
          sortable: false,
          text: "نقاط الجوله",
          value: "gwpoints"
        }
      ]
    };
  },
  methods: {
    ...mapActions("enduser", ["getGroupData"]),
    // async fetchSomething() {
    //   this.$axios;
    //   const ip = await this.$axios.$get(
    //     "https://intense-refuge-36904.herokuapp.com/https://fantasy.premierleague.com/api/entry/663372/"
    //   );
    //   this.ip = ip;
    // }
    getColor(rank) {
      if (rank == 1)
        return "https://img.icons8.com/doodle/48/000000/gold-medal.png";
      else return "";
    },
    async getData() {
      await this.getGroupData(this.$route.params.id);
    }
  },
  computed: {
    ...mapState("enduser", ["teams"]),
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

table tbody .v-data-table__mobile-table-row tr:first-child{
    background-color: #2c3e50 !important;
  color: #fff !important;
  box-shadow: 6px 19px 42px -13px rgba(0, 0, 0, 0.26);
  display: table-row !important;
}

.image{
  display: list-item !important;
    list-style-position: inside !important;
    list-style-type:simp-chinese-informal;
}
// table tbody tr .man {
//   display: flex;
//   justify-content: center;
// }
</style>
