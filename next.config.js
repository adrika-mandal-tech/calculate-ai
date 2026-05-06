/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: [
      'public5.wolframalpha.com',
      'public5c.wolframalpha.com',
      'public.wolframalpha.com',
      'www.wolframalpha.com',
      'wolframalpha.com'
    ],
    unoptimized: true
  },
}

module.exports = nextConfig
