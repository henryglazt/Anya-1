import {
  RGBToHSL,
  HSLToRGB
} from './util'

class Colors {
  constructor() {
    this.colors = []
  }

  get() {
    return this.colors
  }

  generate(color, num = 20) {
    const hsl = RGBToHSL(color)
    const h = hsl[0] * 360
    const step = 360 / num
    const colors = []

    for (let i = 0; i < num; i++) {
      const newH = ((h + i * step) % 360) / 360
      colors.push(HSLToRGB([newH, hsl[1], hsl[2]]))
    }

    this.colors = colors
    return this
  }

  lighter(val) {
    this.colors = this.colors.map((color) => {
      const hsl = RGBToHSL(color)
      hsl[2] = Math.min(hsl[2] + val, 1)
      return HSLToRGB(hsl)
    })
    return this
  }

  darker(val) {
    this.colors = this.colors.map((color) => {
      const hsl = RGBToHSL(color)
      hsl[2] = Math.max(hsl[2] - val, 0)
      return HSLToRGB(hsl)
    })
    return this
  }

  purer(val) {
    this.colors = this.colors.map((color) => {
      const hsl = RGBToHSL(color)
      hsl[1] = Math.min(hsl[1] + val, 1)
      return HSLToRGB(hsl)
    })
    return this
  }

  impurer(val) {
    this.colors = this.colors.map((color) => {
      const hsl = RGBToHSL(color)
      hsl[1] = Math.max(hsl[1] - val, 0)
      return HSLToRGB(hsl)
    })
    return this
  }
}

module.exports = new Colors()
