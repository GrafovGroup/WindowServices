// A directory with its own RewriteEngine does not inherit the parent rules.
function canonicalRedirect({ mode, origin }) {
  if (mode !== 'production') return '';
  const host = new URL(origin).host.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return `RewriteCond %{HTTPS} !=on [OR]
RewriteCond %{HTTP_HOST} !^${host}$ [NC]
RewriteRule ^ ${origin}%{REQUEST_URI} [R=301,L,NE]
`;
}

// WHC cPanel server srv48 reports Apache 2.4.69 compatibility.
export function apacheConfig({ mode, origin }) {
  const production = mode === 'production';
  return `# WindowServices.ca — generated ${mode} configuration
Options -Indexes -MultiViews
DirectoryIndex index.html
AddType application/manifest+json .webmanifest
AddType image/svg+xml .svg

ErrorDocument 404 /_errors/en.html

RewriteEngine On
${canonicalRedirect({ mode, origin })}
RewriteRule ^$ /en/ [R=${production ? 301 : 302},L]
# Dedicated internal documents avoid reliance on REDIRECT_STATUS, which differs on LiteSpeed.
RewriteRule ^(?:404\\.html|en/404(?:/index\\.html)?/?)$ - [R=404,L]

Header always set X-Content-Type-Options "nosniff"
Header always set Referrer-Policy "strict-origin-when-cross-origin"
Header always set Permissions-Policy "camera=(), microphone=(), geolocation=()"
Header always set Content-Security-Policy "default-src 'self'; img-src 'self'; style-src 'self'; script-src 'self'; connect-src 'self' https://formspree.io; form-action https://formspree.io; base-uri 'none'; frame-ancestors 'none'; object-src 'none'"
${production ? 'Header set Cache-Control "public, max-age=3600, must-revalidate"' : 'Header always set X-Robots-Tag "noindex, follow"\nHeader always set Cache-Control "no-store"'}
`;
}

export function frenchApacheConfig(config) {
  return `# Directory-scoped ErrorDocument works on both Apache and WHC LiteSpeed.
ErrorDocument 404 /_errors/fr.html
RewriteEngine On
${canonicalRedirect(config)}
RewriteRule ^404(?:/index\\.html)?/?$ - [R=404,L]
`;
}
