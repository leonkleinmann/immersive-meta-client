import store from "@/store";

export default class ContentCommand {
  constructor(content) {
    this.content = content;
  }

  async execute() {
    return new Promise((resolve) => {
      store.commit("setModalContent", this.content.html);
      store.commit("setModalOpen", true);

      this.canResume().then(() => {
        resolve();
      });
    });
  }

  async canResume(interval = 100) {
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (store.getters.modalOpen === false) {
          clearInterval(intervalId);
          resolve();
        }
      }, interval);
    });
  }
}
