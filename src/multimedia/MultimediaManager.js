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
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      const video = document.createElement("video");
      video.srcObject = stream;
      video.muted = true;
      await video.play();
      this.videoStream = video;
    }

    return this.videoStream;
  }

  async getScreenStream() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    return stream;
  }
}
