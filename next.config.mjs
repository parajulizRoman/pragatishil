/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone', // Required for Docker deployment
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
      { protocol: 'https', hostname: 'img.youtube.com' },
      { protocol: 'https', hostname: 'www.youtube.com' },
      { protocol: 'https', hostname: '*.fbcdn.net' }, // Facebook CDN
      { protocol: 'https', hostname: '*.fna.fbcdn.net' }, // Facebook CDN regional
    ],
  },
};

export default nextConfig;
