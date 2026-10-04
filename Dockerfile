FROM caddy:2-alpine

COPY Caddyfile /etc/caddy/Caddyfile
COPY index.html style.css script.js favicon.svg /srv/

EXPOSE 8080
