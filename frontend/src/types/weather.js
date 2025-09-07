/**
 * @typedef {Object} WeatherData
 * @property {string} name
 * @property {{ country: string, sunrise?: number, sunset?: number }} [sys]
 * @property {{
 *   temp: number,
 *   humidity: number,
 *   pressure: number,
 *   feels_like: number,
 *   temp_min: number,
 *   temp_max: number
 * }} main
 * @property {{
 *   main: string,
 *   description: string,
 *   icon: string
 * }[]} weather
 * @property {{ speed: number }} wind
 * @property {{ lat: number, lon: number }} coord
 * @property {number} [visibility]
 */

/**
 * @typedef {Object} ForecastData
 * @property {{
 *   dt_txt: string,
 *   main: {
 *     temp: number
 *   },
 *   weather: {
 *     icon: string,
 *     description: string
 *   }[]
 * }[]} list
 */
