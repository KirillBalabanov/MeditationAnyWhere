import React, {FC, useCallback} from 'react';
import DateParsed from "./DateParsed";
import SqlDateParser from "./SqlDateParser";

interface DateProps {
    date: string
}

const monthShorted = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const Date: FC<DateProps> = ({date}) => {

    const format = useCallback((d: DateParsed) => {
        let str = "";
        str += monthShorted[d.month - 1];
        str += " " + d.day;
        str += ", " + d.year;
        return str;
    }, [date]);

    return (
        <span>
            {format(SqlDateParser.parse(date))}
        </span>
    );
};

export default Date;