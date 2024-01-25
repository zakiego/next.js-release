/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ["@libsql/client"],
    logging: {
      level: "verbose",
      fullUrl: true,
    },
  },
};

module.exports = nextConfig;
