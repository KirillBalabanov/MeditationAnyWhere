import React from 'react';
import SqlDateParser from "./SqlDateParser";
import ParsedDate from "./ParsedDate";
import sqlDateParser from "./SqlDateParser";

interface DateProps {
    date: string
}

const Date = ({date}: DateProps) => {

    const monthShorted = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const format = (date: ParsedDate) => {
        let str = "";
        str += monthShorted[date.month - 1];
        str += " " + date.day;
        str += ", " + date.year;
        return str;
    };

    return (
        <span>
            {format(sqlDateParser.getParsedDate(date))}
        </span>
    );
};

export default Date;