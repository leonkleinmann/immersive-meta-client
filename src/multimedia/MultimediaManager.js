import ServerConnector from "@/connectors/server";
import store from "@/store";

export default class MultimediaManager {
  static instance = null;

  static getInstance() {
    if (this.instance === null) {
      this.instance = new MultimediaManager();
    }
    return this.instance;
  }

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

  async getScreenStream() {
    if (!this.screenStream) {
      this.screenStream = await navigator.mediaDevices.getDisplayMedia({
        video: true,
        audio: {
          suppressLocalAudioPlayback: true,
        },
      });
    }
    return this.screenStream;
  }

  async getVideoElement() {
    const stream = await this.getVideoStream();
    const video = document.createElement("video");
    video.srcObject = stream;
    return video;
  }

  async getScreenElement() {
    const stream = await this.getScreenStream();
    const screen = document.createElement("video");
    screen.srcObject = stream;
    return screen;
  }

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
    }, duration * 1000);
  }

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
        ServerConnector.getInstance().sendMessage("VIDEO_CHUNK", {
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
