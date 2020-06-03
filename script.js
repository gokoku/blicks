const canvas = document.querySelector('#myCanvas')
const ctx = canvas.getContext('2d')
const color = ['#548C00', '#61995E', '#619988', '#5D871E', '#5D871E']
let gameRun = false

const ball = {
  radius: 10,
  x: canvas.width / 2,
  y: canvas.height - 30,
  dx: 2,
  dy: 2,
  xd: 1,
  yd: -1,
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
      } else {
        display.lives -= 1
        if (display.lives == 0) {
          gameRun = false

          display.message('Game Over')
        } else {
          ball.x = canvas.width / 2
          ball.y = canvas.height - 30
          ball.dx = 2
          ball.dy = 2
          ball.xd = 1
          ball.yd = -1
          paddle.x = (canvas.width - paddle.width) / 2
        }
      }
    }

    ball.x += ball.dx * ball.xd
    ball.y += ball.dy * ball.yd
  },
}

const paddle = {
  height: 10,
  width: 75,
  x: (canvas.width - 75) / 2,
  right: false,
  left: false,
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
  rowCount: 3,
  columnCount: 5,
  width: 75,
  height: 20,
  padding: 10,
  offsetTop: 30,
  offsetLeft: 30,
  brokenNumber: 0,

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

let blocks = []
for (let r = 0; r < bricks.rowCount; r++) {
  blocks[r] = []
  for (let c = 0; c < bricks.columnCount; c++) {
    blocks[r][c] = { x: 0, y: 0, status: 1 }
  }
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
draw()
