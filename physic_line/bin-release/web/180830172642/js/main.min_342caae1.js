var __reflect=this&&this.__reflect||function(t,e,n){t.__class__=e,n?n.push(e):n=[e],t.__types__=t.__types__?n.concat(t.__types__):n},__extends=this&&this.__extends||function(t,e){function n(){this.constructor=t}for(var i in e)e.hasOwnProperty(i)&&(t[i]=e[i]);n.prototype=e.prototype,t.prototype=new n},__awaiter=this&&this.__awaiter||function(t,e,n,i){return new(n||(n=Promise))(function(r,o){function a(t){try{h(i.next(t))}catch(e){o(e)}}function s(t){try{h(i["throw"](t))}catch(e){o(e)}}function h(t){t.done?r(t.value):new n(function(e){e(t.value)}).then(a,s)}h((i=i.apply(t,e||[])).next())})},__generator=this&&this.__generator||function(t,e){function n(t){return function(e){return i([t,e])}}function i(n){if(r)throw new TypeError("Generator is already executing.");for(;h;)try{if(r=1,o&&(a=o[2&n[0]?"return":n[0]?"throw":"next"])&&!(a=a.call(o,n[1])).done)return a;switch(o=0,a&&(n=[0,a.value]),n[0]){case 0:case 1:a=n;break;case 4:return h.label++,{value:n[1],done:!1};case 5:h.label++,o=n[1],n=[0];continue;case 7:n=h.ops.pop(),h.trys.pop();continue;default:if(a=h.trys,!(a=a.length>0&&a[a.length-1])&&(6===n[0]||2===n[0])){h=0;continue}if(3===n[0]&&(!a||n[1]>a[0]&&n[1]<a[3])){h.label=n[1];break}if(6===n[0]&&h.label<a[1]){h.label=a[1],a=n;break}if(a&&h.label<a[2]){h.label=a[2],h.ops.push(n);break}a[2]&&h.ops.pop(),h.trys.pop();continue}n=e.call(t,h)}catch(i){n=[6,i],o=0}finally{r=a=0}if(5&n[0])throw n[1];return{value:n[0]?n[1]:void 0,done:!0}}var r,o,a,s,h={label:0,sent:function(){if(1&a[0])throw a[1];return a[1]},trys:[],ops:[]};return s={next:n(0),"throw":n(1),"return":n(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s},Main=function(t){function e(){var e=t.call(this)||this;return e.addEventListener(egret.Event.ADDED_TO_STAGE,e.onAddToStage,e),e}return __extends(e,t),e.prototype.playGame=function(){console.log("haha")},e.prototype.initLoadingView=function(){this.loadingView=new LoadingUI,this.stage.addChild(this.loadingView)},e.prototype.initResource=function(){RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this),RES.loadConfig("resource/default.res.json","resource/")},e.prototype.onConfigComplete=function(t){RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE,this.onConfigComplete,this),RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this),RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this),RES.loadGroup("preload")},e.prototype.onResourceProgress=function(t){"preload"===t.groupName&&this.loadingView.onProgress(t.itemsLoaded,t.itemsTotal)},e.prototype.onResourceLoadComplete=function(t){"preload"===t.groupName&&(this.stage.removeChild(this.loadingView),RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE,this.onResourceLoadComplete,this),RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS,this.onResourceProgress,this),this.createGameScene())},e.prototype.onAddToStage=function(t){this.initLoadingView(),this.initResource(),egret.lifecycle.addLifecycleListener(function(t){t.onUpdate=function(){}}),egret.lifecycle.onPause=function(){egret.ticker.pause()},egret.lifecycle.onResume=function(){egret.ticker.resume()}},e.prototype.createGameScene=function(){this.initGameCover()},e.prototype.initGameCover=function(){new GameCover},e}(egret.DisplayObjectContainer);__reflect(Main.prototype,"Main");var GameCover=function(t){function e(){var e=t.call(this)||this;return e.coverGrp=new eui.Group,egret.MainContext.instance.stage.addChild(e.coverGrp),e.init(),e}return __extends(e,t),e.prototype.init=function(){this.initBackground(),this.initTitle(),this.initStartBtn()},e.prototype.initBackground=function(){var t=new egret.Bitmap;t.texture=RES.getRes("cover"),t.width=egret.MainContext.instance.stage.stageWidth,t.height=egret.MainContext.instance.stage.stageHeight,this.coverGrp.addChild(t)},e.prototype.initTitle=function(){var t=RES.getRes("cartoon-font_fnt"),e=new egret.BitmapText;e.text="Physics Line",e.font=t,e.anchorOffsetX=e.width/2,e.anchorOffsetY=e.height/2,e.x=egret.MainContext.instance.stage.stageWidth/2,e.y=egret.MainContext.instance.stage.stageHeight/2,this.coverGrp.addChild(e)},e.prototype.initStartBtn=function(){var t=new egret.TextField;t.stroke=2,t.strokeColor=9026333,t.textColor=16777215,t.text="Play",t.size=24,t.x=3*egret.MainContext.instance.stage.stageWidth/4,t.y=3*egret.MainContext.instance.stage.stageHeight/5,this.coverGrp.addChild(t),egret.Tween.get(t,{loop:!0}).to({alpha:.5},1e3,egret.Ease.sineInOut).to({alpha:1},1e3,egret.Ease.sineInOut),t.touchEnabled=!0,t.addEventListener(egret.TouchEvent.TOUCH_TAP,this.playGame,this)},e.prototype.playGame=function(t){new ScreenSwitch;new GameLevel;egret.MainContext.instance.stage.removeChild(this.coverGrp)},e}(egret.DisplayObjectContainer);__reflect(GameCover.prototype,"GameCover");var GameLevel=function(t){function e(){var e=t.call(this)||this;return e.mainGrp=new eui.Group,e.childGrps=[],e.isTouching=!1,e.touchStartX=0,e.currentGrpIndex=0,e.offsetIndex=0,e.totalGrpNums=3,egret.MainContext.instance.stage.addChildAt(e.mainGrp,0),e.createView(),e.initEvents(),e}return __extends(e,t),e.prototype.createView=function(){this.childGrps=this.addChildrenGroups(this.totalGrpNums);for(var t=0;t<this.childGrps.length;t++)this.initBackground(this.childGrps[t]),this.initLayout(this.childGrps[t]),this.initLevels(this.childGrps[t],t),this.mainGrp.addChild(this.childGrps[t])},e.prototype.initEvents=function(){egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchBeginHandler,this),egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchMoveHandler,this),egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.touchEndHandler,this)},e.prototype.touchBeginHandler=function(t){t.stopPropagation(),this.isTouching=!0,this.touchStartX=t.stageX},e.prototype.touchMoveHandler=function(t){t.stopPropagation();var e=t.stageX;this.mainGrp.x=e-this.touchStartX+this.offsetIndex*egret.MainContext.instance.stage.stageWidth},e.prototype.touchEndHandler=function(t){var e=this;t.stopPropagation(),this.isTouching=!1;var n=t.stageX;Math.abs(n-this.touchStartX)<50&&egret.Tween.get(this.mainGrp).to({x:this.currentGrpIndex*egret.MainContext.instance.stage.stageWidth},500,egret.Ease.sineIn),Math.abs(n-this.touchStartX)>=50&&n>this.touchStartX?this.currentGrpIndex>0?egret.Tween.get(this.mainGrp).to({x:(this.offsetIndex+1)*egret.MainContext.instance.stage.stageWidth},500,egret.Ease.sineIn).call(function(){e.currentGrpIndex--,e.offsetIndex++}):egret.Tween.get(this.mainGrp).to({x:this.currentGrpIndex*egret.MainContext.instance.stage.stageWidth},500,egret.Ease.sineIn):Math.abs(n-this.touchStartX)>=50&&n<this.touchStartX&&(this.currentGrpIndex<this.totalGrpNums-1?egret.Tween.get(this.mainGrp).to({x:(this.offsetIndex-1)*egret.MainContext.instance.stage.stageWidth},500,egret.Ease.sineIn).call(function(){e.currentGrpIndex++,e.offsetIndex--}):(console.log("currentGrpIndex: "+this.currentGrpIndex),egret.Tween.get(this.mainGrp).to({x:-(this.currentGrpIndex*egret.MainContext.instance.stage.stageWidth)},500,egret.Ease.sineIn)))},e.prototype.addChildrenGroups=function(t){for(var e=egret.MainContext.instance.stage.stageWidth,n=egret.MainContext.instance.stage.stageHeight,i=[],r=0;t>r;r++){var o=new eui.Group;o.width=e,o.height=n,o.x=r*e,i.push(o)}return i},e.prototype.initBackground=function(t){var e=new egret.Bitmap;e.texture=RES.getRes("bg_jpg"),e.width=egret.MainContext.instance.stage.stageWidth,e.height=egret.MainContext.instance.stage.stageHeight,t.addChild(e)},e.prototype.initLayout=function(t){var e=new eui.TileLayout;e.horizontalGap=10,e.verticalGap=10,e.columnAlign=eui.ColumnAlign.JUSTIFY_USING_WIDTH,e.rowAlign=eui.RowAlign.JUSTIFY_USING_HEIGHT,e.paddingTop=30,e.paddingLeft=30,e.paddingRight=30,e.paddingBottom=10,e.requestedColumnCount=3,t.layout=e},e.prototype.initLevels=function(t,e){for(var n=this,i=6,r=RES.getRes("cartoon-font_fnt"),o=function(o){var s=new egret.BitmapText;s.font=r;var h=new eui.Rect(186,120,16777215);s.text="Level "+(o+1+e*i),s.anchorOffsetX=s.width/2,s.anchorOffsetY=s.height/2,s.x=h.width/2,s.y=h.height/2,h.addChild(s),t.addChild(h),h.touchEnabled=!0,h.addEventListener(egret.TouchEvent.TOUCH_END,function(t){Math.abs(t.stageX-n.touchStartX)<10&&n.chooseLevel(o+1)},a)},a=this,s=0;i>s;s++)o(s)},e.prototype.chooseLevel=function(t){new ScreenSwitch,State.isSwitching=!0,egret.MainContext.instance.stage.removeChild(this.mainGrp),State.level=t.toString();new MatterPlay},e}(egret.DisplayObjectContainer);__reflect(GameLevel.prototype,"GameLevel");var Helper=function(){function t(){}return t.createBmpByName=function(t,e,n,i,r){var o=new egret.Bitmap;return o.texture=RES.getRes(t),o.width=e,o.height=n,o.x=i,o.y=r,o},t}();__reflect(Helper.prototype,"Helper");var LoadingUI=function(t){function e(){var e=t.call(this)||this;return e.createView(),e}return __extends(e,t),e.prototype.createView=function(){this.textField=new egret.TextField,this.addChild(this.textField),this.textField.width=480,this.textField.height=30,this.textField.size=30,this.textField.anchorOffsetX=this.textField.width/2,this.textField.anchorOffsetY=this.textField.height/2,this.textField.x=egret.MainContext.instance.stage.stageWidth/2,this.textField.y=egret.MainContext.instance.stage.stageHeight/2,this.textField.textAlign="center"},e.prototype.onProgress=function(t,e){this.textField.text="Loading..."+t+"/"+e},e}(egret.Sprite);__reflect(LoadingUI.prototype,"LoadingUI",["RES.PromiseTaskReporter"]);var EgretRender=function(){function t(){}return t.create=function(e){var n={controller:t,engine:null,element:null,canvas:null,mouse:null,frameRequestId:null,options:{width:800,height:600,pixelRatio:1,background:"#fafafa",wireframeBackground:"#222222",hasBounds:!!e.bounds,enabled:!0,wireframes:!0,showSleeping:!0,showDebug:!1,showBroadphase:!1,showBounds:!1,showVelocity:!1,showCollisions:!1,showSeparations:!1,showAxes:!1,showPositions:!1,showAngleIndicator:!1,showIds:!1,showShadows:!1,showVertexNumbers:!1,showConvexHulls:!1,showInternalEdges:!1,showMousePosition:!1}},i=Matter.Common.extend(n,e);return i.mouse=e.mouse,i.engine=e.engine,i.container=i.container||e.container||egret.MainContext.instance.stage,i.bounds=i.bounds||{min:{x:0,y:0},max:{x:i.width,y:i.height}},i},t.run=function(e,n){egret.startTick(function(i){return t.world(e),n&&"function"==typeof n&&n(),!1},t)},t.stop=function(e){egret.stopTick(function(t){return e(),!1},t)},t.world=function(e){var n=e.engine,i=n.world,r=(e.renderer,e.container),o=e.options,a=Matter.Composite.allBodies(i),s=Matter.Composite.allConstraints(i),h=[];o.wireframes;var c=e.bounds.max.x-e.bounds.min.x,l=e.bounds.max.y-e.bounds.min.y,d=c/e.options.width,u=l/e.options.height;if(o.hasBounds){for(var g=0;g<a.length;g++){var p=a[g];p.render.sprite.visible=Matter.Bounds.overlaps(p.bounds,e.bounds)}for(var f=0;f<s.length;f++){var v=s[f],y=v.bodyA,x=v.bodyB,_=v.pointA,w=v.pointB;y&&(_=Matter.Vector.add(y.position,v.pointA,null)),x&&(w=Matter.Vector.add(x.position,v.pointB,null)),_&&w&&(Matter.Bounds.contains(e.bounds,_)||Matter.Bounds.contains(e.bounds,w))&&h.push(v)}r.scaleX=1/d,r.scaleY=1/u,r.x=-e.bounds.min.x*(1/d),r.y=-e.bounds.min.y*(1/u)}else h=s;for(g=0;g<a.length;g++)t.body(e,a[g]);for(g=0;g<h.length;g++)t.constraint(e,h[g])},t.body=function(e,n){var i=(e.engine,n.render);if(i.visible)if(i.sprite&&i.sprite.texture){var r=("b-"+n.id,n.egretSprite),o=e.container;r||(r=n.egretSprite=t._createBodySprite(e,n)),o.contains(r)||o.addChild(r),r.x=n.position.x,r.y=n.position.y,r.rotation=180*n.angle/Math.PI,r.scaleX=i.sprite.xScale||1,r.scaleY=i.sprite.yScale||1}else{var r=("b-"+n.id,n.egretSprite),o=e.container;r||(r=n.egretSprite=t._createBodyPrimitive(e,n),r.initAngle=n.angle),o.contains(r)||o.addChild(r),r.x=n.position.x,r.y=n.position.y,r.rotation=180*(n.angle-r.initAngle)/Math.PI}},t._createBodySprite=function(t,e){var n=e.render,i=n.sprite.texture,r=new egret.Bitmap,o=RES.getRes(i);return r.texture=o,r.anchorOffsetX=e.render.sprite.xOffset,r.anchorOffsetY=e.render.sprite.yOffset,r},t._createBodyPrimitive=function(t,e){var n,i,r,o,a=e.render,s=(t.options,new MatterSprite),h=s.graphics;h.clear();for(var c=e.parts.length>1?1:0;c<e.parts.length;c++){o=e.parts[c],n=o.fillStyle,i=o.strokeStyle||a.strokeStyle,r=o.lineWidth||a.lineWidth;var l=[];if(o.circleRadius)void 0!==n&&h.beginFill(n),h.lineStyle(r,i),h.drawCircle(0,0,o.circleRadius),h.endFill();else{for(var d=0;d<o.vertices.length;d++)l.push([o.vertices[d].x-e.position.x,o.vertices[d].y-e.position.y]);h.lineStyle(r,i),h.moveTo(l[0][0],l[0][1]),void 0!==n&&h.beginFill(n);for(var u=1;u<l.length;u++)h.lineTo(l[u][0],l[u][1]);h.lineTo(l[0][0],l[0][1]),void 0!==n&&h.endFill()}}return s},t.constraint=function(t,e){var n=(t.engine,e.bodyA),i=e.bodyB,r=e.pointA,o=e.pointB,a=t.container,s=e.render,h=("c-"+e.id,e.egretSprite);h||(h=e.egretSprite=new MatterSprite);var c=h.graphics;if(!s.visible||!e.pointA||!e.pointB)return void c.clear();a.contains(h)||a.addChild(h),c.clear();var l,d,u,g;n?(l=n.position.x+r.x,d=n.position.y+r.y):(l=r.x,d=r.y),i?(u=i.position.x+o.x,g=i.position.y+o.y):(u=o.x,g=o.y);var p=65280;c.lineStyle(1,p),c.moveTo(l,d),c.lineTo(u,g),c.endFill()},t}();__reflect(EgretRender.prototype,"EgretRender");var MatterSprite=function(t){function e(){return t.call(this)||this}return __extends(e,t),e}(egret.Sprite);__reflect(MatterSprite.prototype,"MatterSprite");var MatterPlay=function(t){function e(){var e=t.call(this)||this;return e.playGrp=new eui.Group,e._linePoints=[],e.engine=Matter.Engine.create(null,null),e.runner=Matter.Runner.create(null),e.render=null,e._ground=null,e._panel=null,e._ball1=null,e._ball2=null,egret.MainContext.instance.stage.addChildAt(e.playGrp,0),e.initMatter(),e.createView(),e}return __extends(e,t),e.prototype.initMatter=function(){this.engine.enableSleeping=!0,this.runner.isFixed=!0,this.render=EgretRender.create({element:document.body,engine:this.engine,width:egret.MainContext.instance.stage.stageWidth,height:egret.MainContext.instance.stage.stageHeight,container:this.playGrp}),Matter.Runner.run(this.runner,this.engine),EgretRender.run(this.render,function(){})},e.prototype.createView=function(){this.initBackground(),this.initBtns(),this.createGames()},e.prototype.initBackground=function(){var t=new egret.Shape;t.graphics.beginFill(15987180),t.graphics.drawRect(0,0,egret.MainContext.instance.stage.stageWidth,egret.MainContext.instance.stage.stageHeight),t.x=0,t.y=0,this.playGrp.addChild(t)},e.prototype.initBtns=function(){var t=Helper.createBmpByName("menu_png",26,26,20,20);this.refreshBtn=Helper.createBmpByName("refresh_png",26,26,70,20),this.refreshBtn.touchEnabled=!0,this.playGrp.addChild(t),this.playGrp.addChild(this.refreshBtn)},e.prototype.createGames=function(){this._ground=this.createGround(),this._ground.label="GROUND",this._panel=this.createPanel(4298956,200,258,200,18),this._panel.label="PANEL",this._ball1=this.createBall(97279,12,200,200),this._ball1.label="BLUEBALL",Matter.Body.setStatic(this._ball1,!0),this._ball2=this.createBall(16256012,12,500,egret.MainContext.instance.stage.stageHeight-12),this._ball2.label="REDBALL",this.initScreenEvents()},e.prototype.createGround=function(){var t=egret.MainContext.instance.stage.stageHeight,e=egret.MainContext.instance.stage.stageWidth;return this._ground=Matter.Bodies.rectangle(e/2,t+5,e,10,{isStatic:!0}),Matter.World.add(this.engine.world,this._ground),this._ground},e.prototype.createBall=function(t,e,n,i){var r=Matter.Bodies.circle(n,i,e,{lineWidth:0,fillStyle:t,restitution:.5,friction:0,frictionAir:1e-4},null);return Matter.World.add(this.engine.world,r),r},e.prototype.createPanel=function(t,e,n,i,r){var o=Matter.Bodies.rectangle(e,n,i,r,{lineWidth:0,fillStyle:t,isStatic:!0});return Matter.World.add(this.engine.world,o),o},e.prototype.createLine=function(){if(1===this._linePoints.length){Matter.Bodies.circle(this._linePoints[0]+2,this._linePoints[1]+2,2,{lineWidth:0},null)}else{for(var t=[],e=0;e<this._linePoints.length-1;e++){var n=this._linePoints[e],i=this._linePoints[e+1],r=Math.atan2(n[1]-i[1],n[0]-i[0])+Math.PI/2,o=Matter.Bodies.rectangle((n[0]+i[0])/2,(n[1]+i[1])/2,3,Math.ceil(this.getDistance(n,i))+.5,{fillStyle:5592405,lineWidth:0,angle:r,friction:0,frictionStatic:0,restitution:.5,frictionAir:0});t.push(o)}var a=Matter.Body.create({parts:t,timeScale:.8});a.inverseInertia/=20,Matter.World.add(this.engine.world,a)}},e.prototype.initPen=function(){this._pen=new egret.Shape,this._pen.graphics.lineStyle(3,5592405),egret.MainContext.instance.stage.addChild(this._pen)},e.prototype.initScreenEvents=function(){var t=this;this.refreshBtn.addEventListener(egret.TouchEvent.TOUCH_TAP,function(n){egret.MainContext.instance.stage.removeChild(t.playGrp),t.removeScreenEvents();new e;n.stopPropagation()},this),this.refreshBtn.addEventListener(egret.TouchEvent.TOUCH_MOVE,function(t){t.stopPropagation()},this),egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchBeginHandler,this),egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchMoveHandler,this),egret.MainContext.instance.stage.addEventListener(egret.TouchEvent.TOUCH_END,this.touchEndHandler,this),Matter.Events.on(this.engine,"collisionEnd",this.collisionStartHandler)},e.prototype.removeScreenEvents=function(){egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_BEGIN,this.touchBeginHandler,this),egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_MOVE,this.touchMoveHandler,this),egret.MainContext.instance.stage.removeEventListener(egret.TouchEvent.TOUCH_END,this.touchEndHandler,this),Matter.Events.off(this.engine,"collisionEnd",this.collisionStartHandler)},e.prototype.collisionStartHandler=function(t){var e=t.pairs.slice();e.forEach(function(t){"BLUEBALL"===t.bodyA.label&&"REDBALL"===t.bodyB.label&&alert("大吉大利 今晚吃鸡")})},e.prototype.touchBeginHandler=function(t){this.initPen(),this._X=t.stageX,this._Y=t.stageY,this._pen.graphics.moveTo(this._X,this._Y),this._linePoints.push(new Array(t.stageX,t.stageY))},e.prototype.touchMoveHandler=function(t){var e=this._linePoints[this._linePoints.length-1],n=new Array(t.stageX,t.stageY),i=this.isCollideBodies(e,n);this.checkIsCanDraw(e,n,3)&&!i&&(this._pen.graphics.lineTo(t.stageX,t.stageY),this._linePoints.push(n))},e.prototype.touchEndHandler=function(t){State.isSwitching||(this._pen.graphics.clear(),this.createLine(),this._linePoints.length>1&&(Matter.Sleeping.set(this._ball1,!1),Matter.Body.setStatic(this._ball1,!1)),this._linePoints=[])},e.prototype.isCollideBodies=function(t,e){var n=Matter.Composite.allBodies(this.engine.world);return!!Matter.Query.ray(n,{x:t[0],y:t[1]},{x:e[0],y:e[1]},1).length},e.prototype.getDistance=function(t,e){var n=Math.pow(t[1]-e[1],2)+Math.pow(t[0]-e[0],2);return Math.sqrt(n)},e.prototype.checkIsCanDraw=function(t,e,n){var i=Math.pow(t[1]-e[1],2)+Math.pow(t[0]-e[0],2);return Math.sqrt(i)>=n},e}(egret.DisplayObjectContainer);__reflect(MatterPlay.prototype,"MatterPlay");var DebugPlatform=function(){function t(){}return t.prototype.getUserInfo=function(){return __awaiter(this,void 0,void 0,function(){return __generator(this,function(t){return[2,{nickName:"username"}]})})},t.prototype.login=function(){return __awaiter(this,void 0,void 0,function(){return __generator(this,function(t){return[2]})})},t}();__reflect(DebugPlatform.prototype,"DebugPlatform",["Platform"]),window.platform||(window.platform=new DebugPlatform);var ScreenSwitch=function(){function t(t,e,n){this.curNumber=0,this.loadTxGrp=new eui.Group,this.switchType=t||5,this.txNumber=e||40,this.XNumber=n||5,this.switchScreen()}return t.prototype.switchScreen=function(){var t=egret.MainContext.instance.stage,e=t.stageWidth,n=t.stageHeight;this.loadTxGrp.width=e,this.loadTxGrp.height=n,t.addChild(this.loadTxGrp);for(var i=this.txNumber/this.XNumber,r=0;r<this.txNumber;r++){var o=e/this.XNumber,a=n/i,s=r%this.XNumber*o,h=Math.floor(r/this.XNumber)*a,c=new egret.RenderTexture,l=(c.drawToTexture(t,new egret.Rectangle(s,h,o,a)),new egret.Bitmap);l.texture=c,l.anchorOffsetX=o/2,l.anchorOffsetY=a/2,l.x=s+o/2,l.y=h+a/2,this.loadTxGrp.addChild(l),5===this.switchType&&(this.switchType=Math.ceil(4*Math.random()));var d=egret.Tween.get(l);switch(this.switchType){case 1:d.to({scaleX:0,scaleY:0,alpha:0,rotation:359},800,egret.Ease.circIn).call(this.onComplete,this);break;case 2:var u=-e;r%2||(u=2*e),d.to({x:u,alpha:0},800,egret.Ease.circIn).call(this.onComplete,this);break;case 3:d.to({scaleX:.2,scaleY:1,alpha:0,blurFliter:0},800,egret.Ease.backInOut).call(this.onComplete,this);break;case 4:d.to({alpha:0},900,egret.Ease.circIn).call(this.onComplete,this);break;default:d.to({scaleX:1,scaleY:0,alpha:0},800,egret.Ease.circIn).call(this.onComplete,this)}}},t.prototype.onComplete=function(){this.curNumber++,this.curNumber==this.txNumber&&(egret.MainContext.instance.stage.removeChild(this.loadTxGrp),State.isSwitching=!1)},t}();__reflect(ScreenSwitch.prototype,"ScreenSwitch");var State=function(){function t(){}return t.level="0",t.isSwitching=!1,t}();__reflect(State.prototype,"State");