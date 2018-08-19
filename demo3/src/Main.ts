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
    private _dot: egret.Shape
    private _txInfo: egret.TextField

    private _bShapeTest: boolean
    private _iTouchCollideStatus: number

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
        this._bird.x = this.stage.stageWidth / 2
        this._bird.y = this.stage.stageHeight * 0.618

        // 小圆点，用以提示用户按下的位置
        this._dot = new egret.Shape()
        this._dot.graphics.beginFill( 0x00ff00 )
        this._dot.graphics.drawCircle( 0, 0, 5 )
        this._dot.graphics.endFill()

        // 提示信息
        this._txInfo = new egret.TextField
        this.addChild( this._txInfo )

        this._txInfo.size = 28
        this._txInfo.x = 50
        this._txInfo.y = 50
        this._txInfo.textAlign = egret.HorizontalAlign.LEFT
        this._txInfo.textColor = 0x000000
        this._txInfo.type = egret.TextFieldType.DYNAMIC
        this._txInfo.lineSpacing = 6
        this._txInfo.multiline = true
        this._txInfo.touchEnabled = true

        this._txInfo.addEventListener( egret.TouchEvent.TOUCH_TAP, ( evt: egret.TouchEvent ) => {
            evt.stopImmediatePropagation() // 阻止事件冒泡
            this._bShapeTest = !this._bShapeTest
            this.updateInfo( TouchCollideStatus.NO_TOUCHED )
        }, this )

        this.launchCollisionTest()

    }

    private launchCollisionTest ():void {
        this._iTouchCollideStatus = TouchCollideStatus.NO_TOUCHED
        this._bShapeTest = false
        this.stage.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this )
    }

    private touchHandler (evt: egret.TouchEvent) {
        switch ( evt.type ) {
            case egret.TouchEvent.TOUCH_MOVE:
                this.checkCollision( evt.stageX, evt.stageY )
                break
            case egret.TouchEvent.TOUCH_BEGIN:
                if ( !this._txInfo.hitTestPoint(evt.stageX, evt.stageY)) {
                    this.stage.addEventListener( egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this )
                    this.stage.once( egret.TouchEvent.TOUCH_END, this.touchHandler, this )
                    this.addChild(this._dot)
                    this.checkCollision( evt.stageX, evt.stageY )
                }
                break
            case egret.TouchEvent.TOUCH_END:
                this.stage.removeEventListener( egret.TouchEvent.TOUCH_MOVE, this.touchHandler, this )
                this.stage.addEventListener( egret.TouchEvent.TOUCH_BEGIN, this.touchHandler, this )
                if ( this._dot.parent ) {
                    this._dot.parent.removeChild( this._dot )
                }
                this.updateInfo( TouchCollideStatus.NO_TOUCHED )
                break
        }
    }

    private checkCollision ( stageX: number, stageY: number ): void {
        let bResult: boolean = this._bird.hitTestPoint( stageX, stageY, this._bShapeTest )
        this._dot.x = stageX
        this._dot.y = stageY

         this.updateInfo( bResult ? TouchCollideStatus.COLLIDED : TouchCollideStatus.TOUCHED_NO_COLLIDED )
    } 

    private updateInfo ( iStatus:number ){
        this._txInfo.text =
            "碰撞检测结果：" + ( ["放上手指！","想摸我？", "别摸我！！！"][iStatus] )
            +"\n\n碰撞检测模式：" +( this._bShapeTest ? "非透明像素区域" : "矩形包围盒" )
            +"\n（轻触文字区切换）"
    }



    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
   

    }

}

class TouchCollideStatus {
    public static NO_TOUCHED: number = 0
    public static TOUCHED_NO_COLLIDED: number = 1
    public static COLLIDED: number = 2
}
