/**
 * 时空穿梭
 */
import React, { Component } from 'react';
import * as PIXI from 'pixi.js';
const react = require("../../../source/white.png");

export default class CacheAsBitmap extends Component {
    app = PIXI.Application;
    canvas = HTMLDivElement;

    componentDidMount() {
        // 创建一个 canvas stage
        this.app = new PIXI.Application({ width: window.innerWidth, height: window.innerHeight, transparent: false });
        // 把这个 stage 挂载到元素上
        this.canvas.appendChild(this.app.view);

        /**
         * 纹理存储代表图像或图像一部分的信息。
         * 不能直接将其添加到显示列表中。而是将其用作Sprite的纹理。如果没有为纹理提供框架，则使用整个图像。
         */
        const starTexture = PIXI.Texture.from(react);

        const starAmount = 10000;
        let cameraZ = 0;
        const fov = 20;
        const baseSpeed = 0.025;
        let speed = 0;
        let warpSpeed = 0;
        const starStretch = 5;
        const starBaseSize = 0.05;


        // 创建 ✨✨✨
        const stars = [];
        for (let i = 0; i < starAmount; i++) {
            const star = {
                sprite: new PIXI.Sprite(starTexture),
                z: 0,
                x: 0,
                y: 0
            };
            star.sprite.anchor.x = 0.5;
            star.sprite.anchor.y = 0.7;
            randomizeStar(star, true);
            this.app.stage.addChild(star.sprite);
            stars.push(star);
        }

        /**
         * 
         * @param {*} star 
         * @param {*} initial 
         */
        function randomizeStar(star, initial) {
            star.z = initial ? Math.random() * 2000 : cameraZ + Math.random() * 1000 + 2000;

            // Calculate star positions with radial random coordinate so no star hits the camera.
            // 圆面积：2πr
            const deg = Math.random() * Math.PI * 2;
            // 让✨之间有一个 51 以内的随机间隔，后面的 1 是圆的空心
            const distance = Math.random() * 50 + 1;
            star.x = 1;
            star.y =  deg !== 0 ? Math.sin(deg) * distance : 0;
        }

        // 设置一个定时器
        setInterval(() => {
            warpSpeed = warpSpeed > 0 ? 0 : 1;
        }, 5000);

        // Listen for animate update
        this.app.ticker.add((delta) => {
            // Simple easing. This should be changed to proper easing function when used for real.
            speed += (warpSpeed - speed) / 20;
            cameraZ += delta * 10 * (speed + baseSpeed);
            for (let i = 0; i < starAmount; i++) {
                const star = stars[i];
                if (star.z < cameraZ) randomizeStar(star);

                // Map star 3d position to 2d with really simple projection
                const z = star.z - cameraZ;
                star.sprite.x = star.x * (fov / z) * this.app.renderer.screen.width + this.app.renderer.screen.width / 2;
                star.sprite.y = star.y * (fov / z) * this.app.renderer.screen.width + this.app.renderer.screen.height / 2;

                // Calculate star scale & rotation.
                const dxCenter = star.sprite.x - this.app.renderer.screen.width / 2;
                const dyCenter = star.sprite.y - this.app.renderer.screen.height / 2;
                const distanceCenter = Math.sqrt(dxCenter * dxCenter + dyCenter + dyCenter);
                const distanceScale = Math.max(0, (2000 - z) / 2000);
                star.sprite.scale.x = distanceScale * starBaseSize;
                // Star is looking towards center so that y axis is towards center.
                // Scale the star depending on how fast we are moving, what the stretchfactor is and depending on how far away it is from the center.
                star.sprite.scale.y = distanceScale * starBaseSize + distanceScale * speed * starStretch * distanceCenter / this.app.renderer.screen.width;
                star.sprite.rotation = Math.atan2(dyCenter, dxCenter) + Math.PI / 2;
            }
        });
        
    }

    render() {
        // 用 React 的 ref 将 Pixi 实现
        return (
            <div ref={(e) => { this.canvas = e }} />
        );
    }
}