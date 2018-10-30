/**
 * 游戏封面
 */
class GameCover extends egret.DisplayObjectContainer {

    private coverGrp: eui.Group = new eui.Group()

    public constructor () {
        super()
        egret.MainContext.instance.stage.addChild(this.coverGrp)
        this.init()
    }

    public init (): void {
        this.initBackground()
        this.initTitle()
        this.initStartBtn()
    }

    /**
     * 初始化游戏背景
     */
    private initBackground (): void {
        let bg: egret.Bitmap = new egret.Bitmap()
        // base64 加载texture
        // let img = new Image()
        // img.src = 'base64码'
        // img.onload = () => {
        //     let texture: egret.Texture = new egret.Texture()
        //     let bitmapdata: egret.BitmapData = new egret.BitmapData(img)
        //     texture.bitmapData = bitmapdata
        //     bg.texture = texture
        // }
        bg.texture = RES.getRes('cover')
        
        bg.width = egret.MainContext.instance.stage.stageWidth
        bg.height = egret.MainContext.instance.stage.stageHeight
        this.coverGrp.addChild(bg)
    }

    /**
     * 初始化游戏标题
     */
    private initTitle (): void {
        let font: egret.BitmapFont = RES.getRes('cartoon-font_fnt')
        let title: egret.BitmapText = new egret.BitmapText()
        title.text = 'Physics Line'
        title.font = font
        title.anchorOffsetX = title.width / 2
        title.anchorOffsetY = title.height / 2
        title.x = egret.MainContext.instance.stage.stageWidth / 2
        title.y = egret.MainContext.instance.stage.stageHeight / 2
        this.coverGrp.addChild(title)
    }

    /**
     * 初始化play按钮
     */
    private initStartBtn (): void {
        let btnText: egret.TextField = new egret.TextField()
        btnText.stroke = 2
        btnText.strokeColor = 0x89BB1D
        btnText.textColor = 0xffffff
        btnText.text = 'Play'
        btnText.size = 24
        btnText.x = egret.MainContext.instance.stage.stageWidth * 3 / 4
        btnText.y = egret.MainContext.instance.stage.stageHeight * 3 / 5
        this.coverGrp.addChild(btnText)
        egret.Tween.get(btnText, { loop: true }).to( { alpha: .5 }, 1000, egret.Ease.sineInOut )
            .to( { alpha: 1}, 1000, egret.Ease.sineInOut )
        
        // 需先将文本设置为可点击
        btnText.touchEnabled = true
        btnText.addEventListener(egret.TouchEvent.TOUCH_TAP, this.playGame, this)
    }

    private playGame (evt: egret.TouchEvent): void {
        // 调用场景切换 并移除当前容器 添加新容器
        new ScreenSwitch()
        let levelView = new GameLevel()
        egret.MainContext.instance.stage.removeChild(this.coverGrp)
    }
}