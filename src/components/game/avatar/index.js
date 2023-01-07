import * as PIXI from 'pixi.js'
import gsap from "gsap";

/**
 *
 * @param pixiApp
 * @returns {Sprite}
 */
export function createAvatar(pixiApp) {
    let avatar = new PIXI.Sprite.from('/assets/avatars/avatar.png')
    avatar.anchor.set(0.5)
    avatar.x = pixiApp.view.width / 2
    avatar.y = pixiApp.view.height / 2

    return avatar
}

export function createAvatarSheet(pixiLoader, sheetWidth, sheetHeight) {
    let avatarSheet = new PIXI.BaseTexture.from(pixiLoader.resources['avatar'].url)

    //north
    avatarSheet['standNorth'] = [
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(2*sheetWidth, 3*sheetHeight, sheetWidth, sheetHeight))
    ]
    avatarSheet['walkNorth'] = [
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(3*sheetWidth, 3*sheetHeight, sheetWidth, sheetHeight)),
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(2*sheetWidth, 3*sheetHeight, sheetWidth, sheetHeight)),
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(3*sheetWidth, 3*sheetHeight, sheetWidth, sheetHeight)),
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(0, 3*sheetHeight, sheetWidth, sheetHeight))
    ]

    //south
    avatarSheet['standSouth'] = [
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(2*sheetWidth, 0, sheetWidth, sheetHeight))
    ]
    avatarSheet['walkSouth'] = [
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(1*sheetWidth, 0, sheetWidth, sheetHeight)),
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(2*sheetWidth, 0, sheetWidth, sheetHeight)),
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(3*sheetWidth, 0, sheetWidth, sheetHeight)),
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(0, 0, sheetWidth, sheetHeight))
    ]

    //west
    avatarSheet['standWest'] = [
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(2*sheetWidth, sheetHeight, sheetWidth, sheetHeight))
    ]
    avatarSheet['walkWest'] = [
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(1*sheetWidth, 1*sheetHeight, sheetWidth, sheetHeight)),
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(2*sheetWidth, 1*sheetHeight, sheetWidth, sheetHeight)),
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(3*sheetWidth, 1*sheetHeight, sheetWidth, sheetHeight)),
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(0, 1*sheetHeight, sheetWidth, sheetHeight))
    ]

    //east
    avatarSheet['standEast'] = [
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(2*sheetWidth, 2*sheetHeight, sheetWidth, sheetHeight))
    ]
    avatarSheet['walkEast'] = [
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(1*sheetWidth, 2*sheetHeight, sheetWidth, sheetHeight)),
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(2*sheetWidth, 2*sheetHeight, sheetWidth, sheetHeight)),
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(3*sheetWidth, 2*sheetHeight, sheetWidth, sheetHeight)),
        new PIXI.Texture(avatarSheet, new PIXI.Rectangle(0, 2*sheetHeight, sheetWidth, sheetHeight))
    ]

    return avatarSheet
}

export function createAnimatedAvatar(avatarSheet) {
    return new PIXI.AnimatedSprite(avatarSheet.standSouth)
}

// controls
export function moveUp(avatar, avatarSheet, moveSpeed) {
    if (!avatar.playing) {
        avatar.textures = avatarSheet.walkNorth
        avatar.play()

        gsap.to(avatar, {
            y: avatar.y - moveSpeed,
            duration: 1
        })
    }
}

export function moveDown(avatar, avatarSheet, moveSpeed) {
    if (!avatar.playing) {
        avatar.textures = avatarSheet.walkSouth
        avatar.play()
        gsap.to(avatar, {
            y: avatar.y + moveSpeed,
            duration: 1
        })
    }
}

export function moveLeft(avatar, avatarSheet, moveSpeed) {
    if (!avatar.playing) {
        avatar.textures = avatarSheet.walkWest
        avatar.play()
        gsap.to(avatar, {
            x: avatar.x - moveSpeed,
            duration: 1
        })
    }
}

export function moveRight(avatar, avatarSheet, moveSpeed) {
    if (!avatar.playing) {
        avatar.textures = avatarSheet.walkEast
        avatar.play()
        gsap.to(avatar, {
            x: avatar.x + moveSpeed,
            duration: 1
        })
    }
}