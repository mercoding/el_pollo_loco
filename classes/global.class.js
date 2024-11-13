export class Global {
    constructor() {
        this.health = 100;
        this.bottles = 10;
        this.points = 0;
        this.coins = 0;
        this.gameOver = false;
        //this.isHurt = false;
        this.break = false;
    }

    calculateBottlePercentage(bottleCount) {
        // Maximalanzahl der Flaschen
        const maxBottles = 10;
    
        // Berechne den Prozentsatz der aktuellen Flaschenanzahl
        const percentage = (bottleCount / maxBottles) * 100;
    
        // Runde auf den nächsten Schritt herunter, der in der UI-Anzeige verfügbar ist
        if (percentage >= 100) return 100;
        if (percentage >= 80) return 80;
        if (percentage >= 60) return 60;
        if (percentage >= 40) return 40;
        if (percentage >= 20) return 20;
        return 0;
    }

    getBottles() {
        return this.calculateBottlePercentage(this.bottles);
    }
}