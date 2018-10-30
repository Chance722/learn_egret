var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var ScreenSwitch = (function () {
    function ScreenSwitch(switchType, txNumber, XNumber) {
        // 当前小截图数量
        this.curNumber = 0;
        this.loadTxGrp = new eui.Group();
        this.switchType = switchType || 5;
        this.txNumber = txNumber || 40;
        this.XNumber = XNumber || 5;
        this.switchScreen();
    }
    ScreenSwitch.prototype.switchScreen = function () {
        // 获取当前舞台大小 用以创建截图Bitmap
        var target = egret.MainContext.instance.stage;
        var stageWidth = target.stageWidth;
        var stageHeight = target.stageHeight;
        this.loadTxGrp.width = stageWidth;
        this.loadTxGrp.height = stageHeight;
        target.addChild(this.loadTxGrp);
        // 由小截图总数量和横向截图数决定纵向截图数
        var YNumber = this.txNumber / this.XNumber;
        for (var i = 0; i < this.txNumber; i++) {
            // 计算每个小截图的xy及宽高
            var _mcW = stageWidth / this.XNumber;
            var _mcH = stageHeight / YNumber;
            var _mcX = i % this.XNumber * _mcW;
            var _mcY = Math.floor(i / this.XNumber) * _mcH;
            // 创建截图对象并画到每个小截图区域
            var renderTexture = new egret.RenderTexture();
            var renderPic = renderTexture.drawToTexture(target, new egret.Rectangle(_mcX, _mcY, _mcW, _mcH));
            var bmp = new egret.Bitmap();
            bmp.texture = renderTexture;
            bmp.anchorOffsetX = _mcW / 2;
            bmp.anchorOffsetY = _mcH / 2;
            bmp.x = _mcX + _mcW / 2;
            bmp.y = _mcY + _mcH / 2;
            this.loadTxGrp.addChild(bmp);
            if (this.switchType === 5) {
                this.switchType = Math.ceil(Math.random() * 4);
            }
            var tw = egret.Tween.get(bmp);
            // 开始特效
            switch (this.switchType) {
                case 1:
                    tw.to({ scaleX: 0, scaleY: 0, alpha: 0, rotation: 359 }, 800, egret.Ease.circIn).call(this.onComplete, this);
                    break;
                case 2:
                    var my_x = -stageWidth;
                    if (!(i % 2)) {
                        my_x = stageWidth * 2;
                    }
                    tw.to({ x: my_x, alpha: 0 }, 800, egret.Ease.circIn).call(this.onComplete, this);
                    break;
                case 3:
                    tw.to({ scaleX: 0.2, scaleY: 1, alpha: 0, blurFliter: 0 }, 800, egret.Ease.backInOut).call(this.onComplete, this);
                    break;
                case 4:
                    tw.to({ alpha: 0 }, 900, egret.Ease.circIn).call(this.onComplete, this);
                    break;
                default:
                    tw.to({ scaleX: 1, scaleY: 0, alpha: 0 }, 800, egret.Ease.circIn).call(this.onComplete, this);
            }
        }
    };
    ScreenSwitch.prototype.onComplete = function () {
        this.curNumber++;
        if (this.curNumber == this.txNumber) {
            egret.MainContext.instance.stage.removeChild(this.loadTxGrp);
            State.isSwitching = false;
        }
    };
    return ScreenSwitch;
}());
__reflect(ScreenSwitch.prototype, "ScreenSwitch");
