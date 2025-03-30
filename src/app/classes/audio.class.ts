import Phaser from 'phaser';

export class Audio {

    scene: Phaser.Scene;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
    }

    loadAudio(key: string, path: string) {
        this.scene.load.audio(key, path);
    }


    playAudio(key: string, volume: number) {
        const sound = this.scene.sound.add(key, { volume });
        sound.play();
    }

    stopAudio(key: string) {
        const sound = this.scene.sound.get(key);
        if (sound) {
            sound.stop();
        }
    }

    pauseAudio(key: string) {
        const sound = this.scene.sound.get(key);
        if (sound) {
            sound.pause();
        }
    }

    preload() {
        this.loadAudio('backgroundMusic', 'audio/background_music.mp3');
    }

    create() {
        const backgroundMusic = this.scene.sound.add('backgroundMusic', { volume: 0.5 , loop: true });
        backgroundMusic.play();
    }

}