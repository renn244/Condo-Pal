/**
 * will format the date to locale and with a consistant format
 * 
 * @param date - Date type
 * @return - string
 */

const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric"
    })
}

export default formatDate