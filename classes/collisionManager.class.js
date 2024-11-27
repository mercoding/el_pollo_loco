export class CollisionManager {
    constructor() {
        this.objects = [];
    }

    addObject(obj) {
        this.objects.push(obj);
    }


    updateCollisions() {
        this.collisionManager.updateCollisions();
        this.gameObjects.forEach(obj => {
            if (obj.updateCollider) {
                obj.updateCollider();
            }
        });
    }

    destroy(obj) { this.objects = this.objects.filter(o => o !== obj); }

    reset() { this.objects.forEach(obj => { this.destroy(obj) }); }


    updateCollisionOf(gameObject) {
        for (let index = 0; index < this.objects.length; index++) {
            if (this.objects[index] !== gameObject) {
                this.objects[index].updateCollision(gameObject);
            }
        }
    }

    clear() {
        this.objects.length = 0; // Leert die Liste der Objekte
    }

    Update() {
        for (let i = 0; i < this.objects.length; i++) {
            const objA = this.objects[i];
            for (let j = i + 1; j < this.objects.length; j++) {
                const objB = this.objects[j];

                if (objA.isCollidingWith(objB)) {
                    if (objA.collidingWith !== objB) {
                        objA.onCollisionEnter(objB);
                        objB.onCollisionEnter(objA);
                        objA.collidingWith = objB;
                        objB.collidingWith = objA;
                    }
                } else {
                    if (objA.collidingWith === objB) {
                        objA.onCollisionExit(objB);
                        objB.onCollisionExit(objA);
                        objA.collidingWith = null;
                        objB.collidingWith = null;
                    }
                }
            }
        }
    }
}
