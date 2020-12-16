'use strict'
/**
 * https://zh.wikipedia.org/wiki/HSL%E5%92%8CHSV%E8%89%B2%E5%BD%A9%E7%A9%BA%E9%97%B4#.E4.BB.8ERGB.E5.88.B0HSL.E6.88.96HSV.E7.9A.84.E8.BD.AC.E6.8D.A2
 * http://stackoverflow.com/questions/2353211/hsl-to-rgb-color-conversion
 */

export function HSLToRGB(hsl) {
  const [h, s, l] = hsl
  let r, g, b

  const hue2rgb = function(p, q, t) {
    if (t < 0) {
      t += 1
    }
    if (t > 1) {
      t -= 1
    }
    if (t < 1 / 6) {
      return p + (q - p) * 6 * t
    }
    if (t < 1 / 2) {
      return q
    }
    if (t < 2 / 3) {
      return p + (q - p) * (2 / 3 - t) * 6
    }
    return p
  }

  if (s === 0) {
    r = g = b = l // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s
    const p = 2 * l - q
    r = hue2rgb(p, q, h + 1 / 3)
    g = hue2rgb(p, q, h)
    b = hue2rgb(p, q, h - 1 / 3)
  }

  return '#' + [r * 0xFF, g * 0xFF, b * 0xFF].map(item => toHex(Math.round(item))).join('')
}

export function RGBToHSL(color) {
  color = color.substr(color.indexOf("#") + 1)
  if (color.length === 3) {
    color = color.charAt(0) + color.charAt(0) + color.charAt(1) + color.charAt(1) + color.charAt(2) + color.charAt(2)
  }

  /**
   * r, g, b to [0, 1]
   */
  const r = parseHex(color.substr(0, 2)) / 255
  const g = parseHex(color.substr(2, 2)) / 255
  const b = parseHex(color.substr(4, 2)) / 255

  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const diff = max - min
  const l = (max + min) / 2
  let h = 0
  let s = 0

  if (diff) {
    s = l > 0.5 ? diff / (2 - max - min) : diff / (max + min)
    switch (max) {
      case r:
        h = (g - b) / diff + (g < b ? 6 : 0)
        break
      case g:
        h = (b - r) / diff + 2
        break
      case b:
        h = (r - g) / diff + 4
        break
    }

    // h需要乘以360度才是通常意义上的数字
    h = h / 6
  }

  return [h, s, l]
}

function parseHex(str) {
  return parseInt(str, 16)
}

function toHex(num) {
  const ret = num.toString(16)
  return ret.length === 1 ? ('0' + ret) : ret
}
