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
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICESLOSS OF USE, DATA,
//  OR PROFITS OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////

class Main extends egret.DisplayObjectContainer {



    public constructor() {
        super()
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this)
    }

    private onAddToStage( event: egret.Event ) {
        let imgLoader: egret.ImageLoader = new egret.ImageLoader()
        // imgLoader监听egret.Event.COMPLETE 使用once可以免去removeEventListener
        imgLoader.once( egret.Event.COMPLETE, this.imgLoadHandler, this )
        imgLoader.load('resource/assets/duck.png')
    }

    private _txInfo: egret.TextField
    private _bgInfo: egret.Shape

    private imgLoadHandler (evt: egret.Event): void {
        // 图片加载事件返回一个BitmapData对象
        let bmd: egret.BitmapData = evt.currentTarget.data
        let texture = new egret.Texture()
        texture.bitmapData = bmd
        // Bitmap实例化必须传入一个texture对象
        // let bird: egret.Bitmap = new egret.Bitmap( texture )
        // this.addChild( bird )

        let leftBird:egret.Bitmap = new egret.Bitmap( texture )
        leftBird.x = 50
        leftBird.y = this.stage.stageHeight / 2 - leftBird.height / 2
        leftBird.touchEnabled = true
        leftBird.pixelHitTest = true
        this.addChild(leftBird)
        
        let rightBird:egret.Bitmap = new egret.Bitmap( texture )
        rightBird.x = 50 + rightBird.width / 2
        rightBird.y = this.stage.stageHeight / 2 - rightBird.height / 2
        rightBird.touchEnabled = true
        this.addChild(rightBird)

        leftBird.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.setChildIndex(leftBird, this.numChildren - 1)
        }, this )    
        
        rightBird.addEventListener(egret.TouchEvent.TOUCH_TAP, () => {
            this.setChildIndex(rightBird, this.numChildren - 1)
        }, this)

    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
   

    }

}