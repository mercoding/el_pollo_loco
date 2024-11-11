import { pepeAnimations } from "../animations/character.anim.js";
import { chickenAnimations } from "../animations/chicken.anim.js";
import { Character } from "../classes/character.class.js";
import { Chicken } from "../classes/chicken.class.js";
import { Game } from "../classes/game.class.js";
import { GameObject } from "../classes/gameObject.class.js";
import { Global } from "../classes/global.class.js";

const global = new Global();
const game = new Game(global);
let character, chicken;
const ground = new GameObject(0, 250, 500, 20);


function init() {
    character = new Character(10, 350, 50, 150, pepeAnimations);
    chicken = new Chicken(200, 200, 30, 30, chickenAnimations);
    game.addGameObject(character);

    //control();
    game.Start();
}

function onKeydown() {
    document.addEventListener('keydown', event => {  
        switch (event.key) {
            case 'ArrowLeft': 
                if(character.onGround) character.setState('walk');
                character.facingRight = false;
                game.keysPressed.left = true;
                break;
            case 'ArrowRight': 
                if(character.onGround) character.setState('walk');
                character.facingRight = true;
                game.keysPressed.right = true;
                break;
            case 'ArrowUp':
                if (character.onGround) {
                    character.jump(); // Springen und Zustand wird innerhalb von `jump()` gesetzt
                }
                break;
        }
    });
}

function onKeyup() {
    document.addEventListener('keyup', event => {
        if(['ArrowLeft', 'ArrowRight'].includes(event.key)) {
            character.Translate(0, 0, 0);
            character.moveSimulation = false;
            character.keyPressed = false;
            game.keysPressed.right = false;
            game.keysPressed.left = false;
            if (character.onGround) character.setState('idle'); // Nur zurück zu `idle`, wenn er am Boden ist
        }
    });
}

function control() {
    onKeydown();
    onKeyup();
}

window.init = init;
