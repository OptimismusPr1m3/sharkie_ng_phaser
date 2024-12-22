import Phaser from 'phaser';
import { MovableObjects } from './movableObjects.class';

export class Player extends MovableObjects {
    
    constructor(scene: Phaser.Scene) {
        super(scene)
    }

    preload() {
        this.loadImages(18, 'sharkie', 'assets/sharkie/idle/');
    }

    create() {

        this.scene.add.image(720, 1080 / 2, 'sharkie1')

    }

}