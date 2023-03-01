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
        audio: true,
      });
    }
    return this.videoStream;
  }

  async getVideoElement() {
    const stream = await this.getVideoStream();
    const video = document.createElement("video");
    //video.muted = true;
    video.srcObject = stream;
    return video;
  }

  async sendVideoChunks(duration) {
    const video = await this.getVideoElement();
    const stream = video.srcObject;
    await video.play();

    let recorder = new MediaRecorder(stream, { mimeType: 'video/webm' });
    recorder.ondataavailable = async (event) => {
      const toClients = store.getters.connectedClients;
      if (Object.keys(toClients).length) {
        ServerConnector.getInstance().sendMessage("VIDEO_CHUNK", {
          chunk: await this.blobToBase64(event.data),
          toClients: Object.keys(toClients).map((key) => parseInt(key)),
        });
      }
    };
    recorder.start()

    setInterval(async () => {
      await recorder.stop();
      await recorder.start();
    }, duration * 300);
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
