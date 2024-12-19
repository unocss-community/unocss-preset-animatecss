import dedent from 'dedent'
import prettier from 'prettier'
import { createGenerator } from 'unocss'
import { expect } from 'vitest'
import { presetAnimateCSS } from '../src'

const prettyCSS = (css: string) => prettier.format(dedent(css), { parser: 'css' })

it('preset-animatecss', async () => {
  const uno = createGenerator({
    presets: [presetAnimateCSS()],
  })
  const root = await uno.generate('animate__backInDown animate__animated animate__delay-1s')
  const css = await prettyCSS(root.css)
  expect(css).toMatchSnapshot()
})
