import { chickenAnimations, smallChickenAnimations } from "../animations/chicken.anim.js";
import { Chicken } from "../classes/chicken.class.js";
import { adjustCoinPosition } from "./spawnCoins.js";


function isChickenNearby(game, x, y, threshold = 100) {
    // Prüfe, ob ein Chicken in der Nähe der geplanten Position ist
    return game.global.gameObjects.some(obj => {
        return obj instanceof Chicken &&
            Math.abs(obj.x - x) < threshold &&  // Horizontal in der Nähe
            Math.abs(obj.y - y) < threshold;    // Vertikal in der Nähe
    });
}


function isChickenNearbyObstacle(game, x, y, threshold = 5) {
    // Prüfe, ob ein Chicken in der Nähe der geplanten Position ist
    return game.global.gameObjects.some(obj => {
        return obj instanceof Obstacle &&
            Math.abs(obj.x - x) < threshold &&  // Horizontal in der Nähe
            Math.abs(obj.y - y) < threshold;    // Vertikal in der Nähe
    });
}


function setEnemyFacing(enemy, character) {
    if (character.velocity.x > 0) {
        enemy.facingRight = true;
        enemy.setTarget(character);  // Setzt das Ziel auf den Charakter
        enemy.player = character;
    }
    else {
        enemy.facingRight = false;
        enemy.setTarget(character);
        enemy.player = character;
    }
}

function getChicken(game, spawnX) {
    const rand = Math.floor(Math.random(0, 10) * 10);
    const chicken = rand < 5 ? chickenAnimations : smallChickenAnimations;
    const height = rand < 5 ? 50 : 35;
    const width = rand < 5 ? 50 : 35;
    const groundLevel = rand < 5 ? game.groundLevel - 50 : game.groundLevel - 35;
    const enemy = new Chicken(chicken, game.global.collisionManager, spawnX, groundLevel, width, height, 'Enemy');
    return enemy;
}


function pushChickenToGame(game, enemy, spawnX, currentFrameTime) {
    game.global.addGameObject(enemy);
    game.global.collisionManager.addObject(enemy);
    game.lastEnemySpawnTime = currentFrameTime;
    game.lastCharacterX = spawnX;
}


export function checkAndSpawnEnemy(game, performance, character) {
    if (character.x > 9000 || character.x < -9000) return;
    const currentFrameTime = performance.now() / 1000;
    if ((currentFrameTime - game.lastEnemySpawnTime >= game.spawnCooldown) &&
        Math.abs(character.x - game.lastCharacterX) >= game.spawnDistance) {
        let spawnX = character.x + (character.velocity.x > 0 ? game.spawnDistance : -game.spawnDistance);
        spawnX = adjustCoinPosition(spawnX, 70);
        if (!isChickenNearby(game, spawnX, game.groundLevel - 50, 500)) {
            const enemy = getChicken(game, spawnX);
            enemy.global = game.global;
            setEnemyFacing(enemy, character);
            pushChickenToGame(game, enemy, spawnX, currentFrameTime);
        }
    }
}