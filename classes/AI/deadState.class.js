export class DeadState {
    constructor(boss) {
        this.boss = boss;
    }

    onEnter() {
        this.boss.setState('dead'); // Setzt den Zustand auf 'dead'
        this.boss.velocity.x = 0;   // Stoppt jede Bewegung
        this.boss.velocity.y = 0;   // Stoppt jede Bewegung
        this.boss.dead = true;
        //this.boss.collidable = false; // Der Endgegner ist nicht mehr kollidierbar
        this.boss.global.collisionManager.destroy(this.boss);
    }

    onUpdate(deltaTime) {
        // Keine weiteren Updates oder Bewegungen, spielt nur die Animation ab
        this.boss.updateAnimation(deltaTime);
    }

    onExit() {
        // Kein Exit, da der Boss nach dem Tod keine weiteren Zustände wechselt
    }
}
