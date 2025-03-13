
export const formatBillingMonth = (date: string) => {
    // the one is just a subtitute we don't really need it
    const currDate = new Date("1-" + date);
    
    return currDate.toLocaleDateString("en-US", {
        year: "numeric",
        month: "short"
    })
}
