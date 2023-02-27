export default class MultimediaManager {

  static instance = null

  static getInstance() {
    if (this.instance === null) {
      this.instance = new MultimediaManager()
    }
    return this.instance
  }

  async getAudioVideoStream() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const video = document.createElement('video');
    video.srcObject = stream;
    video.src = stream;
    return video;
  }

  async getScreenStream() {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
    });
    return stream;
  }
}
