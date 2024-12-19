import type { CSSObject, Preset, Rule } from 'unocss'
import postcss from 'postcss'
import { objectify, parse } from 'postcss-js'
import { definePreset } from 'unocss'
import animatecss from './animatecss'

function toCSS(obj: any) {
  return parse(obj).toString()
}

type CSSObjectEntries = [string, CSSObject][]

export function presetAnimateCSS(): Preset {
  const root = postcss.parse(animatecss)
  const obj = objectify(root)

  const rootStyle = obj[':root']

  const medias: CSSObjectEntries = []

  const staticRules: CSSObjectEntries = []

  const keyframes: CSSObjectEntries = []

  for (const [name, body] of Object.entries(obj)) {
    if (name.startsWith('.animate__'))
      staticRules.push([name, body])
    else if (name.startsWith('@keyframes'))
      keyframes.push([name.replace('@keyframes', '').trim(), body])
    else if (name.startsWith('@media'))
      medias.push([name, body])
  }

  /**
   * 将.a.b取b
   * @param name
   */
  const normalizeClassName = (name: string) => {
    const parts = name.split('.')
    return parts[parts.length - 1]
  }

  return definePreset({
    name: 'unocss-preset-animatecss',
    preflights: [
      {
        layer: 'animate.css',

        getCSS: () => {
          return toCSS({
            ':root': rootStyle,
            ...Object.fromEntries(medias),
          })
        },
      },
    ],
    layers: {
      animate: -1,
    },
    rules: [
      ...staticRules.map(([name, body]) => {
        const className = normalizeClassName(name)
        const animateName = body.animationName as string | undefined
        if (animateName) {
          const keyframe = keyframes.find(([k]) => k === animateName)
          if (keyframe) {
            const keyframeCSS = `@keyframes ${animateName} {\n${toCSS(keyframe[1])}}`
            return [new RegExp(`^${className}`), () => {
              return [{
                'animation-name': animateName,
              }, keyframeCSS]
            }]
          }
        }
        return [className, `${name}{
          ${toCSS(body)}
        }`]
      }) as Rule[],
      [/^animate__delay-([\w.]+)/, ([_, delay]) => {
        return {
          'animation-delay': delay,
        }
      }],
      [/^animate__duration-([\w.]+)/, ([_, duration]) => {
        return {
          'animation-duration': duration,
        }
      }],
      [/^animate__repeat-(\d+)/, ([_, count]) => {
        return {
          'animation-iteration-count': `calc(var(--animate-repeat) * ${count})`,
        }
      }],
    ],
  })
}

export default presetAnimateCSS
