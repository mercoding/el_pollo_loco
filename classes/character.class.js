import { Animatable, MovableObject } from "./movableObject.class.js";

export class Character extends Animatable(MovableObject) {
    global;
    constructor(x, y, width, height, animationPaths) {
        super(animationPaths, x, y, width, height);
        this.facingRight = true;
        this.onGround = true;
        this.jumpStrength = -200; // Sprungkraft
        this.gravity = 800;       // Gravitation (Anpassbar)
        this.health = 3; // Start-Leben des Charakters
        this.isInvincible = false; // Unverwundbarkeit nach Schaden
        this.invincibilityDuration = 1.0; // 1 Sekunde Unverwundbarkeit
        this.collider.width -= 60;
        this.collider.height = 125;
        this.isHurt = false;
        this.ground = 430;
        this.isOnObstacle = false;
    }

    Start() { }

    Update(ctx, deltaTime, screenX) {
        this.isOnGround(deltaTime);
        if (this.global.health < 1) this.setState('dead');
        else if (this.isHurt) this.setState('hurt');
        else this.move(deltaTime);
        this.drawCharacter(ctx, screenX);
        this.updateAnimation(deltaTime);
    }

    drawFacingRight(frame, ctx, screenX) {
        ctx.translate(screenX, this.y);
        ctx.scale(1, 1);
        ctx.drawImage(frame, 0, 0, this.width, this.height);
    }

    drawFacingLeft(frame, ctx, screenX) {
        ctx.translate(screenX / 4 - this.width, this.y);
        ctx.scale(-1, 1);
        ctx.drawImage(frame, -screenX, 0, this.width, this.height);
    }

    drawCharacter(ctx, screenX) {
        const frame = this.getCurrentFrame();

        if (frame) {
            ctx.save();
            if (!this.facingRight && this.global.health > 0) {
                this.drawFacingLeft(frame, ctx, screenX);
            } else {
                this.drawFacingRight(frame, ctx, screenX);
            }
            ctx.restore();
        }
    }

    walk(facing, x, speed) {
        this.facingRight = facing;
        this.velocity.x = x * speed;
        if (this.onGround) {
            this.setState('walk');
        }
    }

    idle() {
        if (this.onGround) {
            this.velocity.x = 0;
            this.setState('idle');
        }
    }

    jump() {
        if (this.onGround) {
            this.velocity.y = this.jumpStrength;
            this.onGround = false;
            this.setState('jump');
        }
    }

    isOnGround(deltaTime) {
        if (!this.onGround) {
            this.velocity.y += this.gravity * deltaTime; // Gravitationskraft addieren
        }
        // Bodenüberprüfung und Landen
        if (this.y + this.height >= this.ground) { // Bodenhöhe hier auf `400` festgelegt
            this.y = this.ground - this.height; // Charakter auf dem Boden halten
            this.land(); // Charakter landet und Animation wird zurückgesetzt
        }
    }

    land() {
        this.onGround = true;
        this.velocity.y = 0;
        if (this.state == 'jump') this.setState('idle');
        //else if (this.keyPressed) this.setState('walk');
    }

    takeDamage() {
        if (!this.isInvincible) { // Nur Schaden, wenn nicht unverwundbar
            this.health -= 1; // Reduziert das Leben um 1
            this.global.health -= 20;
            this.isInvincible = true;
            this.isHurt = true;
            this.setState('hurt');
            this.velocity.x = this.facingRight ? -150 : 150;
            setTimeout(() => {
                this.isInvincible = false;
                this.isHurt = false;
                if (this.global.health > 0) this.setState(this.onGround ? 'idle' : 'jump');
            }, this.invincibilityDuration * 1000);
        }
        this.isDead();
    }

    isDead() {        
        if (this.global.health <= 0) {
            this.setState('dead');
            //setTimeout(() => { this.global.gameOver = true;}, 8000);
        }
    }

    setStateOnce(newState) {
        if (this.state !== newState) this.setState(newState);
    }

    isCharacterOnObstacle(character, obstacle) {
        // Berechnung der linken und rechten Kanten des Charakters und des Hindernisses
        const characterLeft = character.x;
        const characterRight = character.x + character.width;
        const obstacleLeft = obstacle.x;
        const obstacleRight = obstacle.x + obstacle.width;

        // Überprüft, ob ein Teil des Charakters innerhalb der Breite des Hindernisses liegt
        return characterRight > obstacleLeft && characterLeft < obstacleRight;
    }

    /*
    handleObstacleCollision(obstacle) {
        const charHitbox = this.getHitbox();
        const obstacleHitbox = obstacle.getHitbox();
        const buffer = 2;  // Kleiner Abstand, um den Charakter direkt vor dem Hindernis zu platzieren

        // Vertikale Kollisionserkennung (Landen auf dem Hindernis):
        if (
            charHitbox.bottom > obstacleHitbox.top &&          // Unterseite des Charakters erreicht Oberseite des Hindernisses
            charHitbox.top < obstacleHitbox.top &&             // Charakter ist über dem Hindernis
            this.velocity.y >= 0                               // Charakter fällt oder ist stationär in der y-Richtung
        ) {
            this.y = obstacleHitbox.top - this.height;         // Positioniere den Charakter auf dem Hindernis
            this.velocity.y = 0;                               // Stoppe die vertikale Bewegung
            this.onGround = true;
            this.ground = 400;                          // Markiere als "auf dem Boden"
        }

        // Prüfen, ob der Charakter die linke Seite des Hindernisses erreicht
        if (
            this.velocity.x > 0 &&                          // Charakter bewegt sich nach rechts
            charHitbox.right > obstacleHitbox.left &&       // Rechte Seite des Charakters berührt linke Seite des Hindernisses
            charHitbox.left < obstacleHitbox.left           // Linke Seite des Charakters ist links vom Hindernis
        ) {
            this.x = obstacle.collider.x - buffer; // Positioniere den Charakter direkt links vom Hindernis
            this.velocity.x = 0;                                // Stoppe die horizontale Bewegung
            this.idle();   
            this.ground = 430;                                    // Setze den Charakter in den "idle"-Zustand
            return; // Verhindere, dass andere Kollisionen ausgelöst werden
        }

        // Prüfen, ob der Charakter die rechte Seite des Hindernisses erreicht
        if (
            this.velocity.x < 0 &&                          // Charakter bewegt sich nach links
            charHitbox.left < obstacleHitbox.right &&       // Linke Seite des Charakters berührt rechte Seite des Hindernisses
            charHitbox.right > obstacleHitbox.right        // Rechte Seite des Charakters ist rechts vom Hindernis
        ) {
            this.x = obstacle.collider.x + obstacle.collider.width;            // Positioniere den Charakter direkt rechts vom Hindernis
            this.velocity.x = 0;
            // Stoppe die horizontale Bewegung
            this.idle();     
            this.ground = 430;                                  // Setze den Charakter in den "idle"-Zustand
            return; // Verhindere, dass andere Kollisionen ausgelöst werden
        }


    }*/












        handleObstacleCollision(obstacle) {
            const charHitbox = this.getHitbox();
            const obstacleHitbox = obstacle.getHitbox();
            const buffer = 4; // Kleiner Puffer für die Platzierung

            // Vertikale Kollisionserkennung für das Landen auf dem Hindernis:
            /*
        if (
            charHitbox.bottom > obstacleHitbox.top &&       
            charHitbox.top < obstacleHitbox.top &&          
            this.onGround != true                             
        ) {
            this.y = obstacleHitbox.top - this.height; // Charakter auf das Hindernis setzen
            this.velocity.y = 0;
            this.onGround = true;
            this.ground = obstacleHitbox.top; // Setze die Bodenhöhe auf die Hindernishöhe
            this.isOnObstacle = true;
            this.ground = 400;            
        }
        else {
            this.isOnObstacle = false;
            this.resetAfterObstacle();
        }*/
        
            // Horizontale Kollision von links nach rechts
            if (
                this.velocity.x > 0 &&                      
                charHitbox.right > obstacleHitbox.left &&   
                charHitbox.left < obstacleHitbox.left       
            ) {
                this.x = obstacle.x - buffer; // Positioniere den Charakter direkt links vom Hindernis
                this.velocity.x = 0;
                this.idle();
                
            }
        
            // Horizontale Kollision von rechts nach links
            else if (
                this.velocity.x < 0 &&                     
                charHitbox.left < obstacleHitbox.right + 10 &&  
                charHitbox.right > obstacleHitbox.right + 10   
            ) {
                this.x = obstacle.collider.x + obstacle.collider.width;            // Positioniere den Charakter direkt rechts vom Hindernis
                this.velocity.x = 0;
                this.idle();
                
            } 
            this.resetAfterObstacle();            
        }
        
    
        resetAfterObstacle() {
            // Wenn der Charakter nicht mehr auf einem Hindernis ist, setze `ground` auf Standardbodenhöhe zurück
            if (!this.isOnObstacle) {
                this.ground = 430; // Setze die Standard-Bodenhöhe
            } else {
                this.isOnObstacle = false; // `isOnObstacle` zurücksetzen, wenn kein Hindernis erkannt
            }
        }




}
