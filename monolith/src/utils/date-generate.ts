export function GenerateTimeExpire(date: Date) {
    const newDate = new Date(date);
    newDate.setMinutes(newDate.getMinutes() + 10);
    return newDate;
}
