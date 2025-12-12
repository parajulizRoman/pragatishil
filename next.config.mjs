/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'picsum.photos' },
      { protocol: 'https', hostname: 'www.onlinekhabar.com' },
      { protocol: 'https', hostname: 'onlinekhabar.com' },
      { protocol: 'https', hostname: 'ekantipur.com' },
      { protocol: 'https', hostname: 'kathmandupost.com' },
      { protocol: 'https', hostname: 'assets-cdn.kathmandupost.com' },
      { protocol: 'https', hostname: 'og.kathmandupost.com' },
      { protocol: 'https', hostname: 'ivlpnaxrefpihtgdlidc.supabase.co' },
      { protocol: 'https', hostname: 'lh3.googleusercontent.com' },
      { protocol: 'https', hostname: '*.googleusercontent.com' },
    ],
  },
};

export default nextConfig;
