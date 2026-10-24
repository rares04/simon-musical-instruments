#!/bin/bash
# Live check of the legacy .html redirects (PR #6) and key pages. Usage: SITE_URL=https://… bash scripts/seo/check-legacy-redirects.sh
S=${SITE_URL:-https://simoninstruments.com}; fail=0
dest() { case "$1" in galery.html) echo /gallery;; contact.html) echo /contact;; *) echo "";; esac; }
check() { # path expected_code expected_location
  read -r code loc < <(curl -s -o /dev/null -w "%{http_code} %{redirect_url}" --max-time 20 "$S$1")
  if [ "$code" = "$2" ] && [ "$loc" = "$3" ]; then echo "OK   $1 -> $code $loc"; else echo "FAIL $1 -> $code $loc (want $2 $3)"; fail=1; fi
}
check /index.html 308 "$S/"
for l in en ro de fr nl; do for f in home.html about-us.html galery.html contact.html; do check "/$l/$f" 308 "$S/$l$(dest $f)"; done; done
echo "--- spot checks (final status after redirects)"
for p in /en /ro /en/gallery "/en/gallery/Cello-4-4(10)" /en/faq /api/health; do
  c=$(curl -s -o /dev/null -w "%{http_code}" -L --max-time 30 "$S$p"); [ "$c" = "200" ] && echo "OK   $p -> $c" || { echo "FAIL $p -> $c"; fail=1; }
done
echo "--- final-hop of a legacy URL lands on a 200 page"
c=$(curl -s -o /dev/null -w "%{http_code} %{url_effective}" -L --max-time 30 "$S/de/galery.html"); echo "     /de/galery.html -L -> $c"
exit $fail
