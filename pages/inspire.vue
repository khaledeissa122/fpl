<template>
  <v-layout>
    <v-flex class="text-center">
      <img src="/v.png" alt="Vuetify.js" class="mb-5" />
      <blockquote class="blockquote">
        &#8220;First, solve the problem. Then, write the code.&#8221;
        <footer>
          <small>
            <em>&mdash;John Johnson</em>
          </small>
          <pre>{{ ip }}</pre>
        </footer>
      </blockquote>
    </v-flex>
  </v-layout>
</template>

<script>
export default {
  data() {
    return {
      ip: ""
    };
  },
  methods: {
    async fetchSomething() {
      this.$axios;
      const ip = await this.$axios.$get(
        "https://intense-refuge-36904.herokuapp.com/https://fantasy.premierleague.com/api/entry/663372/"
      );
      this.ip = ip;
    }
  },
  mounted() {
    this.fetchSomething();
  }
};
</script>
