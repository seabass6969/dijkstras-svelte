import type { Point } from "./Points"

function midPoint(A: number, B: number): number{
    if(A > B){
        return ((A - B) / 2) + B
    }else if(B > A){
        return ((B - A) / 2) + A
    }else if(A == B){
        return A
    }else{
        return A
    }
}
export class Line{
    weight: number
    connectionA: Point
    connectionB: Point
    fillStyle: string | CanvasGradient | CanvasPattern
    textStyle: string | CanvasGradient | CanvasPattern
    lineWidth = 10
    drawingScale = 10
    constructor(connectionA: Point, connectionB: Point,weight:number = 0,  fillStyle: string | CanvasGradient | CanvasPattern = "purple", textStyle: string | CanvasGradient | CanvasPattern = "lime" ){
        if(weight === 0){
            this.weight = Math.floor(Math.sqrt((connectionA.x - connectionB.x)**2 + (connectionA.y - connectionB.y)**2)) / this.drawingScale
        }else{
            this.weight = weight
        }
        this.connectionA = connectionA
        this.connectionB = connectionB
        this.fillStyle = fillStyle
        this.textStyle = textStyle
    }
    draw(ctx: CanvasRenderingContext2D){
        ctx.beginPath()
        ctx.strokeStyle = this.fillStyle
        ctx.lineWidth = this.lineWidth
        ctx.moveTo(this.connectionA.x, this.connectionA.y)
        ctx.lineTo(this.connectionB.x, this.connectionB.y)
        ctx.stroke(); 

        ctx.beginPath()
        ctx.font = "40px serif";
        ctx.strokeStyle = this.textStyle
        ctx.lineWidth = 2
        ctx.strokeText(String(this.weight), midPoint(this.connectionA.x, this.connectionB.x), midPoint(this.connectionA.y, this.connectionB.y))
        ctx.fill()
    }
}