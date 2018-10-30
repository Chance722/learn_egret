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
var GameLevel = (function (_super) {
    __extends(GameLevel, _super);
    function GameLevel() {
        var _this = _super.call(this) || this;
        _this.mainGrp = new eui.Group();
        _this.childGrps = [];
        _this.isTouching = false;
        _this.touchStartX = 0;
        _this.currentGrpIndex = 0;
        _this.offsetIndex = 0;
        _this.totalGrpNums = 3;
        // 设置层级 避免覆盖上一容器做的动画过渡
        // egret.MainContext.instance.stage.addChildAt(this.levelGrp, 0)
        egret.MainContext.instance.stage.addChildAt(_this.mainGrp, 0);
        _this.createView();
        _this.initEvents();
        return _this;
    }
    GameLevel.prototype.createView = function () {
        this.childGrps = this.addChildrenGroups(this.totalGrpNums);
        for (var i = 0; i < this.childGrps.length; i++) {
            this.initBackground(this.childGrps[i]);
            this.initLayout(this.childGrps[i]);
            this.initLevels(this.childGrps[i], i);
            this.mainGrp.addChild(this.childGrps[i]);
        }
    };
    GameLevel.prototype.initEvents = function () {
        // this.mainGrp.x = -300
        egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this);
        egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveHandler, this);
        egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this);
    };
    GameLevel.prototype.touchBeginHandler = function (evt) {
        evt.stopPropagation();
        this.isTouching = true;
        this.touchStartX = evt.stageX;
    };
    GameLevel.prototype.touchMoveHandler = function (evt) {
        evt.stopPropagation();
        var x = evt.stageX;
        this.mainGrp.x = x - this.touchStartX + this.offsetIndex * egret.MainContext.instance.stage.stageWidth;
    };
    GameLevel.prototype.touchEndHandler = function (evt) {
        var _this = this;
        evt.stopPropagation();
        this.isTouching = false;
        var x = evt.stageX;
        if (Math.abs(x - this.touchStartX) < 50) {
            egret.Tween.get(this.mainGrp).to({ x: this.currentGrpIndex * egret.MainContext.instance.stage.stageWidth }, 500, egret.Ease.sineIn);
        }
        if (Math.abs(x - this.touchStartX) >= 50 && x > this.touchStartX) {
            // 向右滑动
            if (this.currentGrpIndex > 0) {
                egret.Tween.get(this.mainGrp).to({ x: (this.offsetIndex + 1) * egret.MainContext.instance.stage.stageWidth }, 500, egret.Ease.sineIn)
                    .call(function () {
                    _this.currentGrpIndex--;
                    _this.offsetIndex++;
                });
            }
            else {
                egret.Tween.get(this.mainGrp).to({ x: this.currentGrpIndex * egret.MainContext.instance.stage.stageWidth }, 500, egret.Ease.sineIn);
            }
        }
        else if (Math.abs(x - this.touchStartX) >= 50 && x < this.touchStartX) {
            // 向左滑动
            if (this.currentGrpIndex < this.totalGrpNums - 1) {
                egret.Tween.get(this.mainGrp).to({ x: (this.offsetIndex - 1) * egret.MainContext.instance.stage.stageWidth }, 500, egret.Ease.sineIn)
                    .call(function () {
                    _this.currentGrpIndex++;
                    _this.offsetIndex--;
                });
            }
            else {
                console.log('currentGrpIndex: ' + this.currentGrpIndex);
                egret.Tween.get(this.mainGrp).to({ x: -(this.currentGrpIndex * egret.MainContext.instance.stage.stageWidth) }, 500, egret.Ease.sineIn);
            }
        }
    };
    GameLevel.prototype.addChildrenGroups = function (length) {
        var stageWidth = egret.MainContext.instance.stage.stageWidth;
        var stageHeight = egret.MainContext.instance.stage.stageHeight;
        var childGroups = [];
        for (var i = 0; i < length; i++) {
            var childGrp = new eui.Group();
            childGrp.width = stageWidth;
            childGrp.height = stageHeight;
            childGrp.x = i * stageWidth;
            childGroups.push(childGrp);
        }
        return childGroups;
    };
    /**
     * 初始化关卡背景
     */
    GameLevel.prototype.initBackground = function (group) {
        var bg = new egret.Bitmap();
        bg.texture = RES.getRes('bg_jpg');
        bg.width = egret.MainContext.instance.stage.stageWidth;
        bg.height = egret.MainContext.instance.stage.stageHeight;
        group.addChild(bg);
    };
    /**
     * 初始化网格布局 layout只能被赋值给一个对象 不能复用
     */
    GameLevel.prototype.initLayout = function (group) {
        var tLayout = new eui.TileLayout();
        tLayout.horizontalGap = 10;
        tLayout.verticalGap = 10;
        tLayout.columnAlign = eui.ColumnAlign.JUSTIFY_USING_WIDTH;
        tLayout.rowAlign = eui.RowAlign.JUSTIFY_USING_HEIGHT;
        tLayout.paddingTop = 30;
        tLayout.paddingLeft = 30;
        tLayout.paddingRight = 30;
        tLayout.paddingBottom = 10;
        tLayout.requestedColumnCount = 3;
        group.layout = tLayout;
    };
    /**
     * 初始化关卡
     */
    GameLevel.prototype.initLevels = function (group, index) {
        var _this = this;
        // 每一个子页面的level数
        var levelLength = 6;
        var btnFont = RES.getRes('cartoon-font_fnt');
        var _loop_1 = function (i) {
            var btnText = new egret.BitmapText();
            btnText.font = btnFont;
            var btn = new eui.Rect(186, 120, 0xffffff);
            btnText.text = 'Level ' + ((i + 1) + index * levelLength);
            btnText.anchorOffsetX = btnText.width / 2;
            btnText.anchorOffsetY = btnText.height / 2;
            btnText.x = btn.width / 2;
            btnText.y = btn.height / 2;
            btn.addChild(btnText);
            group.addChild(btn);
            btn.touchEnabled = true;
            btn.addEventListener(egret.TouchEvent.TOUCH_END, function (evt) {
                if (Math.abs(evt.stageX - _this.touchStartX) < 10) {
                    _this.chooseLevel(i + 1);
                }
            }, this_1);
        };
        var this_1 = this;
        for (var i = 0; i < levelLength; i++) {
            _loop_1(i);
        }
    };
    /**
     * 选择关卡
     */
    GameLevel.prototype.chooseLevel = function (level) {
        new ScreenSwitch();
        State.isSwitching = true;
        // egret.MainContext.instance.stage.removeChild(this.levelGrp)
        egret.MainContext.instance.stage.removeChild(this.mainGrp);
        State.level = level.toString();
        // let playView = new Play()
        var playView = new MatterPlay();
    };
    return GameLevel;
}(egret.DisplayObjectContainer));
__reflect(GameLevel.prototype, "GameLevel");
