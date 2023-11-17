class Player {
  constructor({
    position = { x: 0, y: 0 },
    sprite
  }) {
    this.position = {
      x: 0,
      y: 0
    }

    this.draw = () => {

    }
  }
}

class Scene {
  constructor({
    position = { x: 0, y: 0 },
    image,
    overlayImage
  }) {
    this.draw = () => {

    }
  }
}

class Sprite {
  constructor({ type, position, image }) {
    this.type = type // 0 = Map, 1 = Player
    this.position = {
      x: position.x,
      y: position.y
    }
    this.image = image

    this.speed = 0.5
    this.directions = [2, 1, 0, 3] // Order: S A W D
    this.currentDirection = this.directions[2]
    this.frames = [0, 1, 0, 2]
    this.currentFrame = 0

    this.animateFrame = (targetPos, currentPos, tileSize) => {
      const distanceToGo = Math.abs(targetPos - currentPos)

      if (distanceToGo <= tileSize && distanceToGo > tileSize * 0.75)
        this.setFrame(1)
      else if (distanceToGo <= tileSize * 0.75 && distanceToGo > tileSize * 0.5)
        this.setFrame(2)
      else if (distanceToGo <= tileSize * 0.5 && distanceToGo > tileSize * 0.25)
        this.setFrame(3)
      else if (distanceToGo <= tileSize * 0.25 && distanceToGo > 0)
        this.setFrame(0)
    }
    this.setFrame = (index) => {
      this.currentFrame = this.frames[index]
    }
    this.setDirection = (direction) => {
      this.currentDirection = this.directions[direction]
    }

    this.draw = (canvas, ctx) => {
      if (this.type === 1) { // Player
        ctx.drawImage(
          this.image,
          this.currentFrame * this.image.width / 3,
          this.currentDirection * this.image.height / 4,
          this.image.width / 3,
          this.image.height / 4,
          this.position.x,
          this.position.y,
          this.image.width / 3,
          this.image.height / 4
        )
      }
      else { // Scene
        ctx.drawImage(
          this.image,
          this.position.x,
          this.position.y,
        )
      }
    }
  }
}

class Controller {
  constructor(playerSprite, mapSprite, mapPosition = { x: 0, y: 0 }, tileSize) {
    this.keys = {
      last: '',
      w: { pressed: false },
      a: { pressed: false },
      s: { pressed: false },
      d: { pressed: false },
      shift: { pressed: false }
    }
    this.moving = false

    this.playerSprite = playerSprite
    this.mapSprite = mapSprite
    this.tileSize = tileSize
    this.lastPosition = {
      x: mapPosition.x,
      y: mapPosition.y
    }
    this.targetPosition = {
      axis: 0,
      position: 0
    }

    this.step = () => {
      if (this.moving) {
        if (this.mapSprite.position.x !== this.targetPosition.position && this.mapSprite.position.y !== this.targetPosition.position) {
          if (this.keys.last === 'w') {
            this.mapSprite.position.y += this.keys.shift.pressed ? this.mapSprite.speed * 2 : this.mapSprite.speed
          }
          if (this.keys.last === 'a') {
            this.mapSprite.position.x += this.keys.shift.pressed ? this.mapSprite.speed * 2 : this.mapSprite.speed
          }
          if (this.keys.last === 's') {
            this.mapSprite.position.y -= this.keys.shift.pressed ? this.mapSprite.speed * 2 : this.mapSprite.speed
          }
          if (this.keys.last === 'd') {
            this.mapSprite.position.x -= this.keys.shift.pressed ? this.mapSprite.speed * 2 : this.mapSprite.speed
          }
          
          this.playerSprite.animateFrame(
            this.targetPosition.position,
            this.targetPosition.axis === "x" ? this.mapSprite.position.x : this.mapSprite.position.y,
            this.tileSize
          )
        }
        else {
          this.moving = false
          this.lastPosition = this.mapSprite.position
          this.playerSprite.currentFrame = 0
        }
      }
      else {
        if (this.keys.w.pressed) {
          this.targetPosition = { axis: "y", position: this.lastPosition.y + this.tileSize }
          this.playerSprite.setDirection(0)
          this.moving = true
        }
        if (this.keys.a.pressed) {
          this.targetPosition = { axis: "x", position: this.lastPosition.x + this.tileSize }
          this.playerSprite.setDirection(1)
          this.moving = true
        }
        if (this.keys.s.pressed) {
          this.targetPosition = { axis: "y", position: this.lastPosition.y - this.tileSize }
          this.playerSprite.setDirection(2)
          this.moving = true
        }
        if (this.keys.d.pressed) {
          this.targetPosition = { axis: "x", position: this.lastPosition.x - this.tileSize }
          this.playerSprite.setDirection(3)
          this.moving = true
        }
      }
    }
  }
}