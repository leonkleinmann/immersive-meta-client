export function preloadAssets(pixiLoader) {
    pixiLoader.baseUrl = '/assets/'
    pixiLoader.add('tiles', 'tiles/tiles.png')
    pixiLoader.add('avatar', 'avatars/avatar.png')
}