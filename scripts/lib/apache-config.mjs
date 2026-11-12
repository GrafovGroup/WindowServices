// WHC cPanel server srv48 reports Apache 2.4.69. Validate actual host behaviour before launch.
export function apacheConfig({ mode, origin }) {
  const production = mode === 'production';
  const host = new URL(origin).host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return `# WindowServices.ca — generated ${mode} configuration
Options -Indexes -MultiViews
DirectoryIndex index.html
AddType application/manifest+json .webmanifest
AddType image/svg+xml .svg

ErrorDocument 404 /404.html
<If "%{REQUEST_URI} =~ m#^/fr(?:/|$)#">
  ErrorDocument 404 /fr/404/index.html
</If>

RewriteEngine On
${production ? `RewriteCond %{HTTPS} !=on [OR]
RewriteCond %{HTTP_HOST} !^${host}$ [NC]
RewriteRule ^ ${origin}%{REQUEST_URI} [R=301,L,NE]
` : ''}
RewriteRule ^$ /en/ [R=${production ? 301 : 302},L]
# The error pages themselves return 404, without looping during ErrorDocument handling.
RewriteCond %{ENV:REDIRECT_STATUS} !=404
RewriteRule ^(?:404\\.html|(?:en|fr)/404(?:/index\\.html)?/?)$ - [R=404,L]

Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
Header always set Content-Security-Policy "default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self' https://formspree.io; form-action https://formspree.io; base-uri 'none'; frame-ancestors 'none'; object-src 'none'"
${production ? 'Header set Cache-Control "public, max-age=3600, must-revalidate"' : 'Header always set X-Robots-Tag "noindex, follow"\nHeader always set Cache-Control "no-store"'}
`;
}
