<template>
  <v-row justify="center" class="scroll">
    <v-dialog v-model="openNewGroup" max-width="600px" @click:outside="close">
      <v-snackbar color="green" v-model="done" :timeout="2000">
        تم انشاء المجموعة بنجاح
        <v-icon right dark>mdi-check</v-icon>
      </v-snackbar>
      <v-snackbar color="red" v-model="repetedValid" :timeout="2000">
        لا يمكنك تكرار اللاعب
        <v-icon right dark>mdi-close</v-icon>
      </v-snackbar>
      <v-overlay :value="loadingcom" :absolute="true">
        <v-img
          contain
          v-if="loadingcom"
          :aspect-ratio="1"
          class="pr-1 pl-1 mt-3"
          max-width="200"
          width="200"
          height="200"
          max-height="200"
          transition="scale-transition"
          src="/loader3.gif"
        ></v-img>
      </v-overlay>
      <v-card>
        <v-card-title class=" pb-0">
          <span class="headline">انشاء مجموعه جديد</span>
        </v-card-title>
        <v-card-text class="pb-0">
          <v-container>
            <v-form v-model="valid" ref="form">
              <v-row>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    label="اسم المجموعه"
                    @input="checkGroupName()"
                    error-count="2"
                    @keydown.space.prevent
                    :success="success"
                    hint="يجب ان يكون اسم المجموعة بالغة الانجليزية وبدون فواصل"
                    persistent-hint
                    :success-messages="successMsg"
                    :error="isUsernameError"
                    :error-messages="usernameErrorMsg"
                    required
                    dense
                    outlined
                    v-model="form.groupId"
                    :rules="groupIdRules"
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    label="الرقم التعريفي الخاص بك"
                    :rules="teamRules"
                    outlined
                    v-model="form.team1"
                    dense
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    label="الرقم التعريفي للاعب الثاني"
                    :rules="teamRules"
                    outlined
                    v-model="form.team2"
                    dense
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    label="الرقم التعريفي للاعب الثالث"
                    v-model="form.team3"
                    :rules="teamRules"
                    outlined
                    dense
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    label="الرقم التعريفي للاعب الرابع"
                    v-model="form.team4"
                    :rules="teamRules"
                    outlined
                    dense
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    label="الرقم التعريفي للاعب الخامس"
                    v-model="form.team5"
                    :rules="teamRules"
                    outlined
                    dense
                    required
                  ></v-text-field>
                </v-col>
                <v-col cols="12" class="py-0">
                  <v-text-field
                    label="رابط حساب الفيس بوك الخاص بك"
                    v-model="form.facebookLink"
                    :rules="faceRules"
                    outlined
                    dense
                    required
                  ></v-text-field>
                </v-col>
              </v-row>
            </v-form>
          </v-container>
        </v-card-text>
        <v-card-actions class="pt-0 mr-7">
          <v-btn
            color="teal darken-1"
            outlined
            :disabled="!valid"
            @click="createGroup"
            >انشاء</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-dialog>
  </v-row>
</template>

<script>
import { getCollectionwithid } from "@/services/firestore/methods.js";
import { mapState, mapActions } from "vuex";
export default {
  name: "NewGroup",
  data() {
    return {
      valid: false,
      repetedValid: false,
      done: false,
      teamsArr: [],
      form: {
        groupId: "",
        team1: "",
        team2: "",
        team3: "",
        team4: "",
        team5: "",
        facebookLink: ""
      },
      isError: false,
      errorMsg: "",
      successMsg: "",
      success: false,
      usernameErrorMsg: "",
      isUsernameError: false,
      teamRules: [
        v => !!v || "يجب كتابة الرقم التعريفي ",
        v => v.length <= 30 || "يجب الا يزيد عن 30 رقم"
      ],
      faceRules: [v => !!v || "يجب كتابة رابط حساب الفيسبوك الخاص بك"],
      groupIdRules: [
        v => !!v || "يجب كتابة اسم المجموعه",
        value => {
          const pattern = /^[A-Za-z0-9]*$/;
          return (
            pattern.test(value) || "يجب ان يكون اسم المجموعة بالغة الانجليزية"
          );
        }
      ]
    };
  },
  props: {
    openNewGroup: {
      default: false,
      type: Boolean,
      required: false
    }
  },
  computed: {
    ...mapState("partials", ["loadingcom"])
  },
  // directives: {
  //   lowercase: {
  //     bind(el, _, vnode) {
  //       el.addEventListener("keyup", e => {
  //         e.target.value = e.target.value.toLowerCase();
  //         vnode.componentInstance.$emit("input", e.target.value.toLowerCase());
  //       });
  //     }
  //   }
  // },
  methods: {
    ...mapActions("enduser", ["createNewGroup"]),
    reset() {
      this.groupId = "";
      this.team1 = "";
      this.team2 = "";
      this.team3 = "";
      this.team4 = "";
      this.team5 = "";
      this.facebookink = "";
    },
    close() {
      this.$emit("close");
      this.reset();
    },
    checkGroupName() {
      let groups = getCollectionwithid("groups");
      let groupName = groups
        .where("groupId", "==", String(this.form.groupId))
        .get()
        .then(snapshot => {
          if (snapshot.empty) {
            this.success = true;
            this.isUsernameError = false;
            this.successMsg = "هذا الاسم متاح ";
            this.usernameErrorMsg = "";
            console.log("هذا الاسم متاح");
          } else {
            this.isUsernameError = true;
            this.success = false;
            this.usernameErrorMsg = "هذا الاسم غير متاح";

          }
        })
        .catch(err => {
          this.isError = true;
          this.errorMsg = error.message;
        });
    },
    async makeArr() {
      this.teamsArr[0] = this.form.team1;
      this.teamsArr[1] = this.form.team2;
      this.teamsArr[2] = this.form.team3;
      this.teamsArr[3] = this.form.team4;
      this.teamsArr[4] = this.form.team5;
    },
    async checkRepeted(arr) {
      let sorted_arr = arr.slice().sort(); // You can define the comparing function here.
      // JS by default uses a crappy string compare.
      // (we use slice to clone the array so the
      // original array won't be modified)
      let results = [];
      for (let i = 0; i < sorted_arr.length - 1; i++) {
        if (sorted_arr[i + 1] == sorted_arr[i]) {
          results.push(sorted_arr[i]);
        }
      }
      if (results.length > 0) {
        this.repetedValid = true;
      } else {
        this.repetedValid = false;
      }
    },
    async createGroup() {
      await this.makeArr();
      await this.checkRepeted(this.teamsArr);
      if (this.valid) {
        if (!this.repetedValid) {
          await this.createNewGroup(this.form);
          this.done = true;
          setTimeout(function() {
            this.close();
          }, 1000);
        } else {
        }
      }
    }
  }
};
</script>
