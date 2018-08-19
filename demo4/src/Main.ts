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

    // 旋转及缩放步长设定
    private static STEP_ROT: number = 3
    private static STEP_SCALE: number = .03

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

    private _bird: egret.Bitmap
    private _txInfo: egret.TextField
    private _shpBeMask: egret.Shape

    private imgLoadHandler (evt: egret.Event): void {
        // 图片加载事件返回一个BitmapData对象
        let bmd: egret.BitmapData = evt.currentTarget.data
        let texture = new egret.Texture()
        texture.bitmapData = bmd
        // Bitmap实例化必须传入一个texture对象
        this._bird = new egret.Bitmap( texture )
        this.addChild( this._bird )

        // 为定位设置基准点（即锚点）
        this._bird.anchorOffsetX = bmd.width / 2
        this._bird.anchorOffsetY = bmd.height / 2
        // 给一个随机位置
        this._bird.x = bmd.width / 2 + (this.stage.stageWidth - bmd.width) * Math.random()
        this._bird.y = bmd.height / 2 + (this.stage.stageHeight - bmd.height) * Math.random()

        // 用以被遮罩的形状
        this._shpBeMask = new egret.Shape()
        this._shpBeMask.graphics.lineStyle( 0x000000 )
        this._shpBeMask.graphics.beginFill ( this.getRdmClr() )
        this._shpBeMask.graphics.drawEllipse(0 , 0, 200, 300)
        this._shpBeMask.graphics.endFill()

        this._shpBeMask.x = ( this.stage.stageWidth - 200 ) / 2
        this._shpBeMask.y = ( this.stage.stageHeight - 300 ) / 2
        this.addChild( this._shpBeMask )

        /// 提示信息
        this._txInfo = new egret.TextField
        this.addChildAt( this._txInfo, 0 )

        this._txInfo.size = 28
        this._txInfo.x = 50
        this._txInfo.y = 50
        this._txInfo.width = this.stage.stageWidth - 100
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT
        this._txInfo.textColor = 0x000000
        this._txInfo.type = egret.TextFieldType.DYNAMIC
        this._txInfo.lineSpacing = 6
        this._txInfo.multiline = true
        this._txInfo.touchEnabled = true
        this._txInfo.text =
            "接触屏幕后白鹭小鸟将变为椭圆形状的遮罩区域，可以移动手指（白鹭小鸟）并观察椭圆在遮罩下的显示变化"

        this.launchMask()

    }

    private launchMask (): void {
        this.stage.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this )
    }

    private updateBird (stageX: number, stageY): void {
        this._bird.x = stageX
        this._bird.y = stageY
    }

    private touchHandler ( evt: egret.TouchEvent ) {
        switch ( evt.type ) {
            case egret.TouchEvent.TOUCH_MOVE:
                this.updateBird( evt.stageX, evt.stageY )
                break
            case egret.TouchEvent.TOUCH_BEGIN:
                this.stage.addEventListener( egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this )
                this.stage.once( egret.TouchEvent.TOUCH_END, this.touchHandler, this )

                this._shpBeMask.mask = this._bird
                this.updateBird( evt.stageX, evt.stageY )
                break
            case egret.TouchEvent.TOUCH_END:
                this.stage.removeEventListener( egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this )
                this.stage.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this )

                this._shpBeMask.mask = null
                this._bird.$maskedObject = null
                break
        }
    }

    private getRdmClr (): number {
        return ( Math.floor( Math.random() * 0xff ) << 16 )
            + ( Math.floor( Math.random() * 0xff ) << 8 )
            + Math.floor( Math.random() * 0xff )
    }


    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
   

    }

}
