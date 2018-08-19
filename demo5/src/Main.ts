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
        
        /*** 以下代码使用shape和graphics区分四个区域 ***/
        let upLeft = new egret.Shape()
        upLeft.graphics.beginFill(0xf7acbc)
        upLeft.graphics.drawRect(0, 0, this.stage.stageWidth/2, this.stage.stageHeight/2)
        upLeft.graphics.endFill()
        upLeft.touchEnabled = true
        upLeft.x = 0
        upLeft.y = 0
        this.addChild(upLeft)
        
        let upRight = new egret.Shape()
        upRight.graphics.beginFill(0xdeab8a)
        upRight.graphics.drawRect(0, 0, this.stage.stageWidth/2, this.stage.stageHeight/2)
        upRight.graphics.endFill()
        upRight.touchEnabled = true
        upRight.x = this.stage.stageWidth/2
        upRight.y = 0       
        this.addChild(upRight)
        
        let downLeft = new egret.Shape()
        downLeft.graphics.beginFill(0xef5b9c)
        downLeft.graphics.drawRect(0, 0, this.stage.stageWidth/2, this.stage.stageHeight/2)
        downLeft.graphics.endFill()
        downLeft.touchEnabled = true
        downLeft.x = 0
        downLeft.y = this.stage.stageHeight/2         
        this.addChild(downLeft)
        
        let downRight = new egret.Shape()
        downRight.graphics.beginFill(0xfedcbd)
        downRight.graphics.drawRect(0, 0, this.stage.stageWidth/2, this.stage.stageHeight/2)
        downRight.graphics.endFill()
        downRight.touchEnabled = true
        downRight.x = this.stage.stageWidth/2
        downRight.y = this.stage.stageHeight/2   
        this.addChild(downRight)

        /*** 先初始化四个白鹭小鸟 ***/
        let upLeftBird:egret.Bitmap = new egret.Bitmap( texture )
        upLeftBird.x = upLeft.x + upLeft.width/2 - upLeftBird.width/2
        upLeftBird.y = upLeft.y + upLeft.height/2 - upLeftBird.height/2
        
        let upRightBird:egret.Bitmap = new egret.Bitmap( texture )
        upRightBird.x = upRight.x + upRight.width/2 - upRightBird.width/2
        upRightBird.y = upRight.y + upRight.height/2 - upRightBird.height/2
        
        let downLeftBird:egret.Bitmap = new egret.Bitmap( texture )
        downLeftBird.x = downLeft.x + downLeft.width/2 - downLeftBird.width/2
        downLeftBird.y = downLeft.y + downLeft.height/2 - downLeftBird.height/2
        
        let downRightBird:egret.Bitmap = new egret.Bitmap( texture )
        downRightBird.x = downRight.x + downRight.width/2 - downRightBird.width/2
        downRightBird.y = downRight.y + downRight.height/2 - downRightBird.height/2

        upLeft.addEventListener( egret.TouchEvent.TOUCH_TAP, ()=>{
            if(this.contains(upLeftBird)){
                this.removeChild(upLeftBird);
            }else{
                this.addChild(upLeftBird);
            }
        }, this )

    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
   

    }

}