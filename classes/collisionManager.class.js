export class CollisionManager {
    constructor() {
        this.objects = [];
    }

    addObject(obj) {
        this.objects.push(obj);
    }

    destroy(gameObject) {
        const index = this.objects.indexOf(gameObject);
        if (index !== -1) {
            this.objects.splice(index, 1);
        }
    }

    updateCollisions() {                
        this.objects.forEach(obj1 => {
            this.objects.forEach(obj2 => {
                if (obj1 !== obj2) {
                    obj1.updateCollision(obj2);
                }
            });
        });
    }


    updateCollisionOf(gameObject) {
        for (let index = 0; index < this.objects.length; index++) {
            if (this.objects[index] !== gameObject) {
                this.objects[index].updateCollision(gameObject);
            }
        }
    }
}
