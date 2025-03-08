type PaymentStatusResponse = {
    name: string,
    status: "pending" | "paid" | "failed" | "loading",
    linkId: string,
    checkouturl: string, // just in case the user want to go back to paying
}