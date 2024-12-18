// ------------------------------- !!! ATTENTION !!! ------------------------------- //
// You must have globally on your machine the following node packages: url, path, fs //

import { fileURLToPath } from 'url';
import { join, dirname } from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';
import { appConfig } from 'app.config';

interface SiteMapRoute {
    path: string;
    lastModified?: string;
    changeFrequency?: string;
}

/**
 * Generates a sitemap in XML format based on the routes defined in appConfig.
 *
 * If a route has lastModified or changeFrequency properties, they are used in the sitemap.
 * Otherwise, the current date is used for lastModified and "monthly" is used for changeFrequency.
 *
 * @returns A string containing the generated XML sitemap.
 */
function generateSitemap(): string {
    const baseUrl = appConfig.siteURL;
    const xmlHeader = '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n';
    const xmlFooter = "</urlset>";
    const mapRoutes: SiteMapRoute[] = Object.keys(appConfig.routes).map((path): SiteMapRoute => ({ path }));
    const xmlBody = mapRoutes
        .map(route => {
            const url = `<loc>${baseUrl}${route.path}</loc>`;
            const lastModified = `<lastmod>${route.lastModified ?? new Date().toISOString().split("T")[0]}</lastmod>`;
            const changeFrequency = `<changefreq>${route.changeFrequency || "monthly"}</changefreq>`;
            return `<url>${url}${lastModified}${changeFrequency}</url>`;
        }).join("\n");
    return `${xmlHeader}${xmlBody}${xmlFooter}`;
}

((path) => {
    const __dirname = dirname(fileURLToPath(import.meta.url));
    const sitemap = generateSitemap();
    const dirPath = join(__dirname, path);
    const filePath = join(dirPath, 'sitemap.xml');
    if (!existsSync(dirPath)) mkdirSync(dirPath);
    writeFileSync(filePath, sitemap, { encoding: 'utf8' });
})(process.argv[2]);