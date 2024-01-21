import type { Line } from "./Line"

export class Point{
    x:number
    y:number
    radius:number = 30
    fillStyle: string | CanvasGradient | CanvasPattern
    textStyle: string | CanvasGradient | CanvasPattern
    name: string = "A"
    ConnectedNode: Point[] = []
    ViaLine: Line[] = []
    start = false
    end = false
    Previous: Point | undefined = undefined
    usedLine: Line | undefined = undefined
    ShortestDistance = 0
    constructor(x: number, y: number,name: string,fillStyle: string | CanvasGradient | CanvasPattern = "red", textStyle: string | CanvasGradient | CanvasPattern = "orange" ){
        this.x = x
        this.y = y
        this.fillStyle = fillStyle
        this.textStyle = textStyle 
        this.name = name
    }
    draw(ctx: CanvasRenderingContext2D){
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI)
        ctx.fillStyle = this.fillStyle
        ctx.fill()
        ctx.beginPath()
        ctx.font = "40px serif";
        ctx.strokeStyle = this.textStyle
        ctx.lineWidth = 2
        ctx.strokeText(this.name, this.x - this.radius * 1/2, this.y + this.radius * 1/2)
        ctx.fill()
    }
}