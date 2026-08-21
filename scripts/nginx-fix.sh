#!/usr/bin/env bash
# Idempotently adds cache headers to the alurkasku.com server block(s),
# then dumps the effective config to the web root for remote inspection.
set -u
SUDO=""
[ "$(id -u)" -ne 0 ] && SUDO="sudo"

FILES=$($SUDO grep -rlE "alurkasku\.com|/var/www/cashvio" \
  /etc/nginx/sites-enabled /etc/nginx/sites-available /etc/nginx/conf.d /etc/nginx/nginx.conf 2>/dev/null)
echo "Candidate files:"
echo "$FILES"
[ -z "$FILES" ] && { echo "ERROR: no nginx config mentions alurkasku/cashvio"; exit 2; }

PATCH_OK=0
for CONF in $FILES; do
  BACKUP="$CONF.bak.$(date +%s)"
  $SUDO cp "$CONF" "$BACKUP"
  echo "=== Patching $CONF ==="
  set +e
  $SUDO python3 - "$CONF" <<'PYEOF'
import re, sys, pathlib

p = pathlib.Path(sys.argv[1])
s = p.read_text()

if "# managed-by: nginx-fix" in s:
    print("Already patched, skipping.")
    sys.exit(0)

out, pos, patched = [], 0, False
for m in re.finditer(r"(?m)^([ \t]*)server\s*\{", s):
    depth, i = 1, m.end()
    while i < len(s) and depth:
        if s[i] == "{":
            depth += 1
        elif s[i] == "}":
            depth -= 1
        i += 1
    body = s[m.end():i - 1]
    if not re.search(r"alurkasku\.com|/var/www/cashvio", body):
        continue
    im = re.search(r"\n([ \t]+)\S", body)
    ind = im.group(1) if im else "    "
    block = (
        f"\n{ind}# managed-by: nginx-fix\n"
        f"{ind}location = /index.html {{\n"
        f"{ind}    add_header Cache-Control \"no-cache, must-revalidate\";\n"
        f"{ind}}}\n\n"
        f"{ind}location ^~ /assets/ {{\n"
        f"{ind}    add_header Cache-Control \"public, max-age=31536000, immutable\";\n"
        f"{ind}}}\n"
    )
    out.append(s[pos:i - 1] + block)
    pos = i - 1
    patched = True

if not patched:
    print("No matching server block here, unchanged.")
    sys.exit(0)

out.append(s[pos:])
p.write_text("".join(out))
print("Patched", p)
PYEOF
  RC=$?
  set -e
  if [ $RC -ne 0 ]; then
    echo "Patch failed ($RC), restoring backup."
    $SUDO cp "$BACKUP" "$CONF"
  else
    PATCH_OK=1
  fi
done

[ "$PATCH_OK" -eq 1 ] || { echo "ERROR: no file was patched"; exit 3; }

if ! $SUDO nginx -t; then
  echo "nginx -t FAILED - rolling back all backups."
  for CONF in $FILES; do
    B=$(ls -t "$CONF".bak.* 2>/dev/null | head -1)
    [ -n "$B" ] && $SUDO cp "$B" "$CONF"
  done
  exit 1
fi

$SUDO systemctl reload nginx
echo "Nginx reloaded."

# Dump effective config for remote inspection (pure bash, no python).
$SUDO nginx -T 2>/dev/null | head -c 40000 > /tmp/.nginx-diag || exit 0
$SUDO mv /tmp/.nginx-diag /var/www/cashvio/dist/nginx-diag.txt 2>/dev/null ||
  $SUDO install -m 644 /tmp/.nginx-diag /var/www/cashvio/dist/nginx-diag.txt
$SUDO chmod 644 /var/www/cashvio/dist/nginx-diag.txt 2>/dev/null || true
echo "Diag written."
