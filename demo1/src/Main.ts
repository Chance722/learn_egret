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



    public constructor() {
        super();
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
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
        let bird: egret.Bitmap = new egret.Bitmap( texture )
        this.addChild( bird )

        // 为定位设置基准点（即锚点）
        bird.anchorOffsetX = bmd.width / 2
        bird.anchorOffsetY = bmd.height / 2
        bird.x = this.stage.stageWidth / 2
        bird.y = this.stage.stageHeight / 2

        // 提示信息
        this._txInfo = new egret.TextField
        this.addChild( this._txInfo )

        this._txInfo.size = 28
        this._txInfo.x = 50
        this._txInfo.y = 50
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT
        this._txInfo.textColor = 0xffffff
        this._txInfo.type = egret.TextFieldType.DYNAMIC
        this._txInfo.lineSpacing = 6
        this._txInfo.multiline = true
        this._txInfo.text = '轻触屏幕调整显示对象位置'

        this._bgInfo = new egret.Shape()
        this.addChildAt( this._bgInfo, this.numChildren - 1 )

        this._bgInfo.x = this._txInfo.x
        this._bgInfo.y = this._txInfo.y
        this._bgInfo.graphics.clear()
        this._bgInfo.graphics.beginFill( 0x00adee, .5 )
        this._bgInfo.graphics.drawRect( 0, 0, this._txInfo.width, this._txInfo.height)
        this._bgInfo.graphics.endFill()

        this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP, (e: egret.TouchEvent) => {
            bird.x = e.stageX
            bird.y = e.stageY
        }, this)
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
   

    }

}