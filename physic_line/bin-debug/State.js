var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
/**
 * 数据状态类
 */
var State = (function () {
    function State() {
    }
    State.level = '0';
    State.isSwitching = false;
    return State;
}());
__reflect(State.prototype, "State");
