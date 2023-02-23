<template>
  <div class="message">
    <div class="author">{{author}}</div>
    <div class="message">{{message}}</div>
  </div>
</template>

<script>
export default {
  name: "MessageComponent",
  props: {
    author: {
      type: String,
      required: true
    },
    message: {
      type: String,
      required: true
    }
  }
}
</script>

<style lang="scss" scoped>
.message {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 10px;
  width: 100%;
  height: 100%;

  .author {
    font-weight: bold;
  }
}
</style>



