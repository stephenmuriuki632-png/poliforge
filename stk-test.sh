CONSUMER_KEY=qGQoTvnhtwIiFAsm2snx1SgGsnEHpq89bIIDYOgc2yiSXPZz
CONSUMER_SECRET=fGjZJk1Og51yTreX50FkW0kJxROJcXnE92KQUGJisYmt91AghM8iAbTRcaSeDn1G
SHORTCODE="174379"
PASSKEY="bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919"
PHONE="254717118243"

TIMESTAMP=$(date '+%Y%m%d%H%M%S')
PASSWORD=$(printf '%s%s%s' "$SHORTCODE" "$PASSKEY" "$TIMESTAMP" | base64 | tr -d '\n')

AUTH=$(printf '%s:%s' "$CONSUMER_KEY" "$CONSUMER_SECRET" | base64 | tr -d '\n')

TOKEN=$(curl -s \
  -H "Authorization: Basic $AUTH" \
  -H "Accept: application/json" \
  "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials")

ACCESS_TOKEN=$(printf '%s' "$TOKEN" | sed -n 's/.*"access_token":"\([^"]*\)".*/\1/p')

curl -s -X POST \
  "https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest" \
  -H "Authorization: Bearer $ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d "{
    \"BusinessShortCode\": \"$SHORTCODE\",
    \"Password\": \"$PASSWORD\",
    \"Timestamp\": \"$TIMESTAMP\",
    \"TransactionType\": \"CustomerPayBillOnline\",
    \"Amount\": 1,
    \"PartyA\": \"$PHONE\",
    \"PartyB\": \"$SHORTCODE\",
    \"PhoneNumber\": \"$PHONE\",
    \"CallBackURL\": \"https://example.com/callback\",
    \"AccountReference\": \"PoliForge\",
    \"TransactionDesc\": \"PoliForge test payment\"
  }"
