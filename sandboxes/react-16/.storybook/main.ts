import { dirname, join } from 'node:path'
import type { StorybookConfig } from '@balafla/storybook-react-rsbuild'
import { mergeRsbuildConfig } from '@rsbuild/core'

/**
 * This function is used to resolve the absolute path of a package.
 * It is needed in projects that use Yarn PnP or are set up within a monorepo.
 */
function getAbsolutePath(value: string): any {
  return dirname(require.resolve(join(value, 'package.json')))
}

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/addon-docs',
    '@storybook/addon-links',
    '@storybook/addon-essentials',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: getAbsolutePath('@balafla/storybook-react-rsbuild'),
    options: {
      builder: {
        lazyCompilation: true,
      },
    },
  },
  docs: {
    defaultName: 'Docs',
    docsMode: false,
    autodocs: false,
  },
  typescript: {
    reactDocgen: 'react-docgen',
    check: true,
  },
  staticDirs: ['../public'],
  rsbuildFinal: (config) => {
    return mergeRsbuildConfig(config, {
      source: {
        alias: {
          react: getAbsolutePath('react'),
          'react-dom': getAbsolutePath('react-dom'),
        },
      },
    })
  },
}

export default config
