//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-present, Egret Technology.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {

    /**
     * 加载进度界面
     */
    private loadingView: LoadingUI

    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }

    /**
     * 初始化加载进度界面
     */
    private initLoadingView (): void {
        this.loadingView = new LoadingUI()
        this.stage.addChild(this.loadingView)
    }

    /**
     * 初始化Resource资源加载库
     */
    private initResource (): void {
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this)
        RES.loadConfig("resource/default.res.json", "resource/")
    }

    /**
     * 配置文件加载完成，开始预加载preload资源组
     */
    private onConfigComplete (event: RES.ResourceEvent): void {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this)
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this)
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this)
        RES.loadGroup('preload')
    }

    /**
     * preload资源组加载进度
     */
    private onResourceProgress (event: RES.ResourceEvent): void {
        if (event.groupName === 'preload') {
            this.loadingView.onProgress(event.itemsLoaded, event.itemsTotal)
        }
    }

    /**
     * preload资源组加载完成
     */
    private onResourceLoadComplete (event: RES.ResourceEvent): void {
        if (event.groupName === 'preload') {
            this.stage.removeChild(this.loadingView)
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this)
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this)
            this.createGameScene()
        }
    }

    private onAddToStage(event: egret.Event) {
        
        this.initLoadingView()

        this.initResource()

        egret.lifecycle.addLifecycleListener((context) => {
            // custom lifecycle plugin
            context.onUpdate = () => {

            }
        })

        egret.lifecycle.onPause = () => {
            egret.ticker.pause();
        }

        egret.lifecycle.onResume = () => {
            egret.ticker.resume();
        }

    }

    private _isDebug: boolean = false
    private factor: number = 50
    private world: p2.World = new p2.World()

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene(): void {
  
        // 创建world
        this.world.sleepMode = p2.World.BODY_SLEEPING

        // 创建plane
        let planeShape: p2.Plane = new p2.Plane()
        let planeBody: p2.Body = new p2.Body()
        planeBody.addShape(planeShape)
        planeBody.displays = []
        this.world.addBody(planeBody)

        egret.Ticker.getInstance().register(dt => {
            if (dt < 10) {
                return
            }
            if (dt > 1000) {
                return
            }
            this.world.step(dt / 1000)

            if (!this._isDebug) {
                let stageHeight: number = this.stage.stageHeight
                let l = this.world.bodies.length
                for (let i:number = 0; i < l; i++) {
                    let boxBody: p2.Body = this.world.bodies[i]
                    let box: egret.DisplayObject = boxBody.displays[0]
                    if (box) {
                        box.x = boxBody.position[0] * this.factor
                        box.y = stageHeight - boxBody.position[1] * this.factor
                        box.rotation = 360 - boxBody.angle * 180 / Math.PI
                        if (boxBody.sleepState === p2.Body.SLEEPING) {
                            box.alpha = 0.5
                        } else {
                            box.alpha = 1
                        }
                    }
                }
            }
        }, this)

        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.beforeTouchHandler, this)
        this.initFontText()
    }


    /**
     * 初始化字幕
     */
    private initFontText(): void {

        let bitmapFont: egret.BitmapFont = RES.getRes('font_fnt')
        let bitmapText: egret.BitmapText = new egret.BitmapText()

        bitmapText.text = 'Click!'
        bitmapText.font = bitmapFont
        bitmapText.anchorOffsetX = bitmapText.width / 2
        bitmapText.anchorOffsetY = bitmapText.height / 2
        bitmapText.x = this.stage.stageWidth / 2
        bitmapText.y = this.stage.stageHeight / 2
        this.addChild(bitmapText)
        bitmapText.touchEnabled = true
        bitmapText.addEventListener(egret.TouchEvent.TOUCH_TAP, (event: egret.TouchEvent) => {
            this.removeChild(bitmapText)
        }, this)
    }

    private clickedTime: any = []
    private timeout: any = null

    private beforeTouchHandler(e: egret.TouchEvent): void {
        this.clickedTime.push(new Date())
        if (this.clickedTime.length === 1) {
            this.timeout = setTimeout(() => {
                if (this.clickedTime.length < 2) {
                    this.touchHandler(e)
                    this.clickedTime = []
                }
            }, 300)
        } else if (this.clickedTime.length === 2 && Math.abs(this.clickedTime[1] - this.clickedTime[0]) < 300) {
            clearTimeout(this.timeout)
            this.touchHandler(e, true)
            this.clickedTime = []
        }
    }

    /**
     * 屏幕点击事件
     */
    private touchHandler(e: egret.TouchEvent, isDouble?: boolean):void {

        let positionX: number = Math.floor(e.stageX / this.factor)
        let positionY: number = Math.floor((this.stage.stageHeight - e.stageY) / this.factor)

        let display: egret.DisplayObject
        let boxBody: p2.Body
        if (isDouble) {
            // 添加圆形刚体
            let boxShape: p2.Shape = new p2.Circle({
                radius: 1
            })
            boxBody = new p2.Body({
                mass: 1,
                position: [positionX, positionY]
            })
            boxBody.addShape(boxShape)
            this.world.addBody(boxBody)
            display = this.createBitmapByName('circle')
            display.width = (<p2.Circle>boxShape).radius * 2 * this.factor
            display.height = (<p2.Circle>boxShape).radius * 2 * this.factor
        } else {
            // 添加方形刚体
            let boxShape: p2.Shape = new p2.Box({
                width: 2,
                height: 1
            })
            boxBody = new p2.Body({
                mass: 1,
                position: [positionX, positionY],
                angularVelocity: 1
            })
            boxBody.addShape(boxShape)
            this.world.addBody(boxBody)
            display = this.createBitmapByName('rect')
            display.width = (<p2.Box>boxShape).width * this.factor
            display.height = (<p2.Box>boxShape).height * this.factor
        }

        if (!this._isDebug) {
            display.anchorOffsetX = display.width / 2
            display.anchorOffsetY = display.height / 2
            boxBody.displays = [display]
            this.addChild(display)
        }
    }

    /**
     * 通过名称创建一个Bitmap对象。
     */
    private createBitmapByName(name: string): egret.Bitmap {
        let result: egret.Bitmap = new egret.Bitmap()
        let texture: egret.Texture = RES.getRes(name)
        result.texture = texture
        return result
    }
}