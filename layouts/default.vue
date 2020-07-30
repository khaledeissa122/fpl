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
      <n-link
        to="/"
        style="
            display: contents;
            text-decoration: none;
            color: white;
        "
      >
        <div>
          <v-toolbar-title v-text="title" class="text-left mb-n3 ml-2" />
          <small class="ml-2">Fantasy premier league</small>
        </div>
        <v-img
          contain
          :aspect-ratio="1"
          class="pr-1 pl-1"
          max-width="40"
          width="40"
          height="40"
          max-height="40"
          transition="scale-transition"
          src="/circil.png"
        ></v-img>
      </n-link>
      <v-spacer />
      <!-- <v-btn  text color="white" class="pa-1 ml-2" large nuxt to="/results">
        النتائج المتوقعه
      </v-btn>
      <v-btn text color="white" class="pa-1 ml-2" large nuxt to="/scout">
        تشكيلة الصفحة
      </v-btn> -->
      <v-switch
        class="mt-6"
        v-model="switch1"
        inset
        :label="switch1 ? 'ليل' : 'نهار'"
      ></v-switch>
    </v-app-bar>
    <v-main>
      <v-container fluid>
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
  head() {
    return {
      title: "FPL Groups",
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
  mounted() {
    var mode = localStorage.getItem("switch1");
    var val = mode === "true";
    this.switch1 = val;
    this.$vuetify.theme.dark = val;
    this.$vuetify.rtl = true;
  }
};
</script>
