import {
    Tooltip,
    Chart,
    Title,
    Legend,
    BarController,
    BarElement,
    LinearScale,
    CategoryScale,
    //
    LineController,
    LineElement,
    PointElement,
} from "chart.js";


export function registerChart() {//may be needed
    Chart.register(
        Title,
        Legend,
        Tooltip,
    ) //general
    registerBarChart()
    registerLineChart()
}

function registerBarChart() {
    Chart.register(
        BarController,
        BarElement,
        LinearScale,
        CategoryScale,
    )
}

function registerLineChart() {
    Chart.register(
        LineController,
        LineElement,
        PointElement,
    )
}

const colors = ["#fa8938", "#38bdf8", "#16a34a", "#facc15",]

// /**
//  * @typedef Options
//  * @property {import('$lib/myTypes.js').Reading[]} readings
//  */

/**
 * @typedef OptionsBest
 * @property {import('$lib/myTypes.js').Reading} best
 */
/**
 * @param {HTMLCanvasElement} element
* @param { OptionsBest } options
*/
export function makeChartBest(element, options) {
    /**
     * @type {Chart<"bar", any, string>}
     */
    let chartObject;
    /**
    * @param { OptionsBest } options
    */
    function drawChart(options) {
        chartObject = new Chart(element, {
            type: "bar",
            data: {
                labels: [
                    "modulus",
                    "X",
                    "Y",
                    "Z",
                ],
                datasets: [
                    {
                        label: "Best (m/s²)",
                        data: {
                            modulus: options.best?.modulus,
                            X: options.best?.xAccel,
                            Y: options.best?.yAccel,
                            Z: options.best?.zAccel,
                        },
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                backgroundColor: (c) => (colors[c.dataIndex % colors.length]),
                // backgroundColor: "#fa8938"
            },
        });
    }
    drawChart(options)
    return {
        /**
        * @param { OptionsBest } options
        */
        update(options) {
            chartObject.destroy();
            drawChart(options);
        },
        destroy() {
            chartObject.destroy();
        }
    }
}

/**
 * @typedef OptionsLatest
 * @property {import('$lib/myTypes.js').Reading} latest
 */

/**
 * @param {HTMLCanvasElement} element
* @param { OptionsLatest } options
*/
export function makeChartLatest(element, options) {
    /**
     * @type {Chart<"bar", any, string>}
     */
    let chartObject;
    /**
    * @param { OptionsLatest } options
    */
    function drawChart(options) {
        chartObject = new Chart(element, {
            type: "bar",
            data: {
                labels: [
                    "modulus",
                    "X",
                    "Y",
                    "Z",
                ],
                datasets: [
                    {
                        label: "Latest (m/s²)",
                        data: {
                            modulus: options.latest?.modulus,
                            X: options.latest?.xAccel,
                            Y: options.latest?.yAccel,
                            Z: options.latest?.zAccel,
                        },
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    y: {
                        beginAtZero: true,
                    },
                },
                backgroundColor: (c) => (colors[c.dataIndex % colors.length]),
                // backgroundColor: "#fa8938"
            },
        });
    }
    drawChart(options)
    return {
        /**
        * @param { OptionsLatest } options
        */
        update(options) {
            chartObject.destroy();
            drawChart(options);
        },
        destroy() {
            chartObject.destroy();
        }
    }
}




/**
 * @typedef OptionsAll
 * @property {import('$lib/myTypes.js').Reading[]} all
 */
/**
 * @param {HTMLCanvasElement} element
* @param { OptionsAll } options
*/
export function makeChartOverall(element, options) {
    /**
     * @type {Chart<"line", number[], number>}
     */
    let chartObject;
    /**
    * @param { OptionsAll } options
    */
    function drawChart(options) {
        chartObject = new Chart(element, {
            type: "line",
            data: {
                labels:
                    options.all.map((e, i) => { return i + 1 })
                ,
                datasets: [
                    {
                        label: "Every modulus (m/s^2) by punch",
                        data:
                            options.all.map(e => e.modulus),
                        borderWidth: 1,
                    },
                ],
            },
            options: {
                scales: {
                    x: {
                        beginAtZero: false,
                    },
                },
                backgroundColor: "#fa8938"
            },
        });
    }
    drawChart(options)
    return {
        /**
        * @param { OptionsAll } options
        */
        update(options) {
            chartObject.destroy();
            drawChart(options);
        },
        destroy() {
            chartObject.destroy();
        }
    }
}
