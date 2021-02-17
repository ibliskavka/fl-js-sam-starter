export class Util{
    /**
     * Returns a yyyy/mm/dd prefix for use in S3
     */
    static getDatePrefix(): string {
        const today = new Date();
        let dd = today.getDate() as any;

        let mm = today.getMonth() + 1 as any;
        const yyyy = today.getFullYear();
        if (dd < 10) {
            dd = `0${dd}`;
        }

        if (mm < 10) {
            mm = `0${mm}`;
        }
        return `${yyyy}/${mm}/${dd}`;
    }

    static sleep(seconds: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, seconds * 1000));
    }
}