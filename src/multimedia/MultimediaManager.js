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
        audio: {noiseSuppression: true}
      })
    }
    return this.videoStream
  }

  async getVideoElement() {
    const stream = await this.getVideoStream()
    const video = document.createElement("video")
    video.srcObject = stream
    await video.play()

    return video
  }
}
