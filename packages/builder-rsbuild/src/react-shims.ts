/**
 * Copied from https://github.com/storybookjs/storybook/blob/main/code/lib/react-dom-shim/src/preset.ts
 * We had to copy this file because there's no rsbuildFinal there.
 */

import { readFile } from 'node:fs/promises'
import { dirname, isAbsolute, join } from 'node:path'
import type { RsbuildConfig } from '@rsbuild/core'
import type { Options } from '@storybook/types'

/**
 * Get react-dom version from the resolvedReact preset, which points to either
 * a root react-dom dependency or the react-dom dependency shipped with addon-docs
 */
const getIsReactModern = async (options: Options) => {
  const { legacyRootApi } =
    (await options.presets.apply<{ legacyRootApi?: boolean } | null>(
      'frameworkOptions',
    )) || {}

  if (legacyRootApi) {
    return false
  }

  const reactDom = dirname(
    require.resolve('react-dom/package.json', { paths: [process.cwd()] }),
  )

  if (!isAbsolute(reactDom)) {
    // if react-dom is not resolved to a file we can't be sure if the version in package.json is correct or even if package.json exists
    // this happens when react-dom is resolved to 'preact/compat' for example
    return false
  }

  const { version } = JSON.parse(
    await readFile(join(reactDom, 'package.json'), 'utf-8'),
  )
  return (
    version.startsWith('18.') ||
    version.startsWith('19.') ||
    version.startsWith('0.0.0')
  )
}

export const applyReactShims = async (
  _config: any,
  options: Options,
): Promise<RsbuildConfig | undefined> => {
  const isReactModern = await getIsReactModern(options)
  if (isReactModern) {
    return {
      resolve: {
        alias: {
          '@storybook/react-dom-shim':
            '@storybook/react-dom-shim/dist/react-18',
        },
      },
    }
  }

  return undefined
}
