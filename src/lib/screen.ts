import { defaultSave } from "./Default"
import { Line } from "./Line"
import { Point } from "./Points"
import { UserClickPOS } from "./stores"

interface PointJson {
    x: number
    y: number
    name: string
}
interface LineJson {
    connectionA: string
    connectionB: string
}
type GraphJson = {
    Points: PointJson[]
    Lines: LineJson[]
}
export class Graph {
    width: number
    height: number
    Points: Point[]
    Lines: Line[]
    constructor(Points: Point[], Lines: Line[], width: number = 600, height: number = 800) {
        this.width = width
        this.height = height
        this.Lines = Lines
        this.Points = Points
    }
    GraphConverter() {
        let out: GraphJson = {Points: [], Lines: []}
        this.Points.forEach((v) => {
            out.Points.push({x: v.x, y: v.y, name: v.name})
        })
        this.Lines.forEach((v) => {
            out.Lines.push({connectionA: v.connectionA.name, connectionB: v.connectionB.name})
        })
        return JSON.stringify(out)
    }
    static GraphParser(json: GraphJson): Graph {
        let realPoints: Point[] = []
        json.Points.forEach(element => {
            realPoints.push(new Point(element.x, element.y, element.name))
        });
        let realLines: Line[] = []
        json.Lines.forEach(element => {
            let connectionA = realPoints.find(value => value.name == element.connectionA)
            let connectionB = realPoints.find(value => value.name == element.connectionB)
            if (connectionA != undefined && connectionB != undefined) {
                realLines.push(new Line(connectionA, connectionB))
            }
        })
        return new Graph(realPoints, realLines)
    }
    static default() {
        // return this.GraphParser(JsonGraph)
        console.log(defaultSave)
        return this.GraphParser(defaultSave)
    }
    draw(ctx: CanvasRenderingContext2D) {
        // ctx.fillStyle = "transparent";
        // ctx.fillRect(0, 0, this.width, this.height)
        this.pasteImage(ctx)
        this.Lines.forEach(element => {
            element.draw(ctx)
        });
        this.Points.forEach(element => {
            element.draw(ctx)
        });
    }
    setGraph(Points: Point[], Lines: Line[]) {
        this.Lines = Lines
        this.Points = Points
    }
    update(ctx: CanvasRenderingContext2D) {
        this.draw(ctx)
        requestAnimationFrame(() => this.update(ctx))
    }
    resettingPointsANDLines(){
        this.Points.forEach(element => {
            element.ConnectedNode = []
            element.ViaLine = []
        })
        this.Lines.forEach(element => {
            element.connectionA.ConnectedNode.push(element.connectionB)
            element.connectionA.ViaLine.push(element)
            element.connectionB.ConnectedNode.push(element.connectionA)
            element.connectionB.ViaLine.push(element)
        });
    }
    algoStartAStar(PointStart: Point, PointEnd: Point) {
        let visitedNode = []
        let unvisitedNode: Point[] = []
        this.resettingPointsANDLines()
        unvisitedNode = this.Points
        // reseting value
        unvisitedNode.forEach((e) => {
            e.start = false
            e.end = false
            e.Previous = undefined
            if (e.name == PointStart.name) {
                e.ShortestDistance = 0
                e.CombinedHeristic = Math.floor(Math.sqrt((e.y - PointEnd.y) + (e.x - PointEnd.x))) // Pythagoras √(Δy + Δx)
            } else {
                e.ShortestDistance = Infinity
                e.CombinedHeristic = Infinity
            }
        })
        PointStart.start = true
        PointEnd.end = true
        PointStart.ConnectedNode.forEach((node, index) => {
            node.ShortestDistance = PointStart.ViaLine[index].weight
            node.CombinedHeristic = PointStart.ViaLine[index].weight + Math.floor(Math.sqrt((node.y - PointEnd.y) + (node.x - PointEnd.x)))
            node.Previous = PointStart
            node.usedLine = PointStart.ViaLine[index]
        })
        unvisitedNode = unvisitedNode.filter((value) => PointStart.name != value.name)
        console.log(unvisitedNode)

        // created 3 list unvisted, visited and DistanceTable
        // starting the Calculation Progress
        let currentLength = unvisitedNode.length
        for (let index = 0; index < currentLength; index++) {
            const ShortestMap = unvisitedNode.map((value) => value.CombinedHeristic)
            const ShortestNode = unvisitedNode.find((e) => e.CombinedHeristic == Math.min(...ShortestMap))
            // shortestNode
            ShortestNode?.ConnectedNode.forEach((element, index) => {
                const Line = ShortestNode.ViaLine[index]
                if ((element.ShortestDistance > (element.ShortestDistance + Line.weight)) || (element.ShortestDistance == Infinity)) {
                    if (element.ShortestDistance == Infinity) {
                        element.ShortestDistance = Line.weight
                        element.CombinedHeristic = Line.weight + Math.floor(Math.sqrt((element.y - PointEnd.y) + (element.x - PointEnd.x)))
                    } else {
                        element.ShortestDistance += Line.weight
                        element.CombinedHeristic = element.ShortestDistance + Math.floor(Math.sqrt((element.y - PointEnd.y) + (element.x - PointEnd.x)))
                    }
                    element.Previous = ShortestNode
                }
            });
            console.log(ShortestNode)
            unvisitedNode = unvisitedNode.filter(value => value.name != ShortestNode?.name)
            visitedNode.push(ShortestNode)
        }
        console.log("ending")
        console.table(unvisitedNode)
        console.table(visitedNode)
        console.log("ending")
        let currentBacktrack: Point = PointEnd
        // let backtrackList: Point[] = [PointEnd]
        while (currentBacktrack != PointStart) {
            if (currentBacktrack.Previous != undefined) {
                currentBacktrack.fillStyle = "green"
                // backtrackList.push(currentBacktrack)
                if (currentBacktrack.usedLine != undefined) currentBacktrack.usedLine.fillStyle = "black"
                currentBacktrack = currentBacktrack.Previous
            }
        }
        // console.log(backtrackList)
        PointStart.fillStyle = "red"
        PointEnd.fillStyle = "orange"
    }
    algoStartDijstras(PointStart: Point, PointEnd: Point) {
        let visitedNode = []
        let unvisitedNode: Point[] = []
        this.resettingPointsANDLines()
        unvisitedNode = this.Points
        unvisitedNode.forEach((e) => {
            e.start = false
            e.end = false
            e.Previous = undefined
            if (e.name == PointStart.name) {
                e.ShortestDistance = 0
            } else {
                e.ShortestDistance = Infinity
            }
        })
        PointStart.start = true
        PointEnd.end = true
        PointStart.ConnectedNode.forEach((node, index) => {
            node.ShortestDistance = PointStart.ViaLine[index].weight
            node.Previous = PointStart
            node.usedLine = PointStart.ViaLine[index]
        })
        unvisitedNode = unvisitedNode.filter((value) => PointStart.name != value.name)

        // created 3 list unvisted, visited and DistanceTable
        // starting the Calculation Progress
        let currentLength = unvisitedNode.length
        for (let index = 0; index < currentLength; index++) {
            const ShortestMap = unvisitedNode.map((value) => value.ShortestDistance)
            const ShortestNode = unvisitedNode.find((e) => e.ShortestDistance == Math.min(...ShortestMap))
            ShortestNode?.ConnectedNode.forEach((element, index) => {
                const Line = ShortestNode.ViaLine[index]
                if ((element.ShortestDistance > (element.ShortestDistance + Line.weight)) || (element.ShortestDistance == Infinity)) {
                    if (element.ShortestDistance == Infinity) {
                        element.ShortestDistance = Line.weight
                    } else {
                        element.ShortestDistance += Line.weight
                    }
                    element.Previous = ShortestNode
                }
            });
            unvisitedNode = unvisitedNode.filter(value => value.name != ShortestNode?.name)
            visitedNode.push(ShortestNode)
        }
        console.log("ending")
        console.table(unvisitedNode)
        console.table(visitedNode)
        console.log("ending")
        let currentBacktrack: Point = PointEnd
        let backtrackList: Point[] = [PointEnd]
        while (currentBacktrack != PointStart) {
            if (currentBacktrack.Previous != undefined) {
                currentBacktrack.fillStyle = "green"
                backtrackList.push(currentBacktrack)
                if (currentBacktrack.usedLine != undefined) currentBacktrack.usedLine.fillStyle = "black"
                currentBacktrack = currentBacktrack.Previous
            }
        }
        console.log(backtrackList)
        PointStart.fillStyle = "red"
        PointEnd.fillStyle = "orange"
    }
    screenDownListener(e: MouseEvent) {
        const target = e.target
        //@ts-ignore
        const rect = target.getBoundingClientRect()
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        UserClickPOS.set({ x: x, y: y })
    }
    pushNewPoint(x: number, y: number, name: string) {
        if(this.Points.findIndex(e => e.name == name) == -1){
            this.Points.push(new Point(x, y, name))
        }
    }
    pushNewLine(connectionA: string | null, connectionB: string | null) {
        const connectA = this.Points.find(value => value.name == connectionA)
        const connectB = this.Points.find(value => value.name == connectionB)
        if ((connectA != undefined) && (connectB != undefined)) {
            this.Lines.push(new Line(connectA, connectB))
        }
    }
    popPoint(name: string | null){
        this.Points = this.Points.filter(e => e.name != name)
    }
    pasteImage(ctx: CanvasRenderingContext2D){
        const img = new Image()
        img.src = "https://static.vecteezy.com/system/resources/previews/020/919/370/original/united-kingdom-country-map-design-free-vector.jpg"
        ctx.drawImage(img, 0, 0, this.width, this.height)
    }
    reset() {
    }
}