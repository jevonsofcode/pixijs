/**
 * 刮刮卡
 * 
 * todo: 不完整，一般刮刮卡应该挂某区域后清除蒙层
 */
import React, { Component } from 'react';
import * as PIXI from 'pixi.js';
const afternoon = require("../../../source/afternoon.jpeg");

export default class CacheAsBitmap extends Component {
    app = PIXI.Application;
    canvas = HTMLDivElement;

    componentDidMount() {
        // 创建一个 canvas stage
        this.app = new PIXI.Application({ width: 500, height: 300, transparent: true });
        // 把这个 stage 挂载到元素上
        this.canvas.appendChild(this.app.view);
        
        const { stage } = this.app;

        // 创建一个画笔 🖌
        // 你不仅仅可以画圆，还可以：drawCircle, drawEllipse, drawPolygon, drawRect, drawRoundedRect, drawShape, drawStar 
        // 文档: http://pixijs.download/release/docs/PIXI.Graphics.html
        const brush = new PIXI.Graphics();
        brush.beginFill(0xffffff);
        brush.drawCircle(0, 0, 30);
        brush.endFill();

        this.app.loader.add('t', afternoon);
        this.app.loader.load(setup);

       

        const that = this;

        function setup(loader, resources) {
            // 画一个矩形蒙层加入 stage
            const mask = new PIXI.Graphics();
            mask.beginFill(0x333333);
            mask.drawRect(0, 0, that.app.screen.width, that.app.screen.height);
            mask.endFill();
            stage.addChild(mask);

            // 把图加载进来
            const imageToReveal = new PIXI.Sprite(resources.t.texture);
            stage.addChild(imageToReveal);
            imageToReveal.width = that.app.screen.width;
            imageToReveal.height = that.app.screen.height;

            /**
             * RenderTexture 是一种特殊的纹理，它允许将任何 PixiJS 显示对象呈现给它。
                tip：渲染到 RenderTexture 的所有 DisplayObject（即Sprite）都应预先加载，否则将绘制黑色矩形。
                tip：实际的内存分配将在第一次渲染时发生。您不应该仅在删除每个帧之后创建 renderTextures，而是尝试重用它们。
             * http://pixijs.download/release/docs/PIXI.RenderTexture.html
             */
            const renderTexture = PIXI.RenderTexture.create(that.app.screen.width, that.app.screen.height);
            // 把这个 RenderTexture 创建为一个 Sprite
            const renderTextureSprite = new PIXI.Sprite(renderTexture);
            // 加入 stage
            stage.addChild(renderTextureSprite);

            // 把 RenderTexture 变成图的遮罩
            imageToReveal.mask = renderTextureSprite;

            // interactive 为 true 打开触摸等
            that.app.stage.interactive = true;
            // 在显示对象上按下时触发。DisplayObject 的 interactive 属性必须设置 true 为触发事件，下同
            that.app.stage.on('pointerdown', pointerDown);
            that.app.stage.on('pointerup', pointerUp);
            that.app.stage.on('pointermove', pointerMove);

            let dragging = false;

            function pointerMove(event) {
                if (dragging) {
                    brush.position.copyFrom(event.data.global);
                    /**
                     * render (displayObject, renderTexture, clear, transform, skipUpdateTransform)
                     * http://pixijs.download/release/docs/PIXI.Renderer.html#render
                     */
                    that.app.renderer.render(brush, renderTexture, false, null, false);
                }
            }
            // 按下触发 move 事件
            function pointerDown(event) {
                console.log("===> ", renderTextureSprite)
                dragging = true;
                pointerMove(event);
            }
            // 抬起关闭 move 事件
            function pointerUp(event) {
                dragging = false;
            }
        }

        
    }

    render() {
        // 用 React 的 ref 将 Pixi 实现
        return (
            <div ref={(e) => { this.canvas = e }} />
        );
    }
}