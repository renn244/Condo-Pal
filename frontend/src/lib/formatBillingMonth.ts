
export const formatBillingMonth = (date: string) => {
    if(!date) return 'unknow date';

    // the one is just a subtitute we don't really need it
    const [month, year] = date.split("-")
    const currDate = new Date(`${month}-${1}-${year}`);

    return currDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short"
    })
}
