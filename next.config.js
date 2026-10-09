/** @type {import('next').NextConfig} */

// GitHub Pages (URL projet) : basePath actif uniquement en CI
const isGhPages = process.env.GITHUB_ACTIONS === 'true';
const repoBase = '/cauris-group-international-site-web-corporate';

const nextConfig = {
  reactStrictMode: true,
  output: 'export',
  trailingSlash: true,
  basePath: isGhPages ? repoBase : '',
  assetPrefix: isGhPages ? `${repoBase}/` : '',
  images: {
    unoptimized: true,
    remotePatterns: [{ protocol: 'https', hostname: 'images.unsplash.com' }],
  },
  webpack: (
    config,
    { buildId, dev, isServer, defaultLoaders, nextRuntime, webpack }
  ) => {

    config.plugins.push(
      new webpack.ProvidePlugin({
        $: "jquery",
        jQuery: "jquery",
        "window.jQuery": "jquery",
      })
    );

    // Important: return the modified config
    return config
  },
}

module.exports = nextConfig
