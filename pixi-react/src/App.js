import React, { Component } from 'react';
import * as PIXI from 'pixi.js';

export default class PixiApp extends Component {
    app = PIXI.Application;
    canvas = HTMLDivElement;
    circle = PIXI.Graphics;

    componentDidMount() {
        // 创建一个 100 * 100 透明的 canvas 画布
        this.app = new PIXI.Application({ width: 100, height: 100, transparent: true });

        // ！React 这里的图片要用 require 引进来
        const png = PIXI.Sprite.from(require("./react.png"));

        // 图片锚点挂载在中间
        png.anchor.set(.5);

        // 图片在画布的中间显示
        png.x = this.app.screen.width / 2;
        png.y = this.app.screen.height / 2;

        // 把图片放 app 这个画布里 （pixi 称之为 stage（舞台））
        this.app.stage.addChild(png);

        // 让图片转起来
        this.app.ticker.add(() => {
            png.rotation += -1;
        });

        this.canvas.appendChild(this.app.view);
        this.app.start();
    }

    render() {
        // 用 React 的 ref 将 Pixi 实现
        return (
            <div ref={(e) => { this.canvas = e }} />
        );
    }
}