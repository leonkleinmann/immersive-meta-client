import store from "@/store";
import Command from "@/components/world/commands/Command";

/**
 * Class which represents ContentComand NPCs can execute
 */
export default class ContentCommand extends Command{
  /**
   * Constructor of ContentCommand
   * @param content content to display by execute
   */
  constructor(content) {
    super();
    this.content = content;
  }

  /**
   * Function which displays the corresponding content
   * @returns {Promise<unknown>} returns a promise caller can wait for
   */
  async execute() {
    return new Promise((resolve) => {
      store.commit("setModalContent", this.content.html);
      store.commit("setModalOpen", true);

      this.canResume().then(() => {
        resolve();
      });
    });
  }

  /**
   * Function which checks of promise of execute() is resolved
   * @param interval interval pause duration
   * @returns {Promise<unknown>} returns promise caller can wait for
   */
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
