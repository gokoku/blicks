const canvas = document.querySelector("#myCanvas")
const ctx = canvas.getContext("2d")

const ball = {
    radius: 10,
    x: canvas.width/2,
    y: canvas.height-30,
    dx: 2,
    dy: 2,
    xd: 1,
    yd: -1,
    update: () => {
        ctx.beginPath()
        ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI*2)
        ctx.fillStyle = "#009500"
        ctx.fill()
        ctx.closePath()

        if(ball.x + ball.dx*ball.xd > canvas.width - ball.radius ||
           ball.x + ball.dx*ball.xd < ball.radius)
        {
            ball.xd *= -1
        }
        if(ball.y + ball.dy*ball.yd < ball.radius) {
            ball.yd *= -1
        }
        if(ball.y + ball.dy*ball.yd > canvas.height - ball.radius) {
            if(ball.x > paddle.x - ball.radius &&
               ball.x < paddle.x + paddle.width + ball.radius) {
                ball.yd *= -1
            } else {
                clearInterval(interval)
            }
        }

        ball.x += ball.dx*ball.xd
        ball.y += ball.dy*ball.yd

    }
}

const paddle = {
    height: 10,
    width: 75,
    x: (canvas.width - 75) / 2,
    right: false,
    left: false,
    update: () => {
        ctx.beginPath()
        ctx.rect(paddle.x, canvas.height-paddle.height, paddle.width, paddle.height)
        ctx.fillStyle = "#009500"
        ctx.fill()
        ctx.closePath()

        if(paddle.right && paddle.x < canvas.width - paddle.width) {
            paddle.x += 7
        } else if(paddle.left && paddle.x > 0) {
            paddle.x -= 7
        }
    }
}

const bricks = {
    rowCount: 3,
    columnCount: 5,
    width: 75,
    height: 20,
    padding: 10,
    offsetTop: 30,
    offsetLeft: 30,
  
    update: () => {
        let r = 0
        blocks.forEach((row, r) => {
            row.forEach((col, c) => {
                if(col.status == 1) {
                    let x = (c * (bricks.width + bricks.padding)) + bricks.offsetLeft
                    let y = (r * (bricks.height + bricks.padding)) + bricks.offsetTop
                    col.x = x
                    col.y = y

                    ctx.beginPath()
                    ctx.rect(x, y, bricks.width, bricks.height)
                    ctx.fillStyle = "#009500"
                    ctx.fill()
                    ctx.closePath()

                    ctx.font = "9px Arial"
                    ctx.fillStyle = "black"
                    ctx.fillText(`${col.x}:${col.y} : ${col.status}`, col.x, col.y+9)
                }
            })
        })
    },
    collision: () => {
        blocks.forEach((row) => {
            row.forEach((col) => {
                if(col.status == 1) {
                    if(ball.x > col.x && ball.x < col.x + bricks.width &&
                       ball.y > col.y && ball.y < col.y + bricks.height ) {

                        ball.yd *= -1
                        col.status = 0
                    }
                }
            })
        })
    }
}

let blocks = []
for(let r = 0; r < bricks.rowCount; r++) {
    blocks[r] = []
    for(let c = 0; c < bricks.columnCount; c++) {
        blocks[r][c] = { x: 0, y: 0, status: 1 }
    }
}


document.addEventListener("keydown", keyDownHandler, false)
document.addEventListener("keyup", keyUpHandler, false)

function keyDownHandler(e) {
    if(e.key == "ArrowRight") {
        paddle.right = true
    } else if(e.key == "ArrowLeft") {
        paddle.left = true
    } else if(e.key == " ") {
        document.location.reload()
    }
}

function keyUpHandler(e) {
    if(e.key == "ArrowRight") {
        paddle.right = false
    } else if(e.key == "ArrowLeft") {
        paddle.left = false
    }
}


function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    bricks.update()
    ball.update()
    paddle.update()
    bricks.collision()
}

const interval = setInterval(draw, 10)
