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
/**
 * 游戏封面
 */
var GameCover = (function (_super) {
    __extends(GameCover, _super);
    function GameCover() {
        var _this = _super.call(this) || this;
        _this.coverGrp = new eui.Group();
        egret.MainContext.instance.stage.addChild(_this.coverGrp);
        _this.init();
        return _this;
    }
    GameCover.prototype.init = function () {
        this.initBackground();
        this.initTitle();
        this.initStartBtn();
    };
    /**
     * 初始化游戏背景
     */
    GameCover.prototype.initBackground = function () {
        var bg = new egret.Bitmap();
        // base64 加载texture
        // let img = new Image()
        // img.src = 'base64码'
        // img.onload = () => {
        //     let texture: egret.Texture = new egret.Texture()
        //     let bitmapdata: egret.BitmapData = new egret.BitmapData(img)
        //     texture.bitmapData = bitmapdata
        //     bg.texture = texture
        // }
        bg.texture = RES.getRes('cover');
        bg.width = egret.MainContext.instance.stage.stageWidth;
        bg.height = egret.MainContext.instance.stage.stageHeight;
        this.coverGrp.addChild(bg);
    };
    /**
     * 初始化游戏标题
     */
    GameCover.prototype.initTitle = function () {
        var font = RES.getRes('cartoon-font_fnt');
        var title = new egret.BitmapText();
        title.text = 'Physics Line';
        title.font = font;
        title.anchorOffsetX = title.width / 2;
        title.anchorOffsetY = title.height / 2;
        title.x = egret.MainContext.instance.stage.stageWidth / 2;
        title.y = egret.MainContext.instance.stage.stageHeight / 2;
        this.coverGrp.addChild(title);
    };
    /**
     * 初始化play按钮
     */
    GameCover.prototype.initStartBtn = function () {
        var btnText = new egret.TextField();
        btnText.stroke = 2;
        btnText.strokeColor = 0x89BB1D;
        btnText.textColor = 0xffffff;
        btnText.text = 'Play';
        btnText.size = 24;
        btnText.x = egret.MainContext.instance.stage.stageWidth * 3 / 4;
        btnText.y = egret.MainContext.instance.stage.stageHeight * 3 / 5;
        this.coverGrp.addChild(btnText);
        egret.Tween.get(btnText, { loop: true }).to({ alpha: .5 }, 1000, egret.Ease.sineInOut)
            .to({ alpha: 1 }, 1000, egret.Ease.sineInOut);
        // 需先将文本设置为可点击
        btnText.touchEnabled = true;
        btnText.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playGame, this);
    };
    GameCover.prototype.playGame = function (evt) {
        // 调用场景切换 并移除当前容器 添加新容器
        new ScreenSwitch();
        var levelView = new GameLevel();
        egret.MainContext.instance.stage.removeChild(this.coverGrp);
    };
    return GameCover;
}(egret.DisplayObjectContainer));
__reflect(GameCover.prototype, "GameCover");
