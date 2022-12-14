/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images : {
    domains : ['images.unsplash.com',
               'lh3.googleusercontent.com',
               'a0.muscache.com']
  }
}

module.exports = nextConfig
