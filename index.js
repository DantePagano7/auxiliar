const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');

canvas.width = 1024
canvas.height = 576

c.fillRect(0, 0, canvas.width, canvas.height)

const gravity = 0.25

var gameEnded = false

const background = new Sprite(
    './background.png',
    { x: 0, y: 0 }
)

const shop = new Sprite(
    './shop.png',
    { x: 600, y: 135 },
    2.7,
    6,
    8
)

const player = new Fighter({
    position: { x: 100, y: 100 },
    velocity: { x: 0, y: 0 },
    color: 'blue',
    offset: { x: 230, y: 157 },
    imageSrc: './samurai/Idle.png',
    scale: 2.5,
    framesMax: 8,
    sprites: {
        idle: {
            imageSrc: './samurai/Idle.png',
            framesMax: 8
        },
        run: {
            imageSrc: './samurai/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './samurai/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './samurai/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './samurai/Attack1.png',
            framesMax: 6
        },
        takeHit: {
            imageSrc: './samurai/Take Hit.png',
            framesMax: 4
        },death: {
            imageSrc: './samurai/Death.png',
            framesMax: 6
        }
    },
    attackBox: {
        offset: {
            x: 80,
            y: 00
        },
        width: 150,
        height: 100
    }      
  }
)

const enemy = new Fighter({
    position: { x: 870, y: 100 },
    velocity: { x: 0, y: 0 },
    color: 'blue',
    offset: { x: 210, y: 170 },
    imageSrc: './kenji/Idle.png',
    scale: 2.5,
    framesMax: 4,
    sprites: {
        idle: {
            imageSrc: './kenji/Idle.png',
            framesMax: 4
        },
        run: {
            imageSrc: './kenji/Run.png',
            framesMax: 8
        },
        jump: {
            imageSrc: './kenji/Jump.png',
            framesMax: 2
        },
        fall: {
            imageSrc: './kenji/Fall.png',
            framesMax: 2
        },
        attack1: {
            imageSrc: './kenji/Attack1.png',
            framesMax: 4
        },
        takeHit: {
            imageSrc: './kenji/Take hit.png',
            framesMax: 3
        },death: {
            imageSrc: './kenji/Death.png',
            framesMax: 7
        }
    },
    attackBox: {
        offset: {
            x: -160,
            y: 20
        },
        width: 150,
        height: 100
    }
})



const keys = {
    a: { pressed: false },
    d: { pressed: false },
    ArrowLeft: { pressed: false },
    ArrowRight: { pressed: false }
}

decreaseTimer()


function animate() {
    window.requestAnimationFrame(animate)
    c.fillStyle = 'black'
    c.fillRect(0, 0, canvas.width, canvas.height)
    background.draw()
    shop.update()



    


    //c.fillRect(player.position.x, player.position.y , player.width, player.height)
    //c.fillRect(enemy.position.x, enemy.position.y, enemy.width, enemy.height)

    player.velocity.x = 0
    enemy.velocity.x = 0



    //player movement
    if (keys.a.pressed && player.lastKey === 'a') {
        player.velocity.x = -3
        player.switchSprite('run')
    } else if (keys.d.pressed && player.lastKey === 'd') {
        player.velocity.x = 3
        player.switchSprite('run')
    } else {
        player.switchSprite('idle')
    }

    //player jumping
    if (player.velocity.y < 0) {
        player.switchSprite('jump')
    } else if (player.velocity.y > 0) {
        player.switchSprite('fall')
    }



        //Enemy movement 
    if (keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft') {
        enemy.velocity.x = -4
        enemy.switchSprite('run')
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight') {
        enemy.velocity.x = 4
        enemy.switchSprite('run')
    } else {
        enemy.switchSprite('idle')
    }

    //enemy jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite('jump')
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite('fall')
    }




    //detect player hit
    if (
        rectangularCollision(player, enemy) &&
        player.frameCurrent === 4 && player.isAttacking
    ) {
        enemy.takeHit()
        player.isAttacking = false
        //document.querySelector('#enemyHealth').style.width = enemy.health + '%'
        enemy.health -= 33.333334
        gsap.to('#enemyHealth', {
            width: enemy.health + '%'
        })
    }

    //if player misses
    if (player.isAttacking  && player.frameCurrent === 4) {
        player.isAttacking = false
    }



        //detect enemy hit
    if (
        rectangularCollision(enemy, player) &&
        enemy.frameCurrent === 2 && enemy.isAttacking 
    ) {
        player.takeHit()
        enemy.isAttacking = false
        //document.querySelector('#playerHealth').style.width = player.health + '%'
        player.health -= 20
        gsap.to('#playerHealth', {
            width: player.health + '%'
        })
    }
    //if enemy misses
    if (enemy.isAttacking && enemy.frameCurrent === 3) {
        enemy.isAttacking = false
    }


    


    //end game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        gameEnded = true
        determineWinner(player, enemy, timerId)
        console.log('Player:', player.health,'Enemy:', enemy.health)
    }


    // invento XD
    if (player.position.x < 60) {
        player.position.x = 60
    } else if (player.position.x > canvas.width -50 -100) {
        player.position.x = canvas.width -50 -100
    }
    if (enemy.position.x < 0) {
        enemy.position.x = 0
    } else if (enemy.position.x > canvas.width - 50) {
        enemy.position.x = canvas.width - 50
    }


    // background filter
    c.fillStyle = 'rgba(255, 255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    if (enemy.health <= 0) {
        enemy.switchSprite('death') 
    }
    if (player.health <= 0) {
        player.switchSprite('death')
    }

    enemy.update()
    player.update()

}

animate()














window.addEventListener('keydown', (event) => {


    if (!player.death && !gameEnded) {
        switch (event.key) {
            case 'd':
                keys.d.pressed = true
                player.lastKey = 'd'
                break

            case 'a':
                keys.a.pressed = true
                player.lastKey = 'a'
                break

            case 'w':
                if (PJA) {
                    playerCooldownJump()
                    player.velocity.y = -10
                }
                break

            case 'ñ':
                if (PAA) {
                    playerCooldown()
                    player.attack()
                }
                break
        }
    } else {
        keys.a.pressed = false
        keys.d.pressed = false
    }



    if (!enemy.death && !gameEnded) {
        switch (event.key) {

            case 'ArrowRight':
                keys.ArrowRight.pressed = true
                enemy.lastKey = 'ArrowRight'
                break

            case 'ArrowLeft':
                keys.ArrowLeft.pressed = true
                enemy.lastKey = 'ArrowLeft'
                break

            case 'ArrowUp':
                if (EJA) {
                    enemyCooldownJump()
                    enemy.velocity.y = -10
                }
                break

            case '/':
                if (EAA) {
                    enemyCooldown()
                    enemy.attack()
                }
                break
        }
    } else {
        keys.ArrowLeft.pressed = false
        keys.ArrowRight.pressed = false
    }
})

window.addEventListener('keyup', (event) => {
    switch (event.key) {
        case 'd':
            keys.d.pressed = false
            break

        case 'a':
            keys.a.pressed = false
            break





        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
    }
}) 