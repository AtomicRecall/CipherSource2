function getTwoWeekRange(date: Date): Date[] {
  const start = new Date(date);

  start.setDate(date.getDate() - date.getDay()); // Sunday of this week

  const days: Date[] = [];

  for (let i = 0; i < 14; i++) {
    const d = new Date(start);

    d.setDate(start.getDate() + i);
    days.push(d);
  }

  return days;
}

export default getTwoWeekRange;
