export default class GotoCommand {
    constructor(x, y, withUser) {
        this.x = x
        this.y = y
        this.withUser = withUser
    }

    execute(npc) {
        console.log('execute()', npc)
    }
}
