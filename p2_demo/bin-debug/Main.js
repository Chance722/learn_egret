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
var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var Main = (function (_super) {
    __extends(Main, _super);
    function Main() {
        var _this = _super.call(this) || this;
        _this._isDebug = false;
        _this.factor = 50;
        _this.world = new p2.World();
        _this.clickedTime = [];
        _this.timeout = null;
        _this.addEventListener(egret.Event.ADDED_TO_STAGE, _this.onAddToStage, _this);
        return _this;
    }
    /**
     * 初始化加载进度界面
     */
    Main.prototype.initLoadingView = function () {
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
    };
    /**
     * 初始化Resource资源加载库
     */
    Main.prototype.initResource = function () {
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成，开始预加载preload资源组
     */
    Main.prototype.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.loadGroup('preload');
    };
    /**
     * preload资源组加载进度
     */
    Main.prototype.onResourceProgress = function (event) {
        if (event.groupName === 'preload') {
            this.loadingView.onProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /**
     * preload资源组加载完成
     */
    Main.prototype.onResourceLoadComplete = function (event) {
        if (event.groupName === 'preload') {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            this.createGameScene();
        }
    };
    Main.prototype.onAddToStage = function (event) {
        this.initLoadingView();
        this.initResource();
        egret.lifecycle.addLifecycleListener(function (context) {
            // custom lifecycle plugin
            context.onUpdate = function () {
            };
        });
        egret.lifecycle.onPause = function () {
            egret.ticker.pause();
        };
        egret.lifecycle.onResume = function () {
            egret.ticker.resume();
        };
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    Main.prototype.createGameScene = function () {
        var _this = this;
        // 创建world
        this.world.sleepMode = p2.World.BODY_SLEEPING;
        // 创建plane
        var planeShape = new p2.Plane();
        var planeBody = new p2.Body();
        planeBody.addShape(planeShape);
        planeBody.displays = [];
        this.world.addBody(planeBody);
        egret.Ticker.getInstance().register(function (dt) {
            if (dt < 10) {
                return;
            }
            if (dt > 1000) {
                return;
            }
            _this.world.step(dt / 1000);
            if (!_this._isDebug) {
                var stageHeight = _this.stage.stageHeight;
                var l = _this.world.bodies.length;
                for (var i = 0; i < l; i++) {
                    var boxBody = _this.world.bodies[i];
                    var box = boxBody.displays[0];
                    if (box) {
                        box.x = boxBody.position[0] * _this.factor;
                        box.y = stageHeight - boxBody.position[1] * _this.factor;
                        box.rotation = 360 - boxBody.angle * 180 / Math.PI;
                        if (boxBody.sleepState === p2.Body.SLEEPING) {
                            box.alpha = 0.5;
                        }
                        else {
                            box.alpha = 1;
                        }
                    }
                }
            }
        }, this);
        this.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.beforeTouchHandler, this);
        this.initFontText();
    };
    /**
     * 初始化字幕
     */
    Main.prototype.initFontText = function () {
        var _this = this;
        var bitmapFont = RES.getRes('font_fnt');
        var bitmapText = new egret.BitmapText();
        bitmapText.text = 'Click!';
        bitmapText.font = bitmapFont;
        bitmapText.anchorOffsetX = bitmapText.width / 2;
        bitmapText.anchorOffsetY = bitmapText.height / 2;
        bitmapText.x = this.stage.stageWidth / 2;
        bitmapText.y = this.stage.stageHeight / 2;
        this.addChild(bitmapText);
        bitmapText.touchEnabled = true;
        bitmapText.addEventListener(egret.TouchEvent.TOUCH_TAP, function (event) {
            _this.removeChild(bitmapText);
        }, this);
    };
    Main.prototype.beforeTouchHandler = function (e) {
        var _this = this;
        this.clickedTime.push(new Date());
        if (this.clickedTime.length === 1) {
            this.timeout = setTimeout(function () {
                if (_this.clickedTime.length < 2) {
                    _this.touchHandler(e);
                    _this.clickedTime = [];
                }
            }, 300);
        }
        else if (this.clickedTime.length === 2 && Math.abs(this.clickedTime[1] - this.clickedTime[0]) < 300) {
            clearTimeout(this.timeout);
            this.touchHandler(e, true);
            this.clickedTime = [];
        }
    };
    /**
     * 屏幕点击事件
     */
    Main.prototype.touchHandler = function (e, isDouble) {
        var positionX = Math.floor(e.stageX / this.factor);
        var positionY = Math.floor((this.stage.stageHeight - e.stageY) / this.factor);
        var display;
        var boxBody;
        if (isDouble) {
            // 添加圆形刚体
            var boxShape = new p2.Circle({
                radius: 1
            });
            boxBody = new p2.Body({
                mass: 1,
                position: [positionX, positionY]
            });
            boxBody.addShape(boxShape);
            this.world.addBody(boxBody);
            display = this.createBitmapByName('circle');
            display.width = boxShape.radius * 2 * this.factor;
            display.height = boxShape.radius * 2 * this.factor;
        }
        else {
            // 添加方形刚体
            var boxShape = new p2.Box({
                width: 2,
                height: 1
            });
            boxBody = new p2.Body({
                mass: 1,
                position: [positionX, positionY],
                angularVelocity: 1
            });
            boxBody.addShape(boxShape);
            this.world.addBody(boxBody);
            display = this.createBitmapByName('rect');
            display.width = boxShape.width * this.factor;
            display.height = boxShape.height * this.factor;
        }
        if (!this._isDebug) {
            display.anchorOffsetX = display.width / 2;
            display.anchorOffsetY = display.height / 2;
            boxBody.displays = [display];
            this.addChild(display);
        }
    };
    /**
     * 通过名称创建一个Bitmap对象。
     */
    Main.prototype.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    return Main;
}(egret.DisplayObjectContainer));
__reflect(Main.prototype, "Main");
