/**
 * State dead
 *
 * @export
 * @class DeadState
 * @typedef {DeadState}
 */
export class DeadState {
    constructor(boss) {
        this.boss = boss;
    }

    /** Set settings on start */
    onEnter() {
        this.boss.setState('dead'); 
        this.boss.velocity.x = 0;   
        this.boss.velocity.y = 0;   
        this.boss.dead = true;
        this.boss.global.collisionManager.destroy(this.boss);
    }

    /**
     * Update function
     *
     * @param {*} deltaTime
     */
    onUpdate(deltaTime) {
        this.boss.updateAnimation(deltaTime);
    }

    /** Set settings on exit */
    onExit() {
        // No exit, this stops all state changes because boss is dead
    }
}
