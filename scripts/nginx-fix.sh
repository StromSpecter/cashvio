#!/usr/bin/env bash
# Idempotently adds cache headers to alurkasku.com server block(s).
# Pure bash + awk: no python dependency on the VPS.
# Writes status/diagnostics to the web root so CI can inspect remotely.
set -eu
SUDO=""
[ "$(id -u)" -ne 0 ] && SUDO="sudo"

WEBROOT=/var/www/cashvio/dist
DIAG="$WEBROOT/nginx-diag.txt"
report() { echo "$1" > /tmp/.diag && $SUDO mv /tmp/.diag "$DIAG" && $SUDO chmod 644 "$DIAG" || true; }
trap 'if [ ! -s "$DIAG" ]; then report "FAILED at line $LINENO rc=$? (last stage: $STAGE)"; fi' ERR
STAGE="init"

FILES=$($SUDO grep -rlE "alurkasku\.com|/var/www/cashvio" \
  /etc/nginx/sites-enabled /etc/nginx/sites-available /etc/nginx/conf.d /etc/nginx/nginx.conf 2>/dev/null)
echo "Candidate files:"
echo "$FILES"
if [ -z "$FILES" ]; then
  echo "grep found nothing, dumping nginx -T for diagnosis..."
  $SUDO nginx -T 2>/dev/null | head -c 40000 > /tmp/.diag || true
  $SUDO mv /tmp/.diag "$DIAG" 2>/dev/null || $SUDO install -m 644 /tmp/.diag "$DIAG" 2>/dev/null || true
  exit 2
fi

STAGE="patch"
PATCH_OK=0
for CONF in $FILES; do
  if $SUDO grep -q "managed-by: nginx-fix" "$CONF"; then
    echo "$CONF already patched, skipping."
    PATCH_OK=1
    continue
  fi
  BACKUP="$CONF.bak.$(date +%s)"
  $SUDO cp "$CONF" "$BACKUP"
  echo "=== Patching $CONF ==="

  $SUDO awk -v file="$CONF" '
    BEGIN { depth = 0; inb = 0; match_flag = 0; ind = ""; patched_seen = 0; body = "" }
    {
      line = $0
      if (!inb && line ~ /^[ \t]*server[ \t]*\{/) {
        inb = 1; depth = 1; match_flag = 0; ind = ""; body = ""
        print line
        next
      }
      if (inb) {
        if (ind == "" && line ~ /^[ \t]+[^ \t]/) {
          ind = substr(line, RSTART, RLENGTH)
        }
        n = gsub(/\{/, "{", line)
        m = gsub(/\}/, "}", line)
        body = body "\n" line
        if (line ~ /alurkasku\.com|\/var\/www\/cashvio/) match_flag = 1
        depth += n - m
        if (depth == 0) {
          if (match_flag && line ~ /^[ \t]*\}[ \t]*$/) {
            print ind "location = /index.html {"
            print ind "    add_header Cache-Control \"no-cache, must-revalidate\";"
            print ind "}"
            print ""
            print ind "location ^~ /assets/ {"
            print ind "    add_header Cache-Control \"public, max-age=31536000, immutable\";"
            print ind "}"
            patched_seen = 1
          }
          inb = 0
        }
        print line
        next
      }
      print line
    }
    END { exit(patched_seen ? 0 : 5) }
  ' "$CONF" > "/tmp/.nginx-patch.$$" 2>&1
  RC=$?
  if [ "$RC" -eq 0 ]; then
    $SUDO cp "/tmp/.nginx-patch.$$" "$CONF"
    echo "Patched $CONF"
    PATCH_OK=1
  else
    echo "awk rc=$RC for $CONF, restoring backup."
    $SUDO cp "$BACKUP" "$CONF"
  fi
  rm -f "/tmp/.nginx-patch.$$"
done

[ "$PATCH_OK" -eq 1 ] || { report "ERROR: no file was patched"; exit 3; }

STAGE="nginx-test"
if ! $SUDO nginx -t; then
  STAGE="rollback"
  echo "nginx -t FAILED - rolling back all backups."
  for CONF in $FILES; do
    B=$(ls -t "$CONF".bak.* 2>/dev/null | head -1)
    [ -n "$B" ] && $SUDO cp "$B" "$CONF"
  done
  report "ERROR: nginx -t failed after patch, rolled back"
  exit 1
fi

STAGE="reload"
$SUDO systemctl reload nginx
echo "Nginx reloaded."

STAGE="diag"
$SUDO nginx -T 2>/dev/null | head -c 40000 > /tmp/.nginx-diag || true
$SUDO mv /tmp/.nginx-diag "$DIAG" 2>/dev/null || $SUDO install -m 644 /tmp/.nginx-diag "$DIAG"
$SUDO chmod 644 "$DIAG" 2>/dev/null || true
echo "Diag written. All done."
