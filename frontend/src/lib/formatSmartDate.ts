import { differenceInHours, format, formatDistanceToNow, isToday, isYesterday } from "date-fns";

const formatSmartDate = (date: Date) => {
    const now = new Date();

    if(isToday(date)) {
        const hoursAgo = differenceInHours(now, date);
        if(hoursAgo < 1) {
            const current = formatDistanceToNow(date);
            
            if(current === 'less than a minute') {
                return 'just now';
            }
            
            return current;
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