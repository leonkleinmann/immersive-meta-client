<template>
  <div class="chat">
    <div class="header">Chat</div>
    <div class="messages">
      <div
        v-for="(msg, idx) in chatMessages"
        :key="idx"
        class="message"
        style="width: 100%; height: 50px; margin-left: 5px"
      >
        <MessageComponent :author="msg.author" :message="msg.message" />
      </div>
    </div>
    <div class="sender">
      <div @keydown.enter="sendMessage()" class="message">
        <input v-model="message" type="text" />
        <div @click="sendMessage()" class="button">Send</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from "vuex";
import MessageComponent from "@/components/chat/MessageComponent";
import ServerConnector from "@/connectors/server";

export default {
  name: "ChatComponent",
  components: { MessageComponent },
  data() {
    return {
      server: undefined,
      message: "",
    };
  },
  computed: {
    ...mapGetters(["setupData", "chatMessages"]),
  },
  watch: {
    chatMessages() {
      this.scrollDown();
    },
  },
  methods: {
    sendMessage() {
      if (this.message) {
        let message = {
          author: this.setupData.username,
          message: this.message,
        };

        ServerConnector.getInstance().sendMessage("CHAT_MSG", message);
        this.message = "";
      }
    },
    scrollDown() {
      const messageContainer = document.querySelectorAll(".messages")[0];
      if (messageContainer) {
        this.$nextTick(() => {
          messageContainer.scrollTo(0, messageContainer.scrollHeight);
        });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.chat {
  position: absolute;
  bottom: 0;
  left: 0;
  display: flex;
  flex-direction: column;
  width: 250px;
  font-family: "Helvetica Neue", serif !important;

  .header {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 250px;
    height: 40px;
    background: #161616;
    color: white;
    z-index: 2;
    border-radius: 5px;
  }

  .messages {
    display: flex;
    flex-direction: column;
    width: 250px;
    max-width: 250px;
    z-index: 2;
    overflow-x: hidden;
    height: 200px;
    min-height: 200px;
    max-height: 200px;
    overflow-y: scroll;
    background: lightgray;

    gap: 10px;
  }

  .sender {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
    gap: 10px;
    background: white;
    z-index: 2;
    height: 40px;

    .message {
      display: flex;
      flex-direction: row;
      gap: 20px;
      align-items: center;
      justify-content: center;
      z-index: 2;
      height: 40px;

      & input {
        width: 150px;
        height: 20px;
        border: 1px solid #161616;
      }

      .button {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 40px;
        height: 20px;
        padding: 5px;
        margin-left: auto;
        background: #161616;
        color: white;
        cursor: pointer;
      }
    }
  }
}
</style>
