
/**
 * will format the date and time to locale and with a consistant format
 * @param date 
 * @returns - date
 */
const formatDateTime = (date: Date) => {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: 'numeric',
        hour: '2-digit',
        minute: 'numeric'
    })
}

export default formatDateTime