import { dirname, join } from 'node:path'
import type { PresetProperty } from '@storybook/types'
import type { StorybookConfig } from './types'

const getAbsolutePath = <I extends string>(input: I): I =>
  dirname(require.resolve(join(input, 'package.json'))) as any

export const core: PresetProperty<'core'> = async (config, options) => {
  const framework = await options.presets.apply('framework')

  return {
    ...config,
    builder: {
      name: getAbsolutePath('@balafla/storybook-builder-rsbuild'),
      options:
        typeof framework === 'string' ? {} : framework.options.builder || {},
    },
    renderer: getAbsolutePath('@storybook/web-components'),
  }
}

export const rsbuildFinal: StorybookConfig['rsbuildFinal'] = (
  config,
  _options,
) => {
  delete config.html
  return config
}
