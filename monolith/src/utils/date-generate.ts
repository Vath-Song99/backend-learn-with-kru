export function GenerateTimeExpire(date: Date) {
    const newDate = new Date(date);
    newDate.setSeconds(newDate.getMinutes() + 10);
    return newDate;
}