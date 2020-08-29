const getColorCluster = (primary) => {
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

export const getColorClusterMap = primary => {
  const sortedColors = getColorCluster(primary).sort()
  const index = sortedColors.findIndex(t => t === primary || t === primary.toLowerCase())
  return sortedColors.reduce(
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
    {}
  )
}

export const getStyleTemplate = (primary, styleText) => {
  const colorMap = getColorClusterMap(primary)
  Object.keys(colorMap).forEach(key => {
    const value = colorMap[key]
    styleText = styleText.replace(new RegExp(key, 'ig'), value)
  })
  return styleText
}

export const getFile = url => {
  return new Promise((resolve, reject) => {
    const client = new XMLHttpRequest()
    client.responseType = ''
    client.onreadystatechange = () => {
      if (client.readyState !== 4) return
      if (client.status === 200) {
        const urlArr = client.responseURL.split('/')
        resolve({
          data: client.responseText.replace(/@font-face{[^}]+}/, ''),
          url: urlArr[urlArr.length - 1]
        })
      } else {
        reject(new Error(client.statusText))
      }
    }
    client.open('GET', url)
    client.send()
  })
}
