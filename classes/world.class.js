export class World {
    backgroundImageSky = new Image();
    backgroundImageClouds = new Image();
    backgroundImageMountains = new Image();
    backgroundImageFar = new Image();
    backgroundImageNear = new Image();

    constructor() {
        this.canvas = document.getElementById('canvas');
        this.ctx = this.canvas.getContext('2d');

        this.setBackground();

        // Scroll-Geschwindigkeiten
        this.cloudsOffset = 0;
        this.scrollSpeedClouds = 0.2;    // Langsame Geschwindigkeit für die kontinuierliche Bewegung der Wolken
        this.scrollSpeedMountains = 0.4; // Geschwindigkeit für die Berge
        this.scrollSpeedFar = 0.5;       // Geschwindigkeit für den fernen Hintergrund
        this.scrollSpeedNear = 1.0;      // Geschwindigkeit für den vorderen Hintergrund
    }

    setBackground() {
        // Parallax-Hintergrundbilder
        this.backgroundImageSky.src = 'img/5_background/layers/air.png';
        this.backgroundImageClouds.src = 'img/5_background/layers/4_clouds/full.png';
        this.backgroundImageMountains.src = 'img/5_background/layers/3_third_layer/full.png';
        this.backgroundImageFar.src = 'img/5_background/layers/2_second_layer/full.png';
        this.backgroundImageNear.src = 'img/5_background/layers/1_first_layer/full.png';
    }

    setSky() {
        this.ctx.drawImage(this.backgroundImageSky, 0, 0, this.canvas.width, this.canvas.height);
        this.cloudsOffset -= this.scrollSpeedClouds;
        const cloudsX = this.cloudsOffset % this.canvas.width;
        this.ctx.drawImage(this.backgroundImageClouds, cloudsX, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImageClouds, cloudsX + this.canvas.width, 0, this.canvas.width, this.canvas.height);
        if (cloudsX > 0) {
            this.ctx.drawImage(this.backgroundImageClouds, cloudsX - this.canvas.width, 0, this.canvas.width, this.canvas.height);
        }
    }

    setMountains() {
        const mountainX = Math.floor(-(this.cameraX * this.scrollSpeedMountains) % this.canvas.width);
        this.ctx.drawImage(this.backgroundImageMountains, mountainX, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImageMountains, mountainX + this.canvas.width, 0, this.canvas.width, this.canvas.height);
        if (mountainX > 0) {
            this.ctx.drawImage(this.backgroundImageMountains, mountainX - this.canvas.width, 0, this.canvas.width, this.canvas.height);
        }
    }

    setFarLayer() {
        const farX = Math.floor(-(this.cameraX * this.scrollSpeedFar) % this.canvas.width);
        this.ctx.drawImage(this.backgroundImageFar, farX, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImageFar, farX + this.canvas.width, 0, this.canvas.width, this.canvas.height);
        if (farX > 0) {
            this.ctx.drawImage(this.backgroundImageFar, farX - this.canvas.width, 0, this.canvas.width, this.canvas.height);
        }
    }

    
    setNearLayer() {
        const nearX = Math.floor(-(this.cameraX * this.scrollSpeedNear) % this.canvas.width);
    
        this.ctx.drawImage(this.backgroundImageNear, nearX, 0, this.canvas.width, this.canvas.height);
        this.ctx.drawImage(this.backgroundImageNear, nearX + this.canvas.width, 0, this.canvas.width, this.canvas.height);
        if (nearX > 0) {
            this.ctx.drawImage(this.backgroundImageNear, nearX - this.canvas.width, 0, this.canvas.width, this.canvas.height);
        }
    }
    

    renderBackgrounds() {
        this.setSky();
        this.setMountains();
        this.setFarLayer();
        this.setNearLayer();
    }
}