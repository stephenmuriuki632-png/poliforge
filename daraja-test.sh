#!/data/data/com.termux/files/usr/bin/bash

CONSUMER_KEY=qGQoTvnhtwIiFAsm2snx1SgGsnEHpq89bIIDYOgc2yiSXPZz
CONSUMER_SECRET=fGjZJk1Og51yTreX50FkW0kJxROJcXnE92KQUGJisYmt91AghM8iAbTRcaSeDn1G

AUTH=$(printf '%s:%s' "$CONSUMER_KEY" "$CONSUMER_SECRET" | base64 | tr -d '\n')

echo "Testing Daraja OAuth..."

curl -i \
  -H "Authorization: Basic $AUTH" \
  -H "Accept: application/json" \
  "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials"
