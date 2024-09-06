type Training = {
	id: string | number
	readings: Reading[]
	best: Reading
	crono: string
	date: string
}
type Reading = {
	side: "R" | "L"
	xAccel: number
	yAccel: number
	zAccel: number
	modulus: number
}

type Packet = {
	version: string
	reading: Reading
}

type TrainingStatus = "not started" | "in progress" | "done"

export const Types = {}
