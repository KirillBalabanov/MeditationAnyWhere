import DateParsed from "./DateParsed";

class SqlDateParser {
    static parse(date: string): DateParsed {
        let year = date.substring(0, 4);
        let month = date.substring(5, 7);
        let day = date.substring(8, 10);
        return {
            year: Number.parseInt(year),
            month: Number.parseInt(month),
            day: Number.parseInt(day),
        }
    }
}

export default SqlDateParser;