import {
    Chart,
    Title,
    Legend,
    BarController,
    BarElement,
    LinearScale,
    CategoryScale,
} from "chart.js";


export function registerChart() {
    Chart.register( //may be needed
        Title,
        Legend,
        BarController,
        BarElement,
        LinearScale,
        CategoryScale,
    )
}

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
    function setupChart(options) {
        chartObject = new Chart(element, {
            type: "bar",
            data: {
                labels: [
                    "X",
                    "Y",
                    "Z",
                    "modulus",
                ],
                datasets: [
                    {
                        label: "Best (m/s²)",
                        data: {
                            X: options.best?.xAccel,
                            Y: options.best?.yAccel,
                            Z: options.best?.zAccel,
                            modulus: options.best?.modulus,
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
                backgroundColor: "#fa8938"
            },
        });
    }
    setupChart(options)
    return {
        /**
        * @param { OptionsBest } options
        */
        update(options) {
            chartObject.destroy();
            setupChart(options);
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
                    "X",
                    "Y",
                    "Z",
                    "modulus",
                ],
                datasets: [
                    {
                        label: "Latest (m/s²)",
                        data: {
                            X: options.latest?.xAccel,
                            Y: options.latest?.yAccel,
                            Z: options.latest?.zAccel,
                            modulus: options.latest?.modulus,
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
                backgroundColor: "#fa8938"
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