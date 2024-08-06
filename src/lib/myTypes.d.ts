type Training = {
    id: string;
    xAccelReadings: int[]
}
type Reading = {
    xAccel: number
    yAccel: number
    zAccel: number
}

type Packet = {
    version: string
    reading: Reading
}

type TrainingStatus = "not started" | "in progress" | "done"

export const Types = {}