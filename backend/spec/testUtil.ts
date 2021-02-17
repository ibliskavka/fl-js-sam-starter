import axios from "axios";
import _ from "lodash";

export interface ITiming {
    elapsed: number;
    count: number;
}

export class TestUtil {
    // Defaults
    static readonly baseUrl = "https://d1khlslk4394e7.cloudfront.net";
    static readonly jurisdiction = "CT";
    static readonly timeout = 15 * 60 * 1000;

    static setupEnv() {
        // process.env.LOG_LEVEL = "debug";


        axios.defaults.validateStatus = function () {
            return true;
        };
    }

    /**
     * For timing operations
     */
    static seconds() {
        return (new Date()).getTime() / 1000;
    }

    static elapsed(start: number): number {
        return (Math.round(TestUtil.seconds() - start));
    }

    static computeMetrics(timings: ITiming[]): { [name: string]: number } {
        return {
            meanTime: _.mean(timings.map(x => x.elapsed)),
            maxTime: _.max(timings.map(x => x.elapsed)),
            meanCount: _.mean(timings.map(x => x.count)),
            maxCount: _.max(timings.map(x => x.count)),
        };
    }
}