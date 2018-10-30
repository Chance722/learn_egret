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
var MatterPlay = (function (_super) {
    __extends(MatterPlay, _super);
    function MatterPlay() {
        var _this = _super.call(this) || this;
        // 当前页面容器
        _this.playGrp = new eui.Group();
        // 画线坐标集合
        _this._linePoints = [];
        /////// Matter定义
        // 创建engine
        _this.engine = Matter.Engine.create(null, null);
        // 创建runner
        _this.runner = Matter.Runner.create(null);
        // 创建render 
        _this.render = null;
        // 地板刚体
        _this._ground = null;
        // 挡板刚体
        _this._panel = null;
        // 小球1刚体
        _this._ball1 = null;
        // 小球2刚体
        _this._ball2 = null;
        egret.MainContext.instance.stage.addChildAt(_this.playGrp, 0);
        _this.initMatter();
        _this.createView();
        return _this;
    }
    /**
     * 初始化Matter物理引擎
     */
    MatterPlay.prototype.initMatter = function () {
        // 开启睡眠
        this.engine.enableSleeping = true;
        // 设置runner以固定帧率计算
        this.runner.isFixed = true;
        // 使用egret的渲染方法替代matter自己的pixi渲染方法
        this.render = EgretRender.create({
            element: document.body,
            engine: this.engine,
            width: egret.MainContext.instance.stage.stageWidth,
            height: egret.MainContext.instance.stage.stageHeight,
            container: this.playGrp
            // options: {
            //     width: egret.MainContext.instance.stage.stageWidth,
            //     height: egret.MainContext.instance.stage.stageHeight,
            //     container: this.playGrp
            // }
        });
        Matter.Runner.run(this.runner, this.engine);
        EgretRender.run(this.render, function () {
            // if (this._ball1) {
            //     console.log(this._ball1.isSleeping)
            // }
        });
    };
    /**
     * 开始创建视图
     */
    MatterPlay.prototype.createView = function () {
        this.initBackground();
        this.initBtns();
        this.createGames();
    };
    /**
     * 初始化游戏背景
     */
    MatterPlay.prototype.initBackground = function () {
        var playBg = new egret.Shape();
        playBg.graphics.beginFill(0xf3f1ec);
        playBg.graphics.drawRect(0, 0, egret.MainContext.instance.stage.stageWidth, egret.MainContext.instance.stage.stageHeight);
        playBg.x = 0;
        playBg.y = 0;
        this.playGrp.addChild(playBg);
    };
    /**
     * 初始化界面按钮
     */
    MatterPlay.prototype.initBtns = function () {
        var menuBtn = Helper.createBmpByName('menu_png', 26, 26, 20, 20);
        this.refreshBtn = Helper.createBmpByName('refresh_png', 26, 26, 70, 20);
        this.refreshBtn.touchEnabled = true;
        this.playGrp.addChild(menuBtn);
        this.playGrp.addChild(this.refreshBtn);
    };
    /**
     * 创建游戏元素
     */
    MatterPlay.prototype.createGames = function () {
        // 创建地板
        this._ground = this.createGround();
        this._ground.label = 'GROUND';
        // 添加挡板
        this._panel = this.createPanel(0x4198cc, 200, 258, 200, 18);
        this._panel.label = 'PANEL';
        // 添加小球1
        this._ball1 = this.createBall(0x017bff, 12, 200, 200);
        this._ball1.label = 'BLUEBALL';
        Matter.Body.setStatic(this._ball1, true);
        // 添加小球2
        this._ball2 = this.createBall(0xf80c0c, 12, 500, egret.MainContext.instance.stage.stageHeight - 12);
        this._ball2.label = 'REDBALL';
        // 绑定屏幕事件
        this.initScreenEvents();
    };
    /**
     * 创建地板刚体
     */
    MatterPlay.prototype.createGround = function () {
        var stageHeight = egret.MainContext.instance.stage.stageHeight;
        var stageWidth = egret.MainContext.instance.stage.stageWidth;
        this._ground = Matter.Bodies.rectangle(stageWidth / 2, stageHeight + 5, stageWidth, 10, { isStatic: true });
        Matter.World.add(this.engine.world, this._ground);
        return this._ground;
    };
    /**
     * 创建小球刚体
     */
    MatterPlay.prototype.createBall = function (color, radius, x, y) {
        var circle = Matter.Bodies.circle(x, y, radius, {
            lineWidth: 0,
            fillStyle: color,
            restitution: .5,
            friction: 0,
            frictionAir: 1e-4
        }, null);
        Matter.World.add(this.engine.world, circle);
        return circle;
    };
    /**
     * 创建挡板刚体
     */
    MatterPlay.prototype.createPanel = function (color, x, y, width, height) {
        var rectangle = Matter.Bodies.rectangle(x, y, width, height, {
            lineWidth: 0,
            fillStyle: color,
            isStatic: true
        });
        Matter.World.add(this.engine.world, rectangle);
        return rectangle;
    };
    /**
     * 创建画线刚体
     */
    MatterPlay.prototype.createLine = function () {
        if (this._linePoints.length === 1) {
            var circle = Matter.Bodies.circle(this._linePoints[0] + 2, this._linePoints[1] + 2, 2, {
                lineWidth: 0
            }, null);
            // Matter.World.add(this.engine.world, circle)
        }
        else {
            var bodyArray = [];
            for (var i = 0; i < this._linePoints.length - 1; i++) {
                var beginPos = this._linePoints[i];
                var endPos = this._linePoints[i + 1];
                var angle = Math.atan2(beginPos[1] - endPos[1], beginPos[0] - endPos[0]) + Math.PI / 2;
                var rectangle = Matter.Bodies.rectangle((beginPos[0] + endPos[0]) / 2, (beginPos[1] + endPos[1]) / 2, 3, Math.ceil(this.getDistance(beginPos, endPos)) + 0.5, {
                    fillStyle: 0x555555,
                    lineWidth: 0,
                    angle: angle,
                    friction: 0,
                    frictionStatic: 0,
                    restitution: .5,
                    frictionAir: 0
                });
                bodyArray.push(rectangle);
            }
            var lineBody = Matter.Body.create({
                parts: bodyArray,
                timeScale: 0.8
            });
            lineBody.inverseInertia /= 20;
            Matter.World.add(this.engine.world, lineBody);
        }
    };
    /**
     * 初始化笔触
     */
    MatterPlay.prototype.initPen = function () {
        this._pen = new egret.Shape();
        this._pen.graphics.lineStyle(3, 0x555555);
        egret.MainContext.instance.stage.addChild(this._pen);
    };
    MatterPlay.prototype.initScreenEvents = function () {
        var _this = this;
        this.refreshBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, function (e) {
            egret.MainContext.instance.stage.removeChild(_this.playGrp);
            _this.removeScreenEvents();
            var playView = new MatterPlay();
            e.stopPropagation();
        }, this);
        this.refreshBtn.addEventListener(egret.TouchEvent.TOUCH_MOVE, function (e) {
            e.stopPropagation();
        }, this);
        egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
        egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveHandler, this);
        egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this);
        Matter.Events.on(this.engine, 'collisionStart', this.collisionStartHandler);
    };
    MatterPlay.prototype.removeScreenEvents = function () {
        egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
        egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveHandler, this);
        egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this);
        Matter.Events.off(this.engine, 'collisionStart', this.collisionStartHandler);
    };
    MatterPlay.prototype.collisionStartHandler = function (event) {
        var pairs = event.pairs.slice();
        pairs.forEach(function (item) {
            if (item.bodyA.label === 'BLUEBALL' && item.bodyB.label === 'REDBALL') {
                alert('大吉大利 今晚吃鸡');
            }
        });
    };
    MatterPlay.prototype.touchBeginHandler = function (evt) {
        this.initPen();
        this._X = evt.stageX;
        this._Y = evt.stageY;
        this._pen.graphics.moveTo(this._X, this._Y);
        // this._pen.graphics.lineTo(this._X, this._Y)
        this._linePoints.push(new Array(evt.stageX, evt.stageY));
    };
    MatterPlay.prototype.touchMoveHandler = function (evt) {
        var lastPoint = this._linePoints[this._linePoints.length - 1];
        var curPoint = new Array(evt.stageX, evt.stageY);
        var iscollide = this.isCollideBodies(lastPoint, curPoint);
        if (this.checkIsCanDraw(lastPoint, curPoint, 3) && !iscollide) {
            this._pen.graphics.lineTo(evt.stageX, evt.stageY);
            this._linePoints.push(curPoint);
        }
    };
    MatterPlay.prototype.touchEndHandler = function (evt) {
        if (!State.isSwitching) {
            this._pen.graphics.clear();
            this.createLine();
            if (this._linePoints.length > 1) {
                Matter.Sleeping.set(this._ball1, false);
                Matter.Body.setStatic(this._ball1, false);
            }
            this._linePoints = [];
        }
    };
    MatterPlay.prototype.isCollideBodies = function (lastPoint, curPoint) {
        var bodies = Matter.Composite.allBodies(this.engine.world);
        return !!Matter.Query.ray(bodies, { x: lastPoint[0], y: lastPoint[1] }, { x: curPoint[0], y: curPoint[1] }, 1).length;
    };
    MatterPlay.prototype.getDistance = function (lastPoint, curPoint) {
        var distance = Math.pow((lastPoint[1] - curPoint[1]), 2) + Math.pow((lastPoint[0] - curPoint[0]), 2);
        return Math.sqrt(distance);
    };
    MatterPlay.prototype.checkIsCanDraw = function (lastPoint, curPoint, minLen) {
        var distance = Math.pow((lastPoint[1] - curPoint[1]), 2) + Math.pow((lastPoint[0] - curPoint[0]), 2);
        return Math.sqrt(distance) >= minLen;
    };
    return MatterPlay;
}(egret.DisplayObjectContainer));
__reflect(MatterPlay.prototype, "MatterPlay");
