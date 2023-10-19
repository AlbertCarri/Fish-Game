// Canvas setup
const canvas = document.getElementById('canvas1')
console.log(canvas)
const ctx = canvas.getContext('2d')
console.log(ctx)
canvas.width = 800
canvas.height = 500

let score = 0
let gameFrame = 0
ctx.font = '50px Georgia'
let gameSpeed = 1
let gameOver = 0

// Mouse Interactivity
let canvasPosition = canvas.getBoundingClientRect()

const mouse = {
    x: canvas.width / 2,
    y: canvas.height / 2,
    click: false
}
canvas.addEventListener('mousedown', function (event) {
    mouse.x = event.x - canvasPosition.left
    mouse.y = event.y - canvasPosition.top
    mouse.click = true

})
canvas.addEventListener('mouseup', function () {
    mouse.click = false
})

// Player
const playerLeft = new Image()
playerLeft.src = 'Fish-left.png'
const playerRight = new Image()
playerRight.src = 'Fish-right.png'

class Player {
    constructor() {
        this.x = canvas.width
        this.y = canvas.height / 2
        this.radius = 50
        this.angle = 0
        this.frameX = 0
        this.frameY = 0
        this.spriteWidth = 500
        this.spriteHeight = 327
        this.animatFish = 0
    }
    update() {
        this.animatFish += 1
        if (this.animatFish > 4) {
            this.animatFish = 0
            this.frameX += 1
            if (this.frameX > 3) {
                this.frameY += 1
                this.frameX = 0
            }
            if (this.frameY > 2) {
                this.frameY = 0
            }
        }
        console.log(this.frameX, this.frameY)

        const dx = this.x - mouse.x
        const dy = this.y - mouse.y
        let theta = Math.atan2(dy, dx)
        this.angle = theta
        if (mouse.x != this.x) {
            this.x -= dx / 5
        }
        if (mouse.y != this.y) {
            this.y -= dy / 5
        }
    }
    draw() {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate(this.angle)
        if (this.x >= mouse.x) {
            ctx.drawImage(playerLeft, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 50, this.spriteWidth / 4,
                this.spriteHeight / 4)
        } else {
            ctx.drawImage(playerRight, this.frameX * this.spriteWidth, this.frameY * this.spriteHeight, this.spriteWidth, this.spriteHeight, 0 - 60, 0 - 50, this.spriteWidth / 4,
                this.spriteHeight / 4)
        }
        ctx.restore()


    }
}
const player = new Player()
// Bubbles
const bubblesArray = []
const bubbleImage = new Image()
bubbleImage.src = 'bubble_pop_one/bubble_pop_frame_01.png'
class Bubble {
    constructor() {
        this.x = Math.random() * canvas.width
        this.y = canvas.height + Math.random() * canvas.height
        this.radius = 50
        this.speed = Math.random() * 5 + 1
        this.distance
        this.counted
        this.sound = Math.random() <= 0.5 ? 'sound1' : 'sound2'
    }
    update() {
        this.y -= this.speed
        const dx = this.x - player.x
        const dy = this.y - player.y
        this.distance = Math.sqrt(dx * dx + dy * dy)
    }
    draw() {
        ctx.drawImage(bubbleImage, this.x - 64, this.y - 64, this.radius * 2.5, this.radius * 2.5)
    }
}

const bubblePop1 = document.createElement('audio')
bubblePop1.src = 'Sound/bubbles-single1.wav'
const bubblePop2 = document.createElement('audio')
bubblePop2.src = 'Sound/bubbles-single2.wav'
const gameOverSound = document.createElement('audio')
gameOverSound.src = 'GAMEOVER.wav'

function handleBubbles() {
    if (gameFrame % 50 == 0) {
        bubblesArray.push(new Bubble())
    }
    for (let i = 0; i < bubblesArray.length; i++) {
        bubblesArray[i].update()
        bubblesArray[i].draw()
    }
    for (let i = 0; i < bubblesArray.length; i++) {
        if (bubblesArray[i].y < 0 - bubblesArray[i].radius * 2) {
            bubblesArray.splice(i, 1)
            gameOver = 1
        }
        if (bubblesArray[i].distance < bubblesArray[i].radius + player.radius) {
            if (!bubblesArray[i].counted) {
                if (bubblesArray[i].sound == 'sound1') {
                    bubblePop1.play()
                } else {
                    bubblePop2.play()
                }
                score++
                bubblesArray[i].counted = true
                bubblesArray.splice(i, 1)
            }

        }
    }
}
// Repeating Background
const background = new Image()
background.src = 'skathi180500143.jpg'
const background2 = new Image()
background2.src = 'undersea2.jpg'

const BG = {
    x1: 0,
    x2: canvas.width,
    y: 0,
    width: canvas.width,
    height: canvas.height
}

function handleBackground() {
    BG.x1 -= gameSpeed
    if (BG.x1 < -BG.width) BG.x1 = BG.width - 2
    BG.x2 -= gameSpeed
    if (BG.x2 < -BG.width) BG.x2 = BG.width - 2
    ctx.drawImage(background, BG.x1, BG.y, BG.width, BG.height)
    ctx.drawImage(background, BG.x2, BG.y, BG.width, BG.height)
}

// Animation Loop
function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    handleBackground()
    handleBubbles()
    player.update()
    player.draw()
    ctx.fillStyle = 'white'
    ctx.fillText('score:' + score, 10, 50)
    ctx.fillStyle = 'black'
    ctx.fillText('score:' + score, 11, 51)
    if (gameOver == 1) {
        ctx.font = '80px Arial'
        ctx.fillStyle = 'white'
        ctx.fillText('Game Over', 200, 250)
        ctx.fillStyle = 'black'
        ctx.fillText('Game Over', 204, 254)
        //gameOverSound.play()
        return
    }
    gameFrame++
    requestAnimationFrame(animate)
}
animate()

window.addEventListener('resize', function () {
    canvasPosition = canvas.getBoundingClientRect()

})


// VIDEO minuto 27