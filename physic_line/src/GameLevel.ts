class GameLevel extends egret.DisplayObjectContainer {

    private mainGrp: eui.Group = new eui.Group()
    private childGrps: eui.Group[] = []
    private isTouching: boolean = false
    private touchStartX: number = 0
    private currentGrpIndex: number = 0
    private offsetIndex: number = 0
    private totalGrpNums: number = 3

    public constructor () {
        super()
        // 设置层级 避免覆盖上一容器做的动画过渡
        // egret.MainContext.instance.stage.addChildAt(this.levelGrp, 0)
        egret.MainContext.instance.stage.addChildAt(this.mainGrp, 0)
        this.createView()
        this.initEvents()
    }

    private createView (): void {
        this.childGrps =  this.addChildrenGroups(this.totalGrpNums)
        for (let i = 0; i< this.childGrps.length; i++) {
            this.initBackground(this.childGrps[i])
            this.initLayout(this.childGrps[i])
            this.initLevels(this.childGrps[i], i)
            this.mainGrp.addChild(this.childGrps[i])
        }
    }

    private initEvents (): void {
        // this.mainGrp.x = -300
        egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this)
        egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveHandler, this)
        egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this)
    }

    private touchBeginHandler (evt: egret.TouchEvent): void {
        evt.stopPropagation()
        this.isTouching = true
        this.touchStartX = evt.stageX
    }

    private touchMoveHandler (evt: egret.TouchEvent): void {
        evt.stopPropagation()
        let x: number = evt.stageX
        this.mainGrp.x = x - this.touchStartX + this.offsetIndex * egret.MainContext.instance.stage.stageWidth 
    }

    private touchEndHandler (evt: egret.TouchEvent): void {
        evt.stopPropagation()
        this.isTouching = false
        let x: number = evt.stageX
        if (Math.abs(x - this.touchStartX) < 50) {
            egret.Tween.get( this.mainGrp ).to({ x: this.currentGrpIndex * egret.MainContext.instance.stage.stageWidth }, 500, egret.Ease.sineIn)
        }

        if (Math.abs(x - this.touchStartX) >= 50 && x > this.touchStartX) {
            // 向右滑动
            if (this.currentGrpIndex > 0) {
                egret.Tween.get( this.mainGrp).to({ x: (this.offsetIndex + 1) * egret.MainContext.instance.stage.stageWidth }, 500, egret.Ease.sineIn)
                    .call(() => {
                        this.currentGrpIndex--
                        this.offsetIndex++
                    })    
            } else {
                egret.Tween.get( this.mainGrp ).to({ x: this.currentGrpIndex * egret.MainContext.instance.stage.stageWidth  }, 500, egret.Ease.sineIn)
            }

        } else if (Math.abs(x - this.touchStartX) >= 50 && x < this.touchStartX) {
            // 向左滑动
            if (this.currentGrpIndex < this.totalGrpNums - 1) {
                egret.Tween.get( this.mainGrp ).to({ x: (this.offsetIndex - 1) * egret.MainContext.instance.stage.stageWidth}, 500, egret.Ease.sineIn)
                    .call(() => {
                        this.currentGrpIndex++
                        this.offsetIndex--
                    })  
            } else {
                console.log('currentGrpIndex: ' + this.currentGrpIndex)
                egret.Tween.get( this.mainGrp ).to({ x: -(this.currentGrpIndex * egret.MainContext.instance.stage.stageWidth) }, 500, egret.Ease.sineIn)
            }
        }
    }

    private addChildrenGroups (length: number): eui.Group[] {
        let stageWidth = egret.MainContext.instance.stage.stageWidth
        let stageHeight = egret.MainContext.instance.stage.stageHeight
        let childGroups:eui.Group[] = []
        for (let i = 0; i < length; i++) {
            let childGrp: eui.Group = new eui.Group()
            childGrp.width = stageWidth
            childGrp.height = stageHeight
            childGrp.x = i * stageWidth
            childGroups.push(childGrp)
        }
        return childGroups
    }

    /**
     * 初始化关卡背景 
     */
    private initBackground (group: eui.Group): void {
        let bg: egret.Bitmap = new egret.Bitmap()
        bg.texture = RES.getRes('bg_jpg')
        bg.width = egret.MainContext.instance.stage.stageWidth
        bg.height = egret.MainContext.instance.stage.stageHeight
        group.addChild(bg)
    }

    /**
     * 初始化网格布局 layout只能被赋值给一个对象 不能复用
     */
    private initLayout (group: eui.Group): void {
        let tLayout: eui.TileLayout = new eui.TileLayout()
        tLayout.horizontalGap = 10
        tLayout.verticalGap = 10
        tLayout.columnAlign = eui.ColumnAlign.JUSTIFY_USING_WIDTH
        tLayout.rowAlign = eui.RowAlign.JUSTIFY_USING_HEIGHT
        tLayout.paddingTop = 30
        tLayout.paddingLeft = 30
        tLayout.paddingRight = 30
        tLayout.paddingBottom = 10
        tLayout.requestedColumnCount = 3
        
        group.layout = tLayout
    }

    /**
     * 初始化关卡
     */
    private initLevels (group: eui.Group, index: number): void {
        // 每一个子页面的level数
        let levelLength = 6     
        let btnFont: egret.BitmapFont = RES.getRes('cartoon-font_fnt')
        
        for (let i = 0; i < levelLength; i++) {
            let btnText: egret.BitmapText = new egret.BitmapText()
            btnText.font = btnFont
            let btn: eui.Rect = new eui.Rect(186, 120, 0xffffff)
            btnText.text = 'Level ' + ((i + 1) + index * levelLength)
            btnText.anchorOffsetX = btnText.width / 2
            btnText.anchorOffsetY = btnText.height / 2
            btnText.x = btn.width / 2
            btnText.y = btn.height / 2
            btn.addChild(btnText)

            group.addChild(btn)

            btn.touchEnabled = true
            btn.addEventListener(egret.TouchEvent.TOUCH_END, (evt) => {
                if (Math.abs(evt.stageX - this.touchStartX) < 10) {
                    this.chooseLevel(i+1)
                }
            }, this)
        }

    }

    /**
     * 选择关卡
     */
    private chooseLevel (level: number): void {
        new ScreenSwitch()
        State.isSwitching = true
        // egret.MainContext.instance.stage.removeChild(this.levelGrp)
        egret.MainContext.instance.stage.removeChild(this.mainGrp)
        State.level = level.toString()
        // let playView = new Play()
        let playView = new MatterPlay()
    }
}