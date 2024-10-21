export const formateTimeInput = (text: string, silent?: boolean) => {
  const timeMatch = text
    .trim()
    .match(/(2[0-3]|[0-1]?\d)(\D+([0-5]?\d))?(\D+([0-5]?\d))?(\D+(\d+))?/)
  if (timeMatch) {
    let hour = timeMatch[1].padStart(2, "0")
    let minute = (timeMatch[3] || "0").padStart(2, "0")
    let second = (timeMatch[5] || "0").padStart(2, "0")
    const millisecond = (timeMatch[7] || "0").padStart(3, "0")

    if (parseInt(hour) > 23) hour = "23"
    if (parseInt(minute) > 59) minute = "59"
    if (parseInt(second) > 59) second = "59"

    return `${hour}:${minute}:${second}.${millisecond}`
  }
  if (!silent) console.warn("Invalid time format:", text)
  return undefined
}

export const formateDateInput = (text: string, silent?: boolean) => {
  const dateMatch = text.trim().match(/((\d{2,4})\D+)?(\d{1,2})\D+(\d{1,2})/)
  if (dateMatch) {
    let year = dateMatch[2] ?? new Date().getFullYear().toString()
    const month = dateMatch[3]
    const date = dateMatch[4]
    if (year && year.length === 2) year = `20${year}`
    const dateObj = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(date)
    )
    if (!isNaN(dateObj.getTime())) {
      if (
        parseInt(year) !== dateObj.getFullYear() ||
        parseInt(month) !== dateObj.getMonth() + 1 ||
        parseInt(date) !== dateObj.getDate()
      ) {
        if (!silent) console.warn("Invalid date:", dateObj)
        return undefined
      }
      const yearStr = dateObj.getFullYear().toString().padStart(4, "0")
      const monthStr = (dateObj.getMonth() + 1).toString().padStart(2, "0")
      const dateStr = dateObj.getDate().toString().padStart(2, "0")
      return `${yearStr}-${monthStr}-${dateStr}`
    }
  }
  if (!silent) console.warn("Invalid date format:", text)
  return undefined
}

export const formateDatetimeInput = (text: string, silent?: boolean) => {
  const datetimeMatch = text.match(
    /((\d{2,4})\D+)?(\d{1,2})\D+(\d{1,2})(\D+(2[0-3]|[0-1]?\d))?(\D+([0-5]?\d))?(\D+([0-5]?\d))?(\D+(\d+))?/
  )
  if (datetimeMatch) {
    let year = datetimeMatch[2] ?? new Date().getFullYear().toString()
    const month = datetimeMatch[3]
    const date = datetimeMatch[4]

    let hour = datetimeMatch[6] || "0"
    let minute = datetimeMatch[8] || "0"
    let second = datetimeMatch[10] || "0"
    const millisecond = datetimeMatch[12] || "0"

    if (year && year.length === 2) year = `20${year}`
    if (parseInt(hour) > 23) hour = "23"
    if (parseInt(minute) > 59) minute = "59"
    if (parseInt(second) > 59) second = "59"

    const datetimeObj = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(date),
      parseInt(hour),
      parseInt(minute),
      parseInt(second),
      parseInt(millisecond)
    )
    if (!isNaN(datetimeObj.getTime())) {
      if (
        parseInt(year) !== datetimeObj.getFullYear() ||
        parseInt(month) !== datetimeObj.getMonth() + 1 ||
        parseInt(date) !== datetimeObj.getDate()
      ) {
        if (!silent) console.warn("Invalid date:", datetimeObj)
        return undefined
      }
      const yearStr = datetimeObj.getFullYear().toString().padStart(4, "0")
      const monthStr = (datetimeObj.getMonth() + 1).toString().padStart(2, "0")
      const dateStr = datetimeObj.getDate().toString().padStart(2, "0")
      const hourStr = datetimeObj.getHours().toString().padStart(2, "0")
      const minuteStr = datetimeObj.getMinutes().toString().padStart(2, "0")
      const secondStr = datetimeObj.getSeconds().toString().padStart(2, "0")
      const millisecondStr = datetimeObj
        .getMilliseconds()
        .toString()
        .padStart(3, "0")

      return (
        `${yearStr}-${monthStr}-${dateStr}` +
        ` ${hourStr}:${minuteStr}:${secondStr}.${millisecondStr}`
      )
    }
  }
  if (!silent) console.warn("Invalid datetime format:", text)
  return undefined
}
