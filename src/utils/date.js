export const formatDateTime = (date) => {
    let newDate = date
    if (typeof newDate !== Date) {
        newDate = new Date(newDate)
    }
    return `${newDate.toLocaleDateString("en-US")} ${newDate.toLocaleTimeString("en-US")}`
}