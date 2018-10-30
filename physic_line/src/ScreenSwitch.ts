class ScreenSwitch {

    // 舞台截图需要分割成小截图的总数量 默认40
    private txNumber: number
    // 舞台截图需要分割陈小截图横向数量 默认5
    private XNumber: number
    // 屏幕切换类型 1 -> 卷帘特效 2-> 左右切换移动 3 -> 直接翻 4-> 旋转掉落 5-> 随机一种 
    private switchType: number
    // 当前小截图数量
    private curNumber: number = 0

    public constructor (switchType?: number, txNumber?: number, XNumber?: number) {
        this.switchType = switchType || 5
        this.txNumber = txNumber || 40
        this.XNumber = XNumber || 5
        this.switchScreen()
    }

    private loadTxGrp: eui.Group = new eui.Group()

    private switchScreen (): void {
        // 获取当前舞台大小 用以创建截图Bitmap
        let target = egret.MainContext.instance.stage
        let stageWidth = target.stageWidth
        let stageHeight = target.stageHeight

        this.loadTxGrp.width = stageWidth
        this.loadTxGrp.height = stageHeight
        target.addChild(this.loadTxGrp)

        // 由小截图总数量和横向截图数决定纵向截图数
        let YNumber = this.txNumber / this.XNumber

        for (let i = 0; i < this.txNumber; i++) {
            // 计算每个小截图的xy及宽高
            let _mcW = stageWidth / this.XNumber
            let _mcH = stageHeight / YNumber
            let _mcX = i % this.XNumber * _mcW
            let _mcY = Math.floor(i / this.XNumber) * _mcH

            // 创建截图对象并画到每个小截图区域
            let renderTexture: egret.RenderTexture = new egret.RenderTexture()
            let renderPic = renderTexture.drawToTexture(target, new egret.Rectangle(_mcX, _mcY, _mcW, _mcH))
            let bmp: egret.Bitmap = new egret.Bitmap()
            bmp.texture = renderTexture
            bmp.anchorOffsetX = _mcW / 2
            bmp.anchorOffsetY = _mcH / 2
            bmp.x = _mcX + _mcW / 2
            bmp.y = _mcY + _mcH / 2
            this.loadTxGrp.addChild(bmp)

            if (this.switchType === 5) {
                this.switchType = Math.ceil(Math.random() * 4)
            }

            let tw = egret.Tween.get(bmp)

            // 开始特效
            switch (this.switchType) {

                case 1:        
                    tw.to( { scaleX: 0, scaleY: 0, alpha: 0, rotation: 359 }, 800, egret.Ease.circIn ).call(this.onComplete, this)
                    break
                case 2:
                    let my_x = - stageWidth
                    if (!(i % 2)) {
                        my_x = stageWidth * 2
                    }
                    tw.to( { x: my_x, alpha: 0 }, 800, egret.Ease.circIn ).call(this.onComplete, this)
                    break
                case 3:
                    tw.to({ scaleX: 0.2, scaleY: 1, alpha: 0, blurFliter: 0 }, 800, egret.Ease.backInOut).call(this.onComplete, this)
                    break
                case 4:
                    tw.to({ alpha: 0}, 900, egret.Ease.circIn).call(this.onComplete, this)
                    break
                default:
                    tw.to({ scaleX: 1, scaleY: 0, alpha: 0 }, 800, egret.Ease.circIn).call(this.onComplete, this)

            }
        }

    }

 
    private onComplete (): void {
        this.curNumber++
        if (this.curNumber == this.txNumber) {
            egret.MainContext.instance.stage.removeChild(this.loadTxGrp)
            State.isSwitching = false
        }
    }
}