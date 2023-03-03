<template>
  <div class="chat">
    <div
      class="messages"
      style="
        height: 200px;
        min-height: 200px;
        max-height: 200px;
        overflow-y: scroll;
      "
    >
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
      <input v-model="message" type="text" style="width: 200px" />
      <button @click="sendMessage()" style="width: 50px">Send</button>
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
  mounted() {
    this.server = ServerConnector.getInstance("ws://localhost:8888");
  },
  computed: {
    ...mapGetters(["setupData", "chatMessages"]),
  },
  methods: {
    sendMessage() {
      let message = {
        author: this.setupData.username,
        message: this.message,
      };

      this.server.sendMessage("CHAT_MSG", message);
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

  .messages {
    display: flex;
    flex-direction: column;
    width: 250px;
    max-width: 250px;
    border: 1px solid black;
    border-radius: 5px;
    background: white;
    z-index: 2;
    overflow-x: hidden;
  }

  .sender {
    display: flex;
    flex-direction: row;
    z-index: 2;
  }
}
</style>
