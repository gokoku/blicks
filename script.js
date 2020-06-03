const canvas = document.querySelector('#myCanvas')
const ctx = canvas.getContext('2d')
const color = ['#548C00', '#61995E', '#619988', '#5D871E', '#5D871E']
const speed = [3, 1, 4, 2]
let gameRun = false
let blocks = []

const ball = {
  init: () => {
    ball.radius = 10
    ball.x = canvas.width / 2
    ball.y = canvas.height - 30
    ball.dx = speed[0]
    ball.dy = speed[0]
    ball.xd = 1
    ball.yd = -1
  },
  changeSpeed: () => {
    ball.dx = speed[Math.floor(Math.random() * 4)]
    ball.yx = speed[Math.floor(Math.random() * 4)]
  },
  update: () => {
    ctx.beginPath()
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2)
    ctx.fillStyle = color[4]
    ctx.fill()
    ctx.closePath()

    if (
      ball.x + ball.dx * ball.xd > canvas.width - ball.radius ||
      ball.x + ball.dx * ball.xd < ball.radius
    ) {
      ball.xd *= -1
    }
    if (ball.y + ball.dy * ball.yd < ball.radius) {
      ball.yd *= -1
    }
    if (ball.y + ball.dy * ball.yd > canvas.height - ball.radius) {
      if (
        ball.x > paddle.x - ball.radius &&
        ball.x < paddle.x + paddle.width + ball.radius
      ) {
        ball.yd *= -1
        ball.changeSpeed()
      } else {
        display.lives -= 1
        if (display.lives == 0) {
          gameRun = false

          display.message('Game Over')
        } else {
          ball.init()
        }
      }
    }

    ball.x += ball.dx * ball.xd
    ball.y += ball.dy * ball.yd
  },
}

const paddle = {
  init: () => {
    paddle.width = 75
    paddle.height = 10
    paddle.x = (canvas.width - paddle.width) / 2
    paddle.right = false
    paddle.left = false
  },
  update: () => {
    ctx.beginPath()
    ctx.rect(
      paddle.x,
      canvas.height - paddle.height,
      paddle.width,
      paddle.height
    )
    ctx.fillStyle = color[3]
    ctx.fill()
    ctx.closePath()

    if (paddle.right && paddle.x < canvas.width - paddle.width) {
      paddle.x += 7
    } else if (paddle.left && paddle.x > 0) {
      paddle.x -= 7
    }
  },
}

const bricks = {
  init: () => {
    bricks.rowCount = 3
    bricks.columnCount = 5
    bricks.width = 75
    bricks.height = 20
    bricks.padding = 10
    bricks.offsetTop = 30
    bricks.offsetLeft = 30
    bricks.brokenNumber = 0
    for (let r = 0; r < bricks.rowCount; r++) {
      blocks[r] = []
      for (let c = 0; c < bricks.columnCount; c++) {
        blocks[r][c] = { x: 0, y: 0, status: 1 }
      }
    }
  },
  update: () => {
    let r = 0
    blocks.forEach((row, r) => {
      row.forEach((col, c) => {
        if (col.status == 1) {
          let x = c * (bricks.width + bricks.padding) + bricks.offsetLeft
          let y = r * (bricks.height + bricks.padding) + bricks.offsetTop

          col.x = x
          col.y = y

          ctx.beginPath()
          ctx.rect(x, y, bricks.width, bricks.height)
          ctx.fillStyle = color[r]
          ctx.fill()
          ctx.closePath()
        }
      })
    })
  },
  collision: () => {
    blocks.forEach((row) => {
      row.forEach((col) => {
        if (col.status == 1) {
          console.log(col)
          if (
            ball.x > col.x &&
            ball.x < col.x + bricks.width &&
            ball.y > col.y &&
            ball.y < col.y + bricks.height
          ) {
            ball.yd *= -1
            col.status = 0
            display.point += 1
            bricks.brokenNumber += 1
            ball.changeSpeed()
            if (bricks.brokenNumber == bricks.rowCount * bricks.columnCount) {
              gameRun = false
              display.message('YOU WIN!!')
            }
          }
        }
      })
    })
  },
}

const display = {
  point: 0,
  lives: 3,
  score: () => {
    ctx.beginPath()
    ctx.fillStyle = 'rgba(' + [100, 100, 100, 0.5] + ')'
    ctx.fillRect(0, 0, canvas.width, 20)
    ctx.closePath()

    ctx.font = '16px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText('Score: ' + display.point, 20, 16)

    ctx.font = '16px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText('Lives: ' + display.lives, canvas.width - 65, 16)
  },
  message: (text) => {
    ctx.beginPath()
    ctx.fillStyle = 'rgba(' + [0, 0, 0, 0.5] + ')'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    ctx.closePath()

    ctx.font = '50px Arial'
    ctx.fillStyle = 'white'
    ctx.fillText(text, canvas.width / 4, canvas.height / 2)
  },
}

document.addEventListener('keydown', keyDownHandler, false)
document.addEventListener('keyup', keyUpHandler, false)
document.addEventListener('mousemove', mouseMoveHandler, false)

function mouseMoveHandler(e) {
  const relativeX = e.clientX - canvas.offsetLeft
  if (relativeX > 0 && relativeX < canvas.width) {
    paddle.x = relativeX - paddle.width / 2
  }
}

function keyDownHandler(e) {
  if (e.key == 'ArrowRight') {
    paddle.right = true
  } else if (e.key == 'ArrowLeft') {
    paddle.left = true
  } else if (e.key == ' ') {
    document.location.reload()
  } else if (e.key == 'q') {
    gameRun = false
  }
}

function keyUpHandler(e) {
  if (e.key == 'ArrowRight') {
    paddle.right = false
  } else if (e.key == 'ArrowLeft') {
    paddle.left = false
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height)

  display.score()
  bricks.update()
  paddle.update()
  ball.update()
  bricks.collision()

  if (gameRun) {
    requestAnimationFrame(draw)
  }
}

gameRun = true
bricks.init()
ball.init()
paddle.init()
draw()
