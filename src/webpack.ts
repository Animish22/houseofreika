// webpack.ts
import type { PayloadBundler } from 'payload/config'
import type { Configuration } from 'webpack'

export const customWebpackBundler: PayloadBundler = {
  webpack: (incomingWebpackConfig: Configuration): Configuration => {
    return {
      ...incomingWebpackConfig,
      resolve: {
        ...incomingWebpackConfig.resolve,
        fallback: {
          ...(incomingWebpackConfig.resolve?.fallback || {}),
          fs: false,
          readline: false,
        },
      },
    }
  },
}
