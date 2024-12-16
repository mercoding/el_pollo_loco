import { chickenAnimations, smallChickenAnimations } from "../animations/chicken.anim.js";
import { Chicken } from "../classes/chicken.class.js";
import { Obstacle } from "../classes/obstacle.class.js";
import { adjustCoinPosition } from "./spawnCoins.js";


/**
 * Check if spawned chicken is near by another chicken
 *
 * @param {*} game
 * @param {*} x
 * @param {*} y
 * @param {number} [threshold=100]
 * @returns {*}
 */
function isChickenNearby(game, x, y, threshold = 100) {
    // Prüfe, ob ein Chicken in der Nähe der geplanten Position ist
    return game.global.gameObjects.some(obj => {
        return obj instanceof Chicken &&
            Math.abs(obj.x - x) < threshold &&  // Horizontal in der Nähe
            Math.abs(obj.y - y) < threshold;    // Vertikal in der Nähe
    });
}


/**
 * Check if chicken is near by obstacle
 *
 * @param {*} game
 * @param {*} x
 * @param {*} y
 * @param {number} [threshold=5]
 * @returns {*}
 */
function isChickenNearbyObstacle(game, x, y, threshold = 5) {
    // Prüfe, ob ein Chicken in der Nähe der geplanten Position ist
    return game.global.gameObjects.some(obj => {
        return obj instanceof Obstacle &&
            Math.abs(obj.x - x) < threshold &&  // Horizontal in der Nähe
            Math.abs(obj.y - y) < threshold;    // Vertikal in der Nähe
    });
}


/**
 * Set chicken facing into walking direction
 *
 * @param {*} enemy
 * @param {*} character
 */
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

/**
 * Get chicken game object
 *
 * @param {*} game
 * @param {*} spawnX
 * @returns {Chicken}
 */
function getChicken(game, spawnX) {
    const rand = Math.floor(Math.random(0, 10) * 10);
    const chicken = rand < 5 ? chickenAnimations : smallChickenAnimations;
    const height = rand < 5 ? 50 : 35;
    const width = rand < 5 ? 50 : 35;
    const groundLevel = rand < 5 ? game.global.groundLevel - 50 : game.global.groundLevel - 35;
    const enemy = new Chicken(chicken, game.global.collisionManager, game.global, spawnX, groundLevel, width, height, 'Enemy');
    return enemy;
}


/**
 * Push spwaned chicken into game list
 *
 * @param {*} game
 * @param {*} enemy
 * @param {*} spawnX
 * @param {*} currentFrameTime
 */
function pushChickenToGame(game, enemy, spawnX, currentFrameTime) {
    game.global.addGameObject(enemy);
    game.global.collisionManager.addObject(enemy);
    game.lastEnemySpawnTime = currentFrameTime;
    game.lastCharacterX = spawnX;
}


/**
 * Check if chicken spwaned into right range and spawn chicken
 *
 * @export
 * @param {*} game
 * @param {*} performance
 * @param {*} character
 */
export function checkAndSpawnEnemy(game, performance, character) {
    if (character.x > 9000 || character.x < -9000) return;
    const currentFrameTime = performance.now() / 1000;
    if ((currentFrameTime - game.lastEnemySpawnTime >= game.spawnCooldown) &&
        Math.abs(character.x - game.lastCharacterX) >= game.spawnDistance) {
        let spawnX = character.x + (character.velocity.x > 0 ? game.spawnDistance : -game.spawnDistance);
        spawnX = adjustCoinPosition(spawnX, 70);
        if (!isChickenNearby(game, spawnX, game.global.groundLevel, 500) ^ !isChickenNearbyObstacle(game, spawnX, game.global.groundLevel, 500)) {
            const enemy = getChicken(game, spawnX);
            enemy.global = game.global;
            setEnemyFacing(enemy, character);
            pushChickenToGame(game, enemy, spawnX, currentFrameTime);
        }
    }
}