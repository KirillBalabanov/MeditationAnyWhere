import ParsedDate from "./ParsedDate";

class SqlDateParser {

    static getParsedDate(sqlDate: string): ParsedDate {
        let strings = sqlDate.split("-");
        let year = Number.parseInt(strings[0]);
        let month = Number.parseInt(strings[1]);
        let day = Number.parseInt(strings[2]);
        return {
            year: year,
            month: month,
            day: day
        };
    }
}

export default SqlDateParser;