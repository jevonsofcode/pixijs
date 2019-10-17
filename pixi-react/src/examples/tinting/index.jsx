/**
 * 着色
 */
import React, { Component } from 'react';
import * as PIXI from 'pixi.js';
const reactLogo = require("../../source/react.png")

export default class Tinting extends Component {
    app = PIXI.Application;
    canvas = HTMLDivElement;
    reacts = [];
    numberOfReacts = 20;

    componentDidMount() {
        // 创建一个 canvas stage
        this.app = new PIXI.Application({ width: 500, height: 500, transparent: true });
        // 把这个 stage 挂载到元素上
        this.canvas.appendChild(this.app.view);

        for(let i = 0; i < this.numberOfReacts; i++) {
            const png = PIXI.Sprite.from(reactLogo);
            // 设置锚点居中
            png.anchor.set(0.5);
            // 设置一个随机大小
            png.scale.set(0.8 + Math.random() * 0.3);
            // 给这个 Sprite 设置一个随机的位置
            png.x = Math.random() * this.app.screen.width;
            png.y = Math.random() * this.app.screen.height;
            // 给 Sprite 随机的颜色
            png.tint = Math.random() * 0xFFFFFF >> 7;

            // 给 Sprite 一个随机的旋转角度
            png.direction = Math.random() * Math.PI * 2;
            // 设置旋转速率
            png.turningSpeed = Math.random() - 0.8;
            // 设置移动速度
            png.speed = 2 + Math.random() * 2;
            // 好了我们现在把这个 Sprite 加入数组
            this.reacts.push(png);
            // 放进 stage
            this.app.stage.addChild(png);
        }

        const boxPadding = 100;
        // 现在想象一个平面坐标轴 Rectangle 从 (0, 0) 开始，(0, 0) 点对应的 stage 的左上角
        const reactBoundsBox = new PIXI.Rectangle(
            -boxPadding, // x 左上角的 x 坐标值
            -boxPadding, // y 左上角的 y 坐标值
            this.app.screen.width + boxPadding * 2, // width 矩形的宽
            this.app.screen.height + boxPadding * 2 // heigth 矩形的高
        );

        this.app.ticker.add(() => {
            // 遍历我们创建的 Sprite 并更新他们的位置
            for (let i = 0; i < this.reacts.length; i++) {
                const reactElement = this.reacts[i];
                // 上面我们给他们设置了不同的旋转速率
                reactElement.direction += reactElement.turningSpeed * 0.1;
                reactElement.x += Math.sin(reactElement.direction) * reactElement.speed;
                reactElement.y += Math.cos(reactElement.direction) * reactElement.speed;
                reactElement.rotation = -reactElement.direction - Math.PI / 2;

                // 如果 Sprite 超出 Box 的最左边
                if (reactElement.x < reactBoundsBox.x) {
                    reactElement.x += reactBoundsBox.width;
                } else 
                // 如果 Sprite 超出 Box 的最右边
                if (reactElement.x > reactBoundsBox.x + reactBoundsBox.width) {
                    reactElement.x -= reactBoundsBox.width;
                }

                // 与上同理，不让元素出 reactBoundsBox y轴
                if (reactElement.y < reactBoundsBox.y) {
                    reactElement.y += reactBoundsBox.height;
                } else if (reactElement.y > reactBoundsBox.y + reactBoundsBox.height) {
                    reactElement.y -= reactBoundsBox.height;
                }
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