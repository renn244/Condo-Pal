import { differenceInHours, format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

const formatSmartDate = (date: Date) => {
    const now = new Date();

    if(isToday(date)) {
        const hoursAgo = differenceInHours(now, date);
        if(hoursAgo < 1) {
            return formatDistanceToNow(date, { addSuffix: true });
        } else {
            return `${hoursAgo} hour${hoursAgo > 1 ? 's' : ''} ago`;
        }
    } else if(isYesterday(date)) {
        return 'isYesterday';
    } else {
        return format(date, 'PPP');
    }
}

export default formatSmartDate