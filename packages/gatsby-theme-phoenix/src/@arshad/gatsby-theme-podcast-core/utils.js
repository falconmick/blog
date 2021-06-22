export const formatDuration = seconds => {
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(seconds / (60 * 60))

  return [
    hours && `${hours} hour${hours > 1 ? "s" : ""}`,
    minutes && `${minutes} minute${minutes > 1 ? "s" : ""}`,
  ]
    .filter(Boolean)
    .join(" ")
}

export const formatDate = date => {
  return new Date(date).toLocaleDateString(`en-US`, {
    month: `long`,
    day: `numeric`,
    year: `numeric`,
  })
}
