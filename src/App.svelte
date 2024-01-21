<script lang="ts">
	import { onMount } from "svelte";
	import { Graph } from "./lib/screen";
	import { Point } from "./lib/Points";
	import { Line } from "./lib/Line";
	import { UserClickPOS } from "./lib/stores";
	let canvas: HTMLCanvasElement;
	const PointA = new Point(300, 50, "A");
	const PointB = new Point(300, 300, "B");
	const PointC = new Point(100, 300, "C");
	const PointD = new Point(500, 300, "D");
	const PointE = new Point(300, 550, "E");
	const PointF = new Point(500, 50, "F");
	const LineA = new Line(PointA, PointB);
	const LineB = new Line(PointB, PointC);
	const LineC = new Line(PointD, PointA);
	const LineE = new Line(PointB, PointE);
	const LineF = new Line(PointA, PointC);
	const LineG = new Line(PointB, PointD);
	const LineH = new Line(PointE, PointD);
	const LineI = new Line(PointC, PointE);
	const LineJ = new Line(PointF, PointA);
	const LineK = new Line(PointD, PointF);
	const screen = new Graph(
		[PointA, PointB, PointC, PointD, PointE, PointF],
		[LineA, LineB, LineC, LineE, LineF, LineG, LineH, LineI, LineJ, LineK],
	);

	onMount(() => {
		const ctx = canvas.getContext("2d");
		if (ctx != null) {
			screen.draw(ctx);
			// console.log(screen);
			screen.update(ctx);
		}
	});
	let status = "";
	let newPointDisable = false;
	UserClickPOS.subscribe((value) => {
		if (newPointDisable == true) {
			screen.pushNewPoint(
				value.x,
				value.y,
				String(prompt("Enter name: ")),
			);
			newPointDisable = false;
			status = "Done";
		}
	});
	const newPoint = () => {
		status = "Now click anywhere in the graph";
		newPointDisable = true;
	};
	const newLine = () => {
		let connectA = prompt("Tell me the first connection");
		let connectB = prompt("Tell me the second connection");
		screen.pushNewLine(connectA, connectB);
	};
	const runAlgo = () => {
		let connectionA = prompt("Tell me the Starting Position");
		let connectionB = prompt("Tell me the Ending Position");

		const connectA = screen.Points.find(
			(value) => value.name == connectionA,
		);
		const connectB = screen.Points.find(
			(value) => value.name == connectionB,
		);
		if (
			connectA != undefined &&
			connectB != undefined &&
			connectA != connectB
		) {
			screen.algoStart(connectA, connectB);
		}
	};
	const reset = () => {
		screen.setGraph(
			[PointA, PointB, PointC, PointD, PointE, PointF],
			[
				LineA,
				LineB,
				LineC,
				LineE,
				LineF,
				LineG,
				LineH,
				LineI,
				LineJ,
				LineK,
			],
		);
	};
</script>

<canvas
	id="canvas"
	bind:this={canvas}
	width="600"
	height="600"
	on:mousedown={screen.screenDownListener}
></canvas>
<div>
	<button on:click={newPoint} disabled={newPointDisable}>New Point</button>
	<button on:click={newLine}>New Line</button>
	<button on:click={runAlgo}>RUN THE ALGORITHM</button>
	<button on:click={reset}>reset</button>
	<br />
	<span>status: {status}</span>
</div>

<style>
	#canvas {
		border-color: violet;
		border-width: 1px;
		border-style: solid;
	}
</style>
