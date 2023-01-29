import store from "@/store";
import {AnimatedSprite} from "pixi.js";
import gsap from "gsap";

export default class Avatar {
    constructor(gender, assetManager) {
        this.gender = gender
        this.assetManager = assetManager
        this.buildAvatar()
    }
    
    buildAvatar() {
        this.avatarSheet = {}
        this.avatarSheet['north'] = []
        this.avatarSheet['east'] = []
        this.avatarSheet['south'] = []
        this.avatarSheet['west'] = []
        let avatarData = store.getters.assetData.avatars

        avatarData.forEach((avatar) => {
            if (avatar.id === this.gender) {
                avatar.items.forEach((item) => {
                    if (item.id.includes('north')) {
                        this.avatarSheet['north'].push(this.assetManager.getTexture(item.id))
                    }
                    if (item.id.includes('east')) {
                        this.avatarSheet['east'].push(this.assetManager.getTexture(item.id))
                    }
                    if (item.id.includes('south')) {
                        this.avatarSheet['south'].push(this.assetManager.getTexture(item.id))
                    }
                    if (item.id.includes('west')) {
                        this.avatarSheet['west'].push(this.assetManager.getTexture(item.id))
                    }
                })
            }
        })

        let avatarMapData = store.getters.mapData.avatar

        this.avatar = new AnimatedSprite(this.avatarSheet['north'])
        this.avatar.x = avatarMapData.x
        this.avatar.y = avatarMapData.y
        this.avatar.loop = false
    }

    getDrawable() {
        return this.avatar
    }

    moveNorth() {
        if(!this.avatar.playing) {
            this.avatar.textures = this.avatarSheet['north']
            this.avatar.play()
            this.avatar.animationSpeed = 1 / this.avatarSheet['north'].length
            gsap.to(this.avatar, {
                y: this.avatar.y - 32,
                duration: 1
            })
        }
    }
    moveEast() {
        if(!this.avatar.playing) {
            this.avatar.textures = this.avatarSheet['east']
            this.avatar.play()
            this.avatar.animationSpeed = 1 / this.avatarSheet['east'].length
            gsap.to(this.avatar, {
                x: this.avatar.x + 32,
                duration: 1
            })
        }
    }
    moveSouth() {
        if(!this.avatar.playing) {
            this.avatar.textures = this.avatarSheet['south']
            this.avatar.animationSpeed = 1 / this.avatarSheet['south'].length
            this.avatar.play()
            gsap.to(this.avatar, {
                y: this.avatar.y + 32,
                duration: 1
            })
        }
    }
    moveWest() {
        if(!this.avatar.playing) {
            this.avatar.textures = this.avatarSheet['west']
            this.avatar.animationSpeed = 1 / this.avatarSheet['west'].length
            this.avatar.play()
            gsap.to(this.avatar, {
                x: this.avatar.x - 32,
                duration: 1
            })
        }
    }
}