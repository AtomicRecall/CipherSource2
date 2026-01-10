/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: false,
    typescript: {
        // Warning: This allows production builds to successfully complete even if
        // your project has TypeScript errors.
        ignoreBuildErrors: true,
    },
    async rewrites() {
        return [
            {
                source: '/home',
                destination: '/home.html',
            },
            {
                source: '/search',
                destination: '/search.html',
            },
        ];
    },
    // Server-side redirects: map path-style /search/<slug> to query-style /search?<slug>
    async redirects() {
        return [
            {
                source: '/search/:input',
                // Redirect path-style /search/<input> (single segment) to query-style /search?input=<input>
                destination: '/search?input=:input',
                permanent: false,
            },
        ];
    },
};

module.exports = nextConfig;
