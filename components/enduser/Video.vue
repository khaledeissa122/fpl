<template>
  <v-row justify="center" class="scroll">
    <v-dialog v-model="openVideo" max-width="900px" @click:outside="close">
      <v-card>
        <v-card-title class=" pb-0">
          <span class="headline">طريقة الاشتراك</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-container>
            <iframe
              frameborder="0"
              scrolling="no"
              marginheight="0"
              marginwidth="0"
               width="100%"
               height="400"
               allowfullscreen
              type="text/html"
              src="https://www.youtube.com/embed/wTh9Yl1_Mfo?autoplay=0&fs=1&iv_load_policy=3&showinfo=0&rel=0&cc_load_policy=0&start=0&end=0&origin=https://youtubeembedcode.com"
              ></iframe
            >
          </v-container>
        </v-card-text>
        <v-card-actions class="pt-0 mr-7">
          <v-btn color="teal darken-1" outlined @click="close">اغلاق</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
export default {
  name: "Video",
  data() {
    return {};
  },
  props: {
    openVideo: {
      default: false,
      type: Boolean,
      required: false
    }
  },

  methods: {
    close() {
      this.$emit("close");
    }
  }
};
</script>
