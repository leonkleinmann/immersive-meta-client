<template>
  <div class="message">
    <div class="author">{{ author }}</div>
    <div class="message">{{ message }}</div>
  </div>
</template>

<script>
export default {
  name: "MessageComponent",
  props: {
    author: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.message {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 220px;
  background: white;
  border-radius: 10px;
  margin-top: 10px;
  margin-left: 5px;
  padding: 5px;
  font-size: 14px;
  overflow: hidden;

  .author {
    font-weight: bold;
    height: 5px;
  }
}
</style>
