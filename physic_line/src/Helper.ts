class Helper {

    public static createBmpByName (name: string, w: number, h: number, x: number, y: number): egret.Bitmap {
        let bitmap: egret.Bitmap = new egret.Bitmap()
        bitmap.texture = RES.getRes(name)
        bitmap.width = w
        bitmap.height = h
        bitmap.x = x
        bitmap.y = y
        
        return bitmap
    }

}