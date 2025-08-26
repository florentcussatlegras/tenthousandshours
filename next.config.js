/** @type {import('next').NextConfig} */
const nextConfig = {
    serverExternalPackages: ["@node-rs/argon2"],
    images: {
        remotePatterns: [new URL("https://www.freepik.com/premium-photo/stack-books-desktop-various-books-office-supplies-table_16998396.htm#fromView=keyword&page=1&position=25&uuid=0f5f7b03-538e-4a71-afe5-b18c8d0b844b&query=Study+books")],
    }
};

module.exports = nextConfig;
