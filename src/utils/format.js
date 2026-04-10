export const formatCompactWon = (amount) => {
  const absoluteAmount = Math.abs(amount)

  if (absoluteAmount >= 1000000) {
    return `${Math.round(absoluteAmount / 10000).toLocaleString()}만원`
  }

  return `${Math.round(absoluteAmount / 10000).toLocaleString()}만원`
}

export const formatSignedWon = (amount) => {
  const sign = amount > 0 ? '+' : amount < 0 ? '-' : ''
  return `${sign}${Math.abs(amount).toLocaleString()}원`
}
