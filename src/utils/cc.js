const getThemeCluster = (primary) => {
  const tintColor = (color, tint) => {
    let red = parseInt(color.slice(0, 2), 16)
    let green = parseInt(color.slice(2, 4), 16)
    let blue = parseInt(color.slice(4, 6), 16)

    red += Math.round(tint * (255 - red))
    green += Math.round(tint * (255 - green))
    blue += Math.round(tint * (255 - blue))

    red = red.toString(16)
    green = green.toString(16)
    blue = blue.toString(16)

    return `#${red}${green}${blue}`
  }

  const shadeColor = (color, shade) => {
    let red = parseInt(color.slice(0, 2), 16)
    let green = parseInt(color.slice(2, 4), 16)
    let blue = parseInt(color.slice(4, 6), 16)

    red = Math.round((1 - shade) * red)
    green = Math.round((1 - shade) * green)
    blue = Math.round((1 - shade) * blue)

    red = red.toString(16)
    green = green.toString(16)
    blue = blue.toString(16)

    return `#${red}${green}${blue}`
  }

  if (primary.charAt(0) === '#') primary = primary.slice(1)
  const clusters = []
  for (let i = 0; i <= 9; i++) {
    clusters.push(tintColor(primary, Number((i / 10).toFixed(2))))
  }
  clusters.push(shadeColor(primary, 0.1))
  return clusters
}

const primaryColor = '#409EFF'
const sortedColors = getThemeCluster(primaryColor).sort()
const index = sortedColors.findIndex(t => t === primaryColor || t === primaryColor.toLowerCase())
const colorMap = {}
const res = sortedColors.reduce(
  (acc, curr, idx) => {
    let val = ''
    if (idx < index) {
      val = `sharp-${idx + 1}`
    } else if (idx === index) {
      val = 'primary'
    } else {
      val = `light-${idx - index + 1}`
    }
    return {
      ...acc,
      [curr]: val
    }
  },
  colorMap
)

console.log(res)
