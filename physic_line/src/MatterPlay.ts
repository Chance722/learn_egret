class MatterPlay extends egret.DisplayObjectContainer {

    // 当前页面容器
    private playGrp: eui.Group = new eui.Group()
    // 首次触控x坐标
    private _X: number
    // 首次触控y坐标
    private _Y: number
    // 画线坐标集合
    private _linePoints: Array<any> = []
    // 画笔
    private _pen: egret.Shape
    // 重玩按钮
    private refreshBtn


    /////// Matter定义

    // 创建engine
    private engine = Matter.Engine.create(null, null)
    // 创建runner
    private runner = Matter.Runner.create(null)
    // 创建render 
    private render = null
    // 地板刚体
    private _ground = null
    // 挡板刚体
    private _panel = null
    // 小球1刚体
    private _ball1 = null
    // 小球2刚体
    private _ball2 = null

    public constructor () {
        super()
        egret.MainContext.instance.stage.addChildAt(this.playGrp, 0)
        this.initMatter()
        this.createView()
    }

    /**
     * 初始化Matter物理引擎
     */
    private initMatter (): void {
        // 开启睡眠
        this.engine.enableSleeping = true
        // 设置runner以固定帧率计算
        this.runner.isFixed = true
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
        })

        Matter.Runner.run(this.runner, this.engine)
        EgretRender.run(this.render, () => {
            // if (this._ball1) {
            //     console.log(this._ball1.isSleeping)
            // }
        })
    }

    /**
     * 开始创建视图
     */
    private createView (): void {
        this.initBackground()
        this.initBtns()
        this.createGames()
    }

    /**
     * 初始化游戏背景
     */
    private initBackground (): void {
        let playBg: egret.Shape = new egret.Shape()
        playBg.graphics.beginFill(0xf3f1ec)
        playBg.graphics.drawRect(0, 0, egret.MainContext.instance.stage.stageWidth, egret.MainContext.instance.stage.stageHeight)
        playBg.x = 0
        playBg.y = 0
        this.playGrp.addChild(playBg)
    }

    /**
     * 初始化界面按钮
     */
    private initBtns (): void {
        let menuBtn = Helper.createBmpByName('menu_png', 26, 26, 20, 20)
        this.refreshBtn = Helper.createBmpByName('refresh_png', 26, 26, 70, 20)
        this.refreshBtn.touchEnabled = true
        this.playGrp.addChild(menuBtn)
        this.playGrp.addChild(this.refreshBtn)
    }

    /**
     * 创建游戏元素
     */
    private createGames (): void {

        // 创建地板
        this._ground = this.createGround()
        this._ground.label = 'GROUND'
        // 添加挡板
        this._panel = this.createPanel(0x4198cc, 200, 258, 200, 18)
        this._panel.label = 'PANEL'
        // 添加小球1
        this._ball1 = this.createBall(0x017bff, 12, 200, 200)
        this._ball1.label = 'BLUEBALL'
        Matter.Body.setStatic(this._ball1, true)
        // 添加小球2
        this._ball2 = this.createBall(0xf80c0c, 12, 500, egret.MainContext.instance.stage.stageHeight - 12)
        this._ball2.label = 'REDBALL'

        // 绑定屏幕事件
        this.initScreenEvents()
        
    }

    /**
     * 创建地板刚体
     */
    private createGround () {
        let stageHeight = egret.MainContext.instance.stage.stageHeight
        let stageWidth = egret.MainContext.instance.stage.stageWidth

        this._ground = Matter.Bodies.rectangle(stageWidth / 2, stageHeight + 5, stageWidth, 10, { isStatic: true })
        Matter.World.add(this.engine.world, this._ground)
        return this._ground
    }

    /**
     * 创建小球刚体
     */
    private createBall (color: number,  radius: number, x: number, y: number) {
        let circle = Matter.Bodies.circle(x, y, radius, {
            lineWidth: 0,
            fillStyle: color,
            restitution: .5,
            friction: 0,
            frictionAir: 1e-4
        }, null)
        Matter.World.add(this.engine.world, circle)
        return circle
    }

    /**
     * 创建挡板刚体
     */
    private createPanel (color: number, x: number, y: number, width: number, height: number) {
        let rectangle = Matter.Bodies.rectangle(x, y, width, height, {
            lineWidth: 0,
            fillStyle: color,
            isStatic: true
        })
        Matter.World.add(this.engine.world, rectangle)
        return rectangle
    } 

    /**
     * 创建画线刚体
     */
    private createLine () {
        if (this._linePoints.length === 1) {
            let circle = Matter.Bodies.circle(this._linePoints[0] + 2, this._linePoints[1] + 2, 2, {
                lineWidth: 0
            }, null)
            // Matter.World.add(this.engine.world, circle)
        } else {
            let bodyArray = []
            for (let i = 0; i < this._linePoints.length - 1; i++) {
                let beginPos = this._linePoints[i]
                let endPos = this._linePoints[i + 1]
                let angle = Math.atan2(beginPos[1] - endPos[1], beginPos[0] - endPos[0]) + Math.PI / 2   
                let rectangle = Matter.Bodies.rectangle((beginPos[0] + endPos[0]) / 2, (beginPos[1] + endPos[1]) / 2, 3, Math.ceil(this.getDistance(beginPos, endPos)) + 0.5, {
                    fillStyle: 0x555555,
                    lineWidth: 0,
                    angle: angle,
                    friction: 0,
                    frictionStatic: 0,
                    restitution: .5,
                    frictionAir: 0
                })
                bodyArray.push(rectangle)
            }
            let lineBody = Matter.Body.create({
                parts: bodyArray,
                timeScale: 0.8
            })
            lineBody.inverseInertia/=20
            Matter.World.add(this.engine.world, lineBody)
        }
    }


    /**
     * 初始化笔触
     */
    private initPen () {
        this._pen = new egret.Shape()
        this._pen.graphics.lineStyle(3, 0x555555)
        egret.MainContext.instance.stage.addChild(this._pen)
    }

    private initScreenEvents () {
        this.refreshBtn.addEventListener(egret.TouchEvent.TOUCH_TAP, (e) => {
            egret.MainContext.instance.stage.removeChild(this.playGrp)
            this.removeScreenEvents()
            let playView = new MatterPlay()
            e.stopPropagation()
        }, this)
        this.refreshBtn.addEventListener(egret.TouchEvent.TOUCH_MOVE, (e) => {
            e.stopPropagation()
        }, this)
        egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this)
        egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveHandler, this)
        egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this)
        Matter.Events.on(this.engine, 'collisionStart', this.collisionStartHandler)
    }

    private removeScreenEvents () {
        egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN, this.touchBeginHandler, this)
        egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE, this.touchMoveHandler, this)
        egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_END, this.touchEndHandler, this)
        Matter.Events.off(this.engine, 'collisionStart', this.collisionStartHandler)
    }

    private collisionStartHandler (event) {
        let pairs = event.pairs.slice()
        pairs.forEach(item => {
            if (item.bodyA.label === 'BLUEBALL' && item.bodyB.label === 'REDBALL') {
                alert ('大吉大利 今晚吃鸡')
            }
        })
    }

    private touchBeginHandler (evt: egret.TouchEvent): void {
        this.initPen()
        this._X = evt.stageX
        this._Y = evt.stageY
        this._pen.graphics.moveTo(this._X, this._Y)
        // this._pen.graphics.lineTo(this._X, this._Y)
        this._linePoints.push(new Array(evt.stageX, evt.stageY))
    }

    private touchMoveHandler (evt: egret.TouchEvent): void {
        let lastPoint = this._linePoints[this._linePoints.length - 1]
        let curPoint = new Array(evt.stageX, evt.stageY)
        let iscollide = this.isCollideBodies(lastPoint, curPoint)
        if (this.checkIsCanDraw(lastPoint, curPoint, 3) && !iscollide) {
            this._pen.graphics.lineTo(evt.stageX, evt.stageY)
            this._linePoints.push(curPoint)
        }          
    }

    private touchEndHandler (evt: egret.TouchEvent): void {
        if (!State.isSwitching) {
            this._pen.graphics.clear()
            this.createLine()
            if (this._linePoints.length > 1) {
                Matter.Sleeping.set(this._ball1, false)
                Matter.Body.setStatic(this._ball1, false)
            }
            this._linePoints = []
        }
    }

    private isCollideBodies (lastPoint: number[], curPoint: number[]): boolean {
        let bodies = Matter.Composite.allBodies(this.engine.world)
        return !!Matter.Query.ray(bodies, { x: lastPoint[0], y: lastPoint[1] }, { x: curPoint[0], y: curPoint[1] }, 1).length
    }

    private getDistance (lastPoint: number[], curPoint: number[]): number {
        let distance: number = Math.pow((lastPoint[1] - curPoint[1]), 2) + Math.pow((lastPoint[0] - curPoint[0]), 2)
        return Math.sqrt(distance)
    }

    private checkIsCanDraw (lastPoint: number[], curPoint: number[], minLen: number): boolean {
        let distance: number = Math.pow((lastPoint[1] - curPoint[1]), 2) + Math.pow((lastPoint[0] - curPoint[0]), 2)
        return Math.sqrt(distance) >= minLen
    }


}