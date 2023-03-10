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

    // create new PIXI.VideoResource with stream as source
    if (!this.videoResource) {
      this.videoResource = new PIXI.VideoResource(this.stream);
      await this.videoResource.load();
    }

    // create new texture
    if (!this.videoTexture) {
      this.videoTexture = new PIXI.Texture.from(this.videoResource);
    }

    // create video sprite out of texture which is based upon a video resource
    this.videoSprite = new PIXI.Sprite(this.videoTexture);
    this.videoSprite.position.set(0, 0);
    this.videoSprite.width = store.getters.settingsData.avatarMediaWidth;
    this.videoSprite.height = store.getters.settingsData.avatarMediaHeight;

    this.addChild(this.videoSprite);

    /*
     * add a listener to canplaythrough event which fires once chunk has been loaded completely
     * we could use canplay to play once parts of the chunk have been loaded
     * */
    this.stream.addEventListener("canplaythrough", () => {
      this.stream.play();
    });

    let hasNewChunk = false;

    const updateChunk = () => {
      if (hasNewChunk) {
        const chunk = store.state.connectedClients[this.id];
        try {
          if (chunk !== undefined) {
            const byteCharacters = atob(chunk); // decode base64 string
            const byteArray = new Uint8Array(byteCharacters.length);
            for (let i = 0; i < byteCharacters.length; i++) {
              byteArray[i] = byteCharacters.charCodeAt(i);
            }
            const blob = new Blob([byteArray], { type: "video/webm" });
            const blobURL = URL.createObjectURL(blob);
            this.stream.srcObject = null;
            this.stream.src = null;
            this.stream.src = blobURL;
          }
        } catch {
          console.log("CHUNK ERROR");
        }
        hasNewChunk = false;
      }
      requestAnimationFrame(updateChunk);
    };

    if (this.id !== store.getters.clientId) {
      // watch for store changes. once store changes, it will notify
      store.watch(
        () => store.state.connectedClients[this.id],
        () => {
          // new chunk was provided
          hasNewChunk = true;
        },
        { deep: true }
      );
    }
    requestAnimationFrame(updateChunk);
  }
}
