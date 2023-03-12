import ServerConnector from "@/connectors/server";
import store from "@/store";

/**
 * Class which represents the Multimedia Manager which will handle anything regarding video and screen streams
 * and corresponding permission handling
 */
export default class MultimediaManager {
  static instance = null;

  /**
   * function which returns the instance of MultimediaManager (singleton)
   * @returns {null}
   */
  static getInstance() {
    if (this.instance === null) {
      this.instance = new MultimediaManager();
    }
    return this.instance;
  }

  /**
   * Function which will create a stream of webcam and mic
   * @returns {Promise<MediaStream>} promise caller can wait for
   */
  async getVideoStream() {
    if (!this.videoStream) {
      this.videoStream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: {
          suppressLocalAudioPlayback: true,
        },
      });
    }
    return this.videoStream;
  }

  /**
   * function which will create a stream of the screen
   * @returns {Promise<MediaStream>} promise caller can wait for
   */
  async getScreenStream() {
    if (!this.screenStream) {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          suppressLocalAudioPlayback: true,
          echoCancellation: true
        },
      });
    }
    return this.screenStream;
  }

  /**
   * function which will create a video element of webcam stream
   * @returns {Promise<HTMLVideoElement>} promise caller can wait for containing a HTMLVideoElement <video>
   */
  async getVideoElement() {
    const stream = await this.getVideoStream();
    const video = document.createElement("video");
    video.muted = true
    video.srcObject = stream;
    return video;
  }

  /**
   * function which will create a video element of a screen stream
   * @returns {Promise<HTMLVideoElement>} promise caller can wait for containing a HTMLVideoElement <video>
   */
  async getScreenElement() {
    const stream = await this.getScreenStream();
    const screen = document.createElement("video");
    screen.srcObject = stream;
    return screen;
  }

  /**
   * Function which will send screen chunks
   * @param duration pause between sending
   * @param objectId  object id which corresponds to the chunks
   * @returns {Promise<void>} promise user can wait for
   */
  async sendScreenChunks(duration, objectId) {
    const screen = await this.getScreenElement();
    const stream = screen.srcObject;
    await screen.play();

    let recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm; codecs="opus,vp9"',
    });

    recorder.ondataavailable = async (event) => {
      ServerConnector.getInstance().sendMessage("SCREEN_CHUNK", {
        chunk: await this.blobToBase64(event.data),
        objectId: objectId,
      });
    };
    recorder.start();

    setInterval(async () => {
      await recorder.stop();
      await recorder.start();
    }, duration * 500);
  }

  /**
   * function which will send video chunks of webcam
   * @param duration duration of pause between sending
   * @returns {Promise<void>}
   */
  async sendVideoChunks(duration) {
    const video = await this.getVideoElement();
    const stream = video.srcObject;
    await video.play();

    let recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm; codecs="opus,vp9"',
    });
    recorder.ondataavailable = async (event) => {
      const toClients = store.getters.connectedClients;
      if (Object.keys(toClients).length) {
        ServerConnector.getInstance().sendMessage("VIDEO_CHUNK_SEND", {
          chunk: await this.blobToBase64(event.data),
          toClients: Object.keys(toClients).map((key) => parseInt(key)),
        });
      }
    };
    recorder.start();

    setInterval(async () => {
      await recorder.stop();
      await recorder.start();
    }, duration * 500);
  }

  /**
   * function which converts a blob object into a base 64 string (needed to be able to send a chunk to webserver)
   * @param blob blob to convert
   * @returns {Promise<unknown>} promise caller can wait for
   */
  async blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsArrayBuffer(blob);
      reader.onload = () => {
        const arrayBuffer = reader.result;
        const base64String = btoa(
          new Uint8Array(arrayBuffer).reduce(
            (data, byte) => data + String.fromCharCode(byte),
            ""
          )
        );
        resolve(base64String);
      };
      reader.onerror = () => {
        reject(new Error("Error converting blob to base64"));
      };
    });
  }
}
