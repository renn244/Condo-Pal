const formatToPesos = (amount: number) => {
    return new Intl.NumberFormat("en-Ph", {
        style: 'currency',
        currency: 'PHP'
    }).format(amount)
}

export default formatToPesos