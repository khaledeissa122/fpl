<template>
  <v-app light v-scroll="onScroll">
    <v-app-bar
      elevate-on-scroll
      :color="
        offsetTop > '40' ? this.$vuetify.theme.dark.primary : 'transparent'
      "
      :clipped-left="clipped"
      fixed
      dark
    >
      <v-img
        contain
        :aspect-ratio="1"
        class="pr-1 pl-1"
        max-width="50"
        width="50"
        height="50"
        max-height="50"
        transition="scale-transition"
        :src="require('~/assets/img/circil.png')"
      ></v-img>
      <v-toolbar-title v-text="title" />
      <v-spacer />
      <v-switch
        class="mt-6"
        v-model="switch1"
        inset
        :label="switch1 ? 'ليل' : 'نهار'"
      ></v-switch>
    </v-app-bar>
    <v-main>
      <v-container fluid>
        <v-layout class="ma-n3" justify-center align-center>
          <v-img
            class="banner"
            src="/bg2.jpg"
            :aspect-ratio="1"
            transition="scale-transition"
            height="400"
            max-height="400"
          >
            <v-row style="height:100%" justify="center" align="center">
              <v-card class="text-center">
                <v-card-text class="headline px-12">
                  <h2>{{$route.params.id ? $route.params.id : 'توقع نتائج الجولة'}}</h2>
                  <!-- <h2>{{$route.name == results ? 'توقع نتائج الجولة' : $route.params.id}}</h2> -->
                </v-card-text>
              </v-card>
            </v-row>
          </v-img>
        </v-layout>
        <nuxt />
      </v-container>
    </v-main>
    <v-footer :absolute="!fixed" app>
      <span>&copy; {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      clipped: false,
      drawer: false,
      fixed: false,
      offsetTop: 0,
      switch1: Boolean,
      items: [
        {
          icon: "mdi-apps",
          title: "Welcome",
          to: "/"
        },
        {
          icon: "mdi-chart-bubble",
          title: "Inspire",
          to: "/inspire"
        }
      ],
      miniVariant: false,
      right: true,
      rightDrawer: false,
      title: "FPL Groups"
    };
  },
  methods: {
    onScroll(e) {
      this.offsetTop = window.pageYOffset || document.documentElement.scrollTop;
    }
  },
  watch: {
    switch1() {
      this.$vuetify.theme.dark = this.switch1;
      localStorage.setItem("switch1", this.switch1);
    }
  },
  mounted() {
    var mode = localStorage.getItem("switch1");
    var val = mode === "true";
    this.switch1 = val;
    this.$vuetify.theme.dark = val;
    this.$vuetify.rtl = true;
  }
};
</script>

<style lang="scss">
// .head{
//   position: absolute;
//   top: 50%;
//   left:50%;
//   transform: translate(-50%,-50%);
// }
</style>
