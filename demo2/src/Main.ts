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

        // 开始动画
        this.launchAnimations()
    }

    // 用于记录当前模式, 通过触摸舞台触发模式切换
    private _iAnimMode: number
    private _nScaleBase: number

    private launchAnimations (): void {
        
        this._iAnimMode = AnimModes.ANIM_ROT
        this.stage.addEventListener( egret.TouchEvent.TOUCH_TAP, () => {
            this._iAnimMode = ( this._iAnimMode + 1 ) % 3
        }, this )
        this._nScaleBase = 0

        // 根据当前模式调整旋转度数或缩放正弦基数形成相应动画
        this.addEventListener( egret.Event.ENTER_FRAME, (evt: egret.Event) => {
            switch (this._iAnimMode) {
                case AnimModes.ANIM_ROT: // 旋转
                    this._bird.rotation += Main.STEP_ROT
                    break
                case AnimModes.ANIM_SCALE: // 缩放
                    this._bird.scaleX = this._bird.scaleY =  0.5 + 0.5 * Math.abs(Math.sin( this._nScaleBase += Main.STEP_SCALE ))
                    break
            }
        
        this._txInfo.text =
                    "旋转角度:" + this._bird.rotation 
                +"\n缩放比例:" + this._bird.scaleX.toFixed(2)
                +"\n\n轻触进入" +(["缩放","静止","旋转"][this._iAnimMode])+ "模式"
        
        return false  // 回调返回值表示执行结束是否立即重绘

        }, this )
    }

    /**
     * 创建游戏场景
     * Create a game scene
     */
    private createGameScene() {
   

    }

}

class AnimModes {
    public static ANIM_ROT: number = 0
    public static ANIM_SCALE: number = 1
}