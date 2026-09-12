export async function GET() {
  try {
    const key = process.env.MPESA_CONSUMER_KEY;
    const secret = process.env.MPESA_CONSUMER_SECRET;

    if (!key || !secret) {
      return new Response("ERROR: M-Pesa credentials are missing", {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const auth = Buffer.from(`${key}:${secret}`).toString("base64");

    const response = await fetch(
      "https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials",
      {
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      }
    );

    const body = await response.text();

    return new Response(
      `Daraja HTTP ${response.status}\n\n${body}`,
      {
        status: response.ok ? 200 : 500,
        headers: { "Content-Type": "text/plain" },
      }
    );
  } catch (error) {
    return new Response(
      `SERVER ERROR\n\n${
        error instanceof Error ? error.stack || error.message : String(error)
      }`,
      {
        status: 500,
        headers: { "Content-Type": "text/plain" },
      }
    );
  }
}
