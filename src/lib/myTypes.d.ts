type Training = {
	id: string;
	xAccelReadings: int[]
}
type Reading = {
	side: "R" | "L"
	xAccel: number
	yAccel: number
	zAccel: number
	module: number
}

type Packet = {
	version: string
	reading: Reading
}

type TrainingStatus = "not started" | "in progress" | "done"

export const Types = {}
