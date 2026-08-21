#!/usr/bin/env bash
# Adds no-cache header for index.html in alurkasku.com nginx config.
# Idempotent: skips if already patched. Logs everything to stdout (CI).
set -u
SUDO=""
[ "$(id -u)" -ne 0 ] && SUDO="sudo"

echo "=== Finding alurkasku config ==="
FILES=$($SUDO grep -rlE "alurkasku\.com|/var/www/cashvio" \
  /etc/nginx/sites-enabled /etc/nginx/sites-available /etc/nginx/conf.d /etc/nginx/nginx.conf 2>/dev/null || true)
echo "Found: ${FILES:-<none>}"
[ -z "$FILES" ] && { echo "ERROR: no config found"; $SUDO nginx -T 2>&1 | head -c 20000; exit 2; }

for CONF in $FILES; do
  echo ""
  echo "=== $CONF ==="
  if $SUDO grep -q "managed-by: nginx-fix" "$CONF"; then
    echo "Already patched, skipping."
    continue
  fi

  HAS=$($SUDO grep -c 'location = /index.html' "$CONF" || true)
  if [ "$HAS" -gt 0 ]; then
    echo "location = /index.html exists, skipping."
    continue
  fi

  # Find server block line range
  START=$($SUDO grep -n 'server {' "$CONF" | head -1 | cut -d: -f1)
  [ -z "$START" ] && { echo "No server block, skipping."; continue; }
  TOTAL=$($SUDO wc -l < "$CONF")

  DEPTH=0; END=""
  for N in $(seq "$START" "$TOTAL"); do
    L=$($SUDO sed -n "${N}p" "$CONF")
    DEPTH=$((DEPTH + $(echo "$L" | tr -cd '{' | wc -c) - $(echo "$L" | tr -cd '}' | wc -c)))
    [ "$DEPTH" -eq 0 ] && { END=$N; break; }
  done
  [ -z "$END" ] && { echo "No closing brace, skipping."; continue; }

  echo "Server block: lines $START-$END"
  $SUDO cp "$CONF" "$CONF.bak.$(date +%s)"

  # Insert before closing brace
  $SUDO sed -i "$((END))i\\
    # managed-by: nginx-fix\\
    location = /index.html {\\
        add_header Cache-Control \"no-cache, must-revalidate\";\\
    }\\
" "$CONF"

  if $SUDO nginx -t 2>&1; then
    echo "nginx -t OK"
  else
    echo "nginx -t FAILED, restoring."
    B=$(ls -t "$CONF".bak.* 2>/dev/null | head -1)
    [ -n "$B" ] && $SUDO cp "$B" "$CONF"
    exit 1
  fi
done

echo ""
echo "=== Reloading ==="
$SUDO systemctl reload nginx
echo "Done."
