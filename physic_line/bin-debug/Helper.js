var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var Helper = (function () {
    function Helper() {
    }
    Helper.createBmpByName = function (name, w, h, x, y) {
        var bitmap = new egret.Bitmap();
        bitmap.texture = RES.getRes(name);
        bitmap.width = w;
        bitmap.height = h;
        bitmap.x = x;
        bitmap.y = y;
        return bitmap;
    };
    return Helper;
}());
__reflect(Helper.prototype, "Helper");
