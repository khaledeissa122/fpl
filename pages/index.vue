<template>
  <div>
    <v-layout class="ma-n3" justify-center align-center>
      <v-img
        class=" banner"
        src="/bg2.jpg"
        :aspect-ratio="1"
        transition="scale-transition"
        height="650"
        max-height="650"
      >
        <v-row style="height:650px" justify="center" align="center">
          <v-card color="transparent" dark flat class="text-center">
            <v-card-text class="white--text headline">
              <h3>كون مجموعتك الان وانضم للمسابقة</h3>
            </v-card-text>
            <v-card-text class="white--text">
              <p>
                قم بتكوين خمس فرق انت واصدقائك من فانتازي الدوري الانجليزي ثم قم
                باضافة ال id الخاص بهم وتكوين مجموعتك للمنافسه
              </p>
              <hr class="my-3" />
            </v-card-text>
            <v-card-actions>
              <v-row justify="center">
                <v-btn
                  color="#2c3e50 "
                  class="px-2 mb-3 ml-3"
                  nuxt
                  to="/fixtures"
                >
                  جميع المباريات بدرجة الصعوبة
                </v-btn>
                <v-btn
                  color="teal"
                  class="px-4 mb-3 ml-3"
                  @click="openNewGroup = !openNewGroup"
                >
                  <v-icon left dark>mdi-account-multiple-plus</v-icon>
                  انشاء مجموعه جديده
                </v-btn>
                <v-btn
                  outlined
                  color="white"
                  class="px-4"
                  @click="openVideo = !openVideo"
                >
                  <v-icon left dark>mdi-information</v-icon>
                  طريقة الانضمام الي المسابقه
                </v-btn>
              </v-row>
            </v-card-actions>
          </v-card>
        </v-row>
      </v-img>
    </v-layout>
    <v-row justify="center" align="center">
      <p v-if="!groups">
      اذا لم يظهر ترتيب المجموعات قم باعادة تحميل الصفحه
      </p>
      <v-img
        contain
        v-if="loading"
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
    <v-row no-gutters justify="center">
      <v-col sm="12" xs="12" md="8" lg="8">
        <v-card v-if="groups" class="mt-n6 mb-10 elevation-5">
          <v-card-title>
            ترتيب المجموعات
            <v-spacer></v-spacer>
            <v-text-field
              v-model="search"
              append-icon="mdi-magnify"
              label="بحث"
              single-line
              hide-details
            ></v-text-field>
          </v-card-title>
          <v-data-table
            :headers="headers"
            :items="groups"
            :search="search"
            :items-per-page="50"
            no-data-text="نقوم بتحديث اللعبة من فضلك قم بتحديث الصفحة خلال دقائق"
            no-results-text="لا يوجد مجموعة بهذا الاسم"
            sort-by="totalpoints"
            :sort-desc="true"
          >
            <template v-slot:item.gwpoint="props">
              {{ props.item.gwpoint == 0 ? "-" : props.item.gwpoint }}
            </template>
            <template v-slot:item.rank="{ item }">
              {{ item.rank == 1 ? "" : item.rank }}
              <v-img
                v-if="item.rank == 1"
                :class="$vuetify.breakpoint.mobile ? 'image' : ''"
                contain
                :aspect-ratio="6"
                transition="scale-transition"
                :src="getColor(item.rank)"
              ></v-img>
            </template>
            <template v-slot:item.name="props">
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
    <NewGroup :openNewGroup="openNewGroup" @close="openNewGroup = false" />
    <Video :openVideo="openVideo" @close="openVideo = false" />
    <!-- <joinToGroup
      :openjoinToGroup="openjoinToGroup"
      @close="openjoinToGroup = false"
    /> -->
  </div>
</template>

<script>
import Logo from "~/components/Logo.vue";
// import VuetifyLogo from "~/components/VuetifyLogo.vue";
import NewGroup from "~/components/enduser/NewGroup.vue";
import Video from "~/components/enduser/Video.vue";
import { getCollectionwithid } from "@/services/firestore/methods.js";
import { mapState, mapActions } from "vuex";
export default {
  components: {
    Logo,
    NewGroup,
    Video
  },
  data() {
    return {
      groupsArr: null,
      sortedGroups: null,
      openNewGroup: false,
      openVideo: false,
      teamsData: null,
      search: "",
      headers: [
        { align: "center", text: "الترتيب#", value: "rank" },
        {
          text: "اسم المجموعه",
          align: "center",
          sortable: false,
          value: "name"
        },
        {
          text: "مجموع النقاط",
          align: "center",
          align: "center",
          value: "totalpoints"
        },
        { align: "center", text: "نقاط الجوله", value: "gwpoint" }
      ]
    };
  },

  methods: {
    ...mapActions("enduser", ["getAllGroups"]),
    async getGroups() {
      await this.getAllGroups();
    },

    getColor(rank) {
      if (rank == 1)
        return "https://img.icons8.com/doodle/48/000000/gold-medal.png";
      else return "";
    }
  },
  computed: {
    ...mapState("enduser", ["groups"]),
    ...mapState("partials", ["loading"])
  },

  mounted() {
    this.getGroups();
  }
};
</script>

<style lang="scss">
.z {
  z-index: 9999 !important;
}
</style>
