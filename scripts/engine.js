class GameEngine {
  constructor(
    dimensions,
    tileSize,
    cameraOffset
  ) {
    this.canvas = document.querySelector("#game") // HTML5 Canvas
    this.ctx = this.canvas.getContext("2d") // Canvas Context (2D)
    this.dimensions = { // Canvas Dimensions
      width: dimensions.width,
      height: dimensions.height
    }
    this.tileSize = tileSize
    this.cameraOffset = cameraOffset // Offset for setting Player Sprite

    this.assets = { // Default Images, can be changed using "setImages"
      scene: "./img/map_test.png", //"./img/map_test2.png", // USE THIS FOR TESTING MOVEMENT BLOCKING
      player: "./img/player_template.png"
    }
    this.sprites = []
    this.controller = new Controller()

    this.load = async () => {
      this.canvas.width = this.dimensions.width
      this.canvas.height = this.dimensions.height

      const assets = [this.assets.scene, this.assets.player]
      const images = await this.createImages(assets)
      await this.loadImages(images) // Ensure all images load
      this.sprites = await this.createSprites(images) // Create movable Sprite(s)
      this.controller = await this.connectController(
        this.sprites[1],
        this.sprites[0],
        this.sprites[0].position,
        this.tileSize
      )
    }

    this.start = () => {
      window.requestAnimationFrame(this.controller.step)
      this.sprites.forEach((sprite) => {
        sprite.draw(this.canvas, this.ctx)
      })
    }

    this.setImages = async (sceneImg, playerImg, overlayImg) => {
      if (sceneImg) this.assets.scene = sceneImg
      if (playerImg) this.assets.player = playerImg
      if (overlayImg) this.assets.overlay = overlayImg
      await this.load()
    }
  }

  createImages = async (assets) => {
    return new Promise((resolve, reject) => {
      try {
        const createdImages = []

        assets.forEach((img) => {
          const image = new Image()
          image.src = img

          createdImages.push(image)
        })

        resolve(createdImages)
      }
      catch (e) {
        console.error(`"Failed to create Images."\n\n${e}`)
        reject()
      }
    })
  }

  loadImages = async (createdImages) => {
    await Promise.all(createdImages.map(img => {
      if (img.complete) return Promise.resolve(img.naturalHeight !== 0)

      return new Promise(resolve => {
        img.addEventListener("load", () => resolve(true));
        img.addEventListener("error", () => resolve(false));
      })
    })).then(results => {
      if (results.every(res => res))
        return //console.log("LOADED");
      else
        console.log("Some assets failed to load.");
    })
  }

  determineSpriteProperties = (image) => {
    const properties = {
      type: 0,
      position: { x: 0, y: 0 },
      image: image
    }
    if (image.currentSrc.indexOf("map_") > -1) {
      properties.position.x = ((this.canvas.width / 2) - (image.width / 2)) + (this.tileSize / 2),
      properties.position.y = ((this.canvas.height / 2) - (image.height / 2))
    } else {
      properties.type = 1
      properties.position.x = (this.canvas.width / 2 - (image.width / 3)) + ((image.width / 3) / 2)
      properties.position.y = this.canvas.height / 2 - (image.height / 4) + this.cameraOffset
    }
    return properties
  }

  createSprites = (images) => {
    return new Promise((resolve, reject) => {
      try {
        const createdSprites = []

        images.forEach((img) => {
          const sprite = new Sprite(this.determineSpriteProperties(img))
          createdSprites.push(sprite)
        })

        resolve(createdSprites)
      }
      catch (e) {
        console.error(`"Failed to create Sprites."\n\n${e}`)
        reject()
      }
    })
  }

  connectController = (playerSprite, mapSprite, mapPosition, tileSize) => {
    return new Promise((resolve, reject) => {
      try {
        const controller = new Controller(playerSprite, mapSprite, mapPosition, tileSize)
        resolve(controller)
      }
      catch (e) {
        console.log(`Failed to connect Controller.\n\n${e}`)
        reject()
      }
    })
  }
}