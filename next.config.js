module.exports = {
  webpackDevMiddleware: config => {
    config.watchOptions = {
      poll: 1000,
      aggregateTimeout: 300,
    }
    return config
  },
  // experimental: {
  //   scrollRestoration: true,
  // },
  images: {
    domains: ['images.pexels.com', 'media.meds.se', 'i.ibb.co', "i.ibb.co.com", 'lh3.googleusercontent.com', 'graph.facebook.com'], //your-external-link-hostname
    // hostname: ["images.pexels.com"]
  },
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    // ignoreDuringBuilds: true,
  },
  typescript: {
    // !! WARN !!
    // Dangerously allow production builds to successfully complete even if
    // your project has type errors.
    // !! WARN !!
    ignoreBuildErrors: true,
  },
  // reactStrictMode: true,
}
