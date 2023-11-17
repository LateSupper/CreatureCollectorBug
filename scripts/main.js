const game = new GameEngine(
  { width: 360, height: 240 }, // Dimensions
  24, // Tile Size
  18 // Camera Offset
)
game.load()

function step(timeStamp) {
  window.requestAnimationFrame(step)
  game.start()
}
step()

window.addEventListener('keydown', (e) => {
  if (!game.controller.moving) {
    switch (e.key.toLowerCase()) {
      case 'w':
        game.controller.keys.last = 'w'
        game.controller.keys.w.pressed = true
        break
      case 'a':
        game.controller.keys.last = 'a'
        game.controller.keys.a.pressed = true
        break
      case 's':
        game.controller.keys.last = 's'
        game.controller.keys.s.pressed = true
        break
      case 'd':
        game.controller.keys.last = 'd'
        game.controller.keys.d.pressed = true
        break
      case 'shift':
        game.controller.keys.shift.pressed = true
        break
    }
  }
})
window.addEventListener('keyup', (e) => {
  switch (e.key.toLowerCase()) {
    case 'w':
      game.controller.keys.w.pressed = false
      break
    case 'a':
      game.controller.keys.a.pressed = false
      break
    case 's':
      game.controller.keys.s.pressed = false
      break
    case 'd':
      game.controller.keys.d.pressed = false
      break
    case 'shift':
      game.controller.keys.shift.pressed = false
      break
  }
})