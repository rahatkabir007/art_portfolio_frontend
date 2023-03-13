/** @type {import('next-sitemap').IConfig} */
module.exports = {
    siteUrl: process.env.SITE_URL || 'https://art-portfolio-nextjs-rahatkabir04.vercel.app/',
    generateRobotsTxt: true, // (optional)
    // ...other options
    outDir: './out'
}