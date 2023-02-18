<template>
  <div class="avatar">
    <h1>Build your Avatar!</h1>
    <p>
      Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy
      eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam
      voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet
      clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit
      amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
      nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed
      diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.
      Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor
      sit amet.
    </p>

    <div class="configuration">
      <div class="configurator">
        Username: <input v-model="username" type="text" /> Link:
        <input v-model="link" type="text" />

        <div class="gender">
          <button
            class="btn"
            :class="[gender === 'male' ? 'active' : '']"
            @click="updateGender('male')"
          >
            Male
          </button>
          <button
            class="btn"
            :class="[gender === 'female' ? 'active' : '']"
            @click="updateGender('female')"
          >
            Female
          </button>
        </div>
      </div>

      <div class="result">
        <div class="info">
          <div class="status"></div>
          <div class="username">
            {{ username }}
          </div>
          <div class="link">
            <img alt="avatar" src="/assets/setup/link.svg" />
          </div>
        </div>
        <img alt="avatar" src="/assets/avatars/male_old.png" />
      </div>
    </div>

    <AdvanceButton class="advance" @advance="advance" />
  </div>
</template>

<script>
import AdvanceButton from "@/components/ui/AdvanceButton";
export default {
  name: "AvatarComponent",
  components: { AdvanceButton },
  data() {
    return {
      username: "Username",
      link: "https://google.com",
      gender: "male",
    };
  },
  methods: {
    advance() {
      this.$store.commit("setSetupConfig", {
        gender: this.gender,
        username: this.username,
        link: this.link,
      });
      this.$emit("advance");
    },
    updateGender(gender) {
      this.gender = gender;
    },
  },
};
</script>

<style lang="scss" scoped>
.avatar {
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding-left: 20%;
  padding-right: 20%;

  .configuration {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 50px;
    margin-top: 100px;

    .configurator {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      border: 1px solid black;
      border-radius: 10px;
      padding: 10px;
      height: 200px;
      gap: 10px;

      .gender {
        display: flex;
        flex-direction: row;
        gap: 10px;
        margin-top: 10px;

        button {
          width: 80px;
          height: 20px;
        }
      }
    }

    .result {
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      height: 200px;
      padding: 10px;

      .info {
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;
        padding: 10px;
        gap: 10px;
        border: 1px solid black;
        border-radius: 5px;
        width: 150px;
        height: 40px;

        .status {
          width: 20px;
          height: 20px;
          border-radius: 100%;
          background-color: green;
        }

        .link {
          width: 20px;
          height: 20px;

          img {
            width: 100%;
            height: 100%;
          }
        }
      }

      img {
        width: 100px;
        height: 100px;
      }
    }
  }
}
</style>
