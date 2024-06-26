import Player from "../models/player.js";
import Sound from "../models/sound.js";
import Sprite from "../models/sprite.js";
import Hitbox from "../models/hitbox.js";

class Game {
    playerNickname;

    constructor(canvas, config, playerNickname, playerNickname2) {
        this.config = config
        this.canvas = canvas;
        this.playerNickname = playerNickname;
        this.playerNickname2 = playerNickname2;
        this.ctx = canvas.getContext('2d');
    } 

    init() {
        this.canvas.style.position = 'absolute';
        this.canvas.width = this.config.BG_WIDTH;
        this.canvas.height = this.config.BG_HEIGHT;
        this.canvas.style.backgroundImage = "url('" + this.config.BACKGROUND_IMG_SRC + "')";
        this.canvas.style.backgroundSize = "contain";

        this.newPlayer = new Player(this.config.PLAYER_SRC, this.playerNickname2);
        
        this.box = new Hitbox(500, 90, 150, 50);
        this.ground = new Hitbox(0, 40, this.canvas.width, 150);
        this.player = new Player(this.config.PLAYER_SRC, this.playerNickname);
        this.fireball = new Sprite(this.config.FIREBALL_SRC, 360, 360, 6, 1, 50, 50);
        this.bgMusic = new Sound("assets/audio/background.mp3");
    }

    keyboardPressedHandler(key) {
        switch(key) {
            case "d":
                console.log("d");
                this.player.velocity.x = this.config.WALK_SPEED;
                break;
            case "a":
                this.player.velocity.x = -this.config.WALK_SPEED;
                break;
            case "w":
                this.player.jump();
                break;
            case "g":
                this.player.shoot(this.ctx);
                break;
            case "arrowright":
                console.log("ArrowRight");
                this.newPlayer.velocity.x = this.config.WALK_SPEED;
                break;
            case "arrowleft":
                this.newPlayer.velocity.x = -this.config.WALK_SPEED;
                break;
            case "arrowup":
                this.newPlayer.jump();
                break;
            case "0":
                this.newPlayer.shoot(this.ctx);
                break;
        }
    }

    keyboardReleasedHandler(key) {
        switch(key) {
            case "d":
            case "a":
                this.player.velocity.x = 0;
                break;
            case "w":
                this.player.setSpeed(0, 0);
                break;
            case "arrowright":
            case "arrowleft":
                this.newPlayer.velocity.x = 0;
                break;
            case "arrowup":
                this.newPlayer.setSpeed(0, 0);
                break;
        }
    }

    update() {
        if(this.player.collision(this.ground)){
            if(this.player.velocity.y < 0){
                this.player.velocity.y = 0;
                this.player.canJump = true;
                this.player.position.y = this.ground.position.y + this.player.height;
                // console.log("Player pos: ", this.player.position);
                // console.log("Ground: ", this.ground.position);
            }
        }

        if(this.newPlayer.collision(this.ground)){
            if(this.newPlayer.velocity.y < 0){
                this.newPlayer.velocity.y = 0;
                this.newPlayer.canJump = true;
                this.newPlayer.position.y = this.ground.position.y + this.newPlayer.height;
                // console.log("Player pos: ", this.player.position);
                // console.log("Ground: ", this.ground.position);
            }
        }

        if(this.player.collision(this.box) || this.box.collision(this.player)) {
            if(this.player.position.y > this.box.y + this.player.height){
                this.player.velocity.x = 0;
            }
            
            if(this.player.velocity.x > 0){
                this.player.velocity.x = 0;
            }
            this.player.update();
            //this.player.position.x = this.obstacle.position.x - this.player.width;
            console.log("PLAYER CONTRO IL MURO");
        };

        this.player.update();
        this.newPlayer.update();
        this.fireball.update();

        for (let i = this.player.bullets.length - 1; i >= 0; i--) {
            let fireball = this.player.bullets[i];
            fireball.update();

            if (fireball.collision(this.newPlayer)) {
                this.player.bullets.splice(i, 1);
                console.log(this.newPlayer.health);
                this.newPlayer.health = Math.max(0, this.newPlayer.health - 10); 
            }
        }
    }

    playBgMusic() {
        this.bgMusic.play();
    }

    stopBgMusic() {
        this.bgMusic.stop();
    }

    draw() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        /*if(this.newPlayer.health <= 0){
            this.ctx.font = "30px Arial";
            this.ctx.fillStyle = "red";
            this.ctx.fillText("YOU WIN", 10, 50);
            return;
        }
        else{        
            this.newPlayer.draw(this.ctx);
            this.newPlayer.drawHealthBar(this.ctx);
        }*/

        this.newPlayer.draw(this.ctx);
        this.newPlayer.drawHealthBar(this.ctx);

        this.player.draw(this.ctx);
        this.player.drawHealthBar(this.ctx);
        
        this.fireball.draw(this.ctx);
        this.ground.draw(this.ctx);
        this.box.draw(this.ctx);
        
    }

}

export default Game;