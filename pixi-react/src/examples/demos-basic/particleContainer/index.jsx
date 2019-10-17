/**
 * 颗粒容器
 * 
 * ParticleContainer 是 Container 的快速版本 (a really fast version)，仅仅为了更快而构建，因此在需要大量 Sprite 或 particles(颗粒) 的情况下使用。
 * ParticleContainer 的权衡在于大多数高级功能将不起作用。
 *      - ParticleContainer 实现了基本的对象变换（位置，比例，旋转）和一些高级功能，如色调（自v4.5.6起）
 *      - 其他更高级的功能（如遮罩，子级，滤镜等）则不适用于 ParticleContainer
 */
import React, { Component } from 'react';
import * as PIXI from 'pixi.js';
const reactLogo = require("../../../source/react.png");

export default class CacheAsBitmap extends Component {
    app = PIXI.Application;
    canvas = HTMLDivElement;

    componentDidMount() {
        // 创建一个 canvas stage
        this.app = new PIXI.Application({ width: 500, height: 500, transparent: true });
        // 把这个 stage 挂载到元素上
        this.canvas.appendChild(this.app.view);
        
        // 生成 10000 个 Sprite 的 [ParticleContainer](http://pixijs.download/release/docs/PIXI.ParticleContainer.html#ParticleContainer)
        const sprites = new PIXI.ParticleContainer(
            10000, // 容器可以渲染的最大粒子数
            { // * 为 true * 就会被应用
                vertices: true, // scale
                position: true,
                rotation: true,
                uvs: true,
                alpha: true,
            }
        );

        // 把这个 ParticleContainer 放进 stage
        this.app.stage.addChild(sprites);

        const reacts = [];

        const totalSprites = this.app.renderer instanceof PIXI.Renderer ? 10000 : 100;

        for (let i = 0; i < totalSprites; i++) {
            // 创建 Sprite
            const react = PIXI.Sprite.from(reactLogo);

            // 锚点居中
            react.anchor.set(0.5);

            // 设置这个 Sprite 默认大小
            react.scale.set(0.8 + Math.random() * 0.3);

            // 给这个 Sprite 一个随机位置
            react.x = Math.random() * this.app.screen.width;
            react.y = Math.random() * this.app.screen.height;

            react.tint = Math.random() * 0xFFFFFF;

            // create a random direction in radians
            react.direction = Math.random() * Math.PI * 2;

            // this number will be used to modify the direction of the sprite over time
            react.turningSpeed = Math.random() - 0.8;

            // create a random speed between 0 - 2, and these reacts are slooww
            react.speed = (2 + Math.random() * 2) * 0.2;

            react.offset = Math.random() * 100;

            // finally we push the react into the reacts array so it it can be easily accessed later
            reacts.push(react);

            sprites.addChild(react);
        }

        // create a bounding box box for the little reacts
        const reactBoundsPadding = 100;
        const reactBounds = new PIXI.Rectangle(
            -reactBoundsPadding,
            -reactBoundsPadding,
            this.app.screen.width + reactBoundsPadding * 2,
            this.app.screen.height + reactBoundsPadding * 2,
        );

        let tick = 0;

        this.app.ticker.add(() => {
            // iterate through the sprites and update their position
            for (let i = 0; i < reacts.length; i++) {
                const react = reacts[i];
                react.scale.y = 0.95 + Math.sin(tick + react.offset) * 0.05;
                react.direction += react.turningSpeed * 0.01;
                react.x += Math.sin(react.direction) * (react.speed * react.scale.y);
                react.y += Math.cos(react.direction) * (react.speed * react.scale.y);
                react.rotation = -react.direction + Math.PI;

                // wrap the reacts
                if (react.x < reactBounds.x) {
                    react.x += reactBounds.width;
                } else if (react.x > reactBounds.x + reactBounds.width) {
                    react.x -= reactBounds.width;
                }

                if (react.y < reactBounds.y) {
                    react.y += reactBounds.height;
                } else if (react.y > reactBounds.y + reactBounds.height) {
                    react.y -= reactBounds.height;
                }
            }

            // increment the ticker
            tick += 0.1;
        });



    }

    render() {
        // 用 React 的 ref 将 Pixi 实现
        return (
            <div ref={(e) => { this.canvas = e }} />
        );
    }
}