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
    constructor(Points: Point[], Lines: Line[], width: number = 600, height: number = 600) {
        this.width = width
        this.height = height
        this.Lines = Lines
        this.Points = Points
    }
    static GraphParser(json: GraphJson) {
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
        const JsonGraph: GraphJson = {
            Points: [
                { x: 300, y: 50, name: "A" },
                { x: 300, y: 300, name: "B" },
                { x: 100, y: 300, name: "C" },
                { x: 500, y: 300, name: "D" },
                { x: 300, y: 550, name: "E" },
                { x: 500, y: 50, name: "F" },
            ],
            Lines: [
                { connectionA: "A", connectionB: "B" },
                { connectionA: "B", connectionB: "C" },
                { connectionA: "B", connectionB: "C" },
                { connectionA: "D", connectionB: "A" },
                { connectionA: "B", connectionB: "E" },
                { connectionA: "A", connectionB: "C" },
                { connectionA: "B", connectionB: "D" },
                { connectionA: "E", connectionB: "D" },
                { connectionA: "C", connectionB: "E" },
                { connectionA: "F", connectionB: "A" },
                { connectionA: "D", connectionB: "F" },
            ]
        }
        return this.GraphParser(JsonGraph)
    }
    draw(ctx: CanvasRenderingContext2D) {
        ctx.fillStyle = "transparent";
        ctx.fillRect(0, 0, this.width, this.height)
        this.Points.forEach(element => {
            element.ConnectedNode = []
            element.ViaLine = []
        })
        this.Lines.forEach(element => {
            element.draw(ctx)
            element.connectionA.ConnectedNode.push(element.connectionB)
            element.connectionA.ViaLine.push(element)
            element.connectionB.ConnectedNode.push(element.connectionA)
            element.connectionB.ViaLine.push(element)

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
    algoStart(PointStart: Point, PointEnd: Point) {
        let visitedNode = []
        let unvisitedNode: Point[] = []
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
        while (currentBacktrack != PointStart) {
            if (currentBacktrack.Previous != undefined) {
                currentBacktrack.fillStyle = "green"
                currentBacktrack = currentBacktrack.Previous
                if (currentBacktrack.usedLine != undefined) currentBacktrack.usedLine.fillStyle = "black"
            }
        }
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
        this.Points.push(new Point(x, y, name))
    }
    pushNewLine(connectionA: string | null, connectionB: string | null) {
        const connectA = this.Points.find(value => value.name == connectionA)
        const connectB = this.Points.find(value => value.name == connectionB)
        if ((connectA != undefined) && (connectB != undefined)) {
            this.Lines.push(new Line(connectA, connectB))
        }
    }
}