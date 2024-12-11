import { pepeAnimations } from "../animations/character.anim.js";
import { Character } from "./character.class.js";
import { InputHandler } from "./inputHandler.class.js";

export class Player {
    constructor(canvas, global) {
        this.canvas = canvas;
        this.global = global;
        this.inputHandler = new InputHandler();
        this.joystickOffset = { x: 0, y: 0 }; // Offset des inneren Kreises
        this.setTouchControls();
        this.Start();
    }

    getSmallTouchControls() {
        this.touchControls = {
            joystick: { x: 30, y: this.global.canvas.height - 25, radius: 20, },
            fireButton: { x: this.global.canvas.width - 32, y: this.global.canvas.height - 25, radius: 20, },
            jumpButton: { x: this.global.canvas.width - 82, y: this.global.canvas.height - 25, radius: 20, },
        };
    }

    getLargeTouchControls() {
        this.touchControls = {
            joystick: { x: 60, y: this.global.canvas.height - 45, radius: 40, },
            fireButton: { x: this.global.canvas.width - 52, y: this.global.canvas.height - 45, radius: 30, },
            jumpButton: { x: this.global.canvas.width - 122, y: this.global.canvas.height - 45, radius: 30, },
        };
    }

    setTouchControls() {
        if (window.innerWidth < 1024) this.getSmallTouchControls();
        else this.getLargeTouchControls();
    }

    initializeCharacter() {
        // Erstelle und füge den Charakter hinzu
        this.character = new Character(pepeAnimations, this.global.collisionManager, this.canvas.width, this.global.groundLevel, 50, 150, 'Player');
        this.character.x = 0;
        this.character.global = this.global;
        this.global.addGameObject(this.character);
        this.global.collisionManager.addObject(this.character);
    }

    resetCharacter() {
        if (this.character) {
            this.global.destroy(this.character);
            this.global.collisionManager.destroy(this.character);
        }
        this.inputHandler.deactivate();
        this.initializeCharacter();
    }

    Start() {
        // Initiale Logik bei Spielstart, falls nötig
        this.initializeCharacter();
        this.character.Start();
    }

    Update(ctx, deltaTime) {
        if (this.global.pause) return;
        if (this.global.gameOver) {
            this.character.velocity.x = 0;
            this.character.velocity.y = 0;
            if (this.character.state != 'dead') this.character.setState('idle');
            return;
        }
        this.checkIfOnMobile(ctx);
        this.handleCameraAndCharacterMovement(this.character, deltaTime);
    }

    checkIfOnMobile(ctx) {
        if (this.hasTouchSupport()) {
            this.drawControls(ctx);
            this.initializeTouchControls();
        }
        else this.removeTouchControls();
    }

    isHurt(deltaTime) {
        if (this.character.isHurt) {
            this.character.velocity.x = 0;
            this.character.velocity.y = 30;
            this.character.move(deltaTime);
            return true;
        }
        return false;
    }

    handleInput(deltaTime) {
        if (this.global.health <= 0 || this.global.pause) return;
        const input = this.inputHandler.getInput();
        if (this.isHurt(deltaTime)) return;
        if (input.right) this.character.walk(true, 1, 100);
        else if (input.left) this.character.walk(false, -1, 100);
        else this.character.idle();
        if (input.space || input.up) this.character.jump();
        if (input.fKey) this.character.throwBottle();
        this.character.move(deltaTime);
    }

    handleCameraAndCharacterMovement(character, deltaTime) {
        if (this.global.pause) return;
        this.cameraX = character.x; // Zentriere die Kamera auf den Charakter
        this.handleInput(deltaTime);
        character.updateCollider(); // Aktualisiere den Collider des Charakters
    }

    drawJoystick(ctx) {
        const joystick = this.touchControls.joystick;
        ctx.beginPath();
        ctx.arc(joystick.x, joystick.y, joystick.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 0, 0, 0.25)';
        ctx.fill();

        const innerX = joystick.x + this.joystickOffset.x;
        const innerY = joystick.y + this.joystickOffset.y;

        ctx.beginPath();
        ctx.arc(innerX, innerY, joystick.radius / 2, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fill();
    }

    drawFireButton(ctx) {
        // Zeichne den Feuerknopf
        const fireButton = this.touchControls.fireButton;
        ctx.beginPath();
        ctx.arc(fireButton.x, fireButton.y, fireButton.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '25px Boogaloo';
        ctx.textAlign = 'center';
        ctx.fillText("F", fireButton.x, fireButton.y + 8);
    }

    drawJumpButton(ctx) {
        const jumpButton = this.touchControls.jumpButton;
        ctx.beginPath();
        ctx.arc(jumpButton.x, jumpButton.y, jumpButton.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(255, 0, 0, 0.7)';
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = '25px Boogaloo';
        ctx.textAlign = 'center';
        ctx.fillText("J", jumpButton.x, jumpButton.y + 8);
    }

    drawControls(ctx) {
        this.drawJoystick(ctx)
        this.drawFireButton(ctx);
        this.drawJumpButton(ctx);
    }


    initializeTouchControls() {
        this.global.canvas.addEventListener('touchstart', this.handleTouchStart.bind(this));
        this.global.canvas.addEventListener('touchmove', this.handleTouchMove.bind(this));
        this.global.canvas.addEventListener('touchend', this.handleTouchEnd.bind(this));

        this.joystickActive = false;
        this.joystickOffset = { x: 0, y: 0 };
    }

    removeTouchControls() {
        this.global.canvas.removeEventListener('touchstart', this.handleTouchStart.bind(this));
        this.global.canvas.removeEventListener('touchmove', this.handleTouchMove.bind(this));
        this.global.canvas.removeEventListener('touchend', this.handleTouchEnd.bind(this));
    }

    touchOnJoystick(touchX, touchY) {
        // Überprüfe, ob der Touch im Joystick-Bereich ist
        const joystick = this.touchControls.joystick;
        const dx = touchX - joystick.x;
        const dy = touchY - joystick.y;
        if (Math.sqrt(dx * dx + dy * dy) <= joystick.radius) {
            this.joystickActive = true;
            this.joystickOffset = { x: dx, y: dy };
        }
    }

    touchOnFireButton(touchX, touchY) {
        const fireButton = this.touchControls.fireButton;
        if (
            Math.sqrt(
                Math.pow(touchX - fireButton.x, 2) +
                Math.pow(touchY - fireButton.y, 2)
            ) <= fireButton.radius
        ) {
            this.character.throwBottle(); // Feuerknopf gedrückt
        }
    }

    touchOnJumpButton(touchX, touchY) {
        const jumpButton = this.touchControls.jumpButton;
        if (
            Math.sqrt(
                Math.pow(touchX - jumpButton.x, 2) +
                Math.pow(touchY - jumpButton.y, 2)
            ) <= jumpButton.radius
        ) {
            this.character.jump();
        }
    }

    handleTouchStart(event) {
        const rect = this.global.canvas.getBoundingClientRect();
        const touches = event.touches;

        for (let i = 0; i < touches.length; i++) {
            const touchX = touches[i].clientX - rect.left;
            const touchY = touches[i].clientY - rect.top;

            this.touchOnJoystick(touchX, touchY);
            this.touchOnFireButton(touchX, touchY);
            this.touchOnJumpButton(touchX, touchY);
        }
    }


    calculateJoystickTouchDirection(joystick, dx, dy) {
        const magnitude = Math.sqrt(dx * dx + dy * dy);
        if (magnitude <= joystick.radius) {
            this.joystickOffset = { x: dx, y: dy };
        } else {
            this.joystickOffset = {
                x: (dx / magnitude) * joystick.radius / 2,
                y: (dy / magnitude) * joystick.radius / 2,
            };
        }
    }

    translateJoystickMovementIntoInput(dx) {
        if (dx < 0) {
            this.inputHandler.keysPressed.right = false;
            this.inputHandler.keysPressed.left = true;
        }
        if (dx > 0) {
            this.inputHandler.keysPressed.right = true;
            this.inputHandler.keysPressed.left = false;
        }
    }

    handleTouchMove(event) {
        const rect = this.global.canvas.getBoundingClientRect();
        const touch = event.touches[0];
        const touchX = touch.clientX - rect.left;
        const touchY = touch.clientY - rect.top;

        const joystick = this.touchControls.joystick;
        const dx = touchX - joystick.x;
        const dy = touchY - joystick.y;

        // Berechne die Richtung und begrenze den Offset auf den Radius
        this.calculateJoystickTouchDirection(joystick, dx, dy);
        this.translateJoystickMovementIntoInput(dx);

    }


    handleTouchEnd(event) {
        this.joystickActive = false;
        this.joystickOffset = { x: 0, y: 0 };
        this.character.velocity.x = 0;
        this.character.velocity.y = 0; // Stoppe den Charakter, wenn der Finger losgelassen wird
        this.inputHandler.keysPressed.right = false;
        this.inputHandler.keysPressed.left = false;
        this.inputHandler.keysPressed.space = false;
    }

    detectMobileDevice() {
        const userAgent = navigator.userAgent || navigator.vendor || window.opera;
        const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;

        // Kombiniere User-Agent-Abfrage und Touch-Unterstützung
        const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent);

        return isMobile || isTouch;
    }

    hasTouchSupport() {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0;
    }
}
