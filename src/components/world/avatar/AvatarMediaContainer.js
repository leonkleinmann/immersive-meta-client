import * as PIXI from "pixi.js";
import MultimediaManager from "@/multimedia/MultimediaManager";
import store from "@/store";

/**
 * Class which handles and displays the video of the webcam of an avatar of or a foreign client avatar
 */
export default class AvatarMediaContainer extends PIXI.Container {
  /**
   * Constructor of AvatarMediaContainer
   * @param id id of the client
   */
  constructor(id) {
    super();
    this.id = id;
    this.zIndex = 1001;
    this.buildVideoSprite();
  }

  /**
   * Build the actual pixi video sprite which displays the webcam video of user avatar or client avatar
   * @returns {Promise<void>} Promise is returned which caller can wait for if needed
   */
  async buildVideoSprite() {
    this.stream = await MultimediaManager.getInstance().getVideoElement();
    await this.stream.play();
    const videoResource = new PIXI.VideoResource(this.stream);
    await videoResource.load();
    const videoTexture = new PIXI.Texture.from(videoResource);

    this.videoSprite = new PIXI.Sprite(videoTexture);
    this.videoSprite.position.set(0, 0);
    this.videoSprite.width = store.getters.settingsData.avatarMediaWidth;
    this.videoSprite.height = store.getters.settingsData.avatarMediaHeight;

    this.addChild(this.videoSprite);

    this.stream.addEventListener("canplaythrough", () => {
      this.stream.play()
    });

    if (this.id !== store.getters.clientId) {
      store.watch(
        () => store.state.connectedClients[this.id],
        async (chunk) => {
          try {
            const byteCharacters = atob(chunk);
            const byteNumbers = new Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteNumbers[i] = byteCharacters.charCodeAt(i);
            }
            const byteArray = new Uint8Array(byteNumbers);
            const blob = new Blob([byteArray], { type: "video/webm" });
            const blobURL = URL.createObjectURL(blob);
            this.stream.srcObject = null;
            this.stream.src = null;
            this.stream.src = blobURL;
          } catch {
            console.log("CHUNK ERROR");
          }
        },
        { deep: true }
      );
    }
  }
}
