/**
 * 旋转变大变小
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
        
        this.app.stop();

        const reacts = [];

        // 创建一个空的 Pixi 容器 [Container](http://pixijs.download/release/docs/PIXI.Container.html)
        const reactContainer = new PIXI.Container();
        reactContainer.x = 400;
        reactContainer.y = 300;

        const onAssetsLoaded = (x, y) => {
            // 创建 100 个 Sprite
            for (let i = 0; i < 100; i++) {
                // 把 React LOGO 引进来随机给个颜色
                const react = PIXI.Sprite.from(y.reactLogo.url);
                react.tint = Math.random() * 0xFFFFFF;
        
                // 给元素一个随机的位置
                react.x = Math.random() * 800 - 400;
                react.y = Math.random() * 600 - 300;

                // 锚点定中间
                react.anchor.set(0.5);
                reacts.push(react);

                // 把这些 Sprite 装进这个 Container 中
                reactContainer.addChild(react);
            }
            // 创建好之后开始
            this.app.start();
        }
        
        // 新的引用方式，[文档](http://pixijs.download/release/docs/PIXI.Loader.html)
        this.app.loader
            .add('reactLogo', reactLogo)
            .load(onAssetsLoaded);
        
        // interactive 设置为 true 才能触发触摸 & 鼠标事件 [interactive](http://pixijs.download/release/docs/PIXI.Sprite.html#interactive)
        this.app.stage.interactive = true;

        // 把装有 Sprites 的 Container 放进 stage 中
        this.app.stage.addChild(reactContainer);

        const onClick = () => {
            reactContainer.cacheAsBitmap = !reactContainer.cacheAsBitmap;
        }

        this.app.stage.buttonMode = true;
        // 结合 鼠标点击 + 触摸
        this.app.stage.on('pointertap', onClick);

        let count = 0;
        this.app.ticker.add(() => {
            // 让每个 Sprite 转起来
            for (let i = 0; i < 100; i++) {
                const react = reacts[i];
                react.rotation += -1;
            }

            // 让容器也动起来
            count += 0.01;
            reactContainer.scale.x = Math.sin(count);
            reactContainer.scale.y = Math.sin(count);
            reactContainer.rotation += -0.01;
        });
    }

    render() {
        // 用 React 的 ref 将 Pixi 实现
        return (
            <div ref={(e) => { this.canvas = e }} />
        );
    }
}