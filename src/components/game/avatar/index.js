export default class Avatar {

    constructor(username, external, gender) {
        this.username = username
        this.external = external
        this.gender = gender
    }

    buildAvatar() {

    }

    render(pixiApp) {
        console.log('render()', pixiApp)
    }
}