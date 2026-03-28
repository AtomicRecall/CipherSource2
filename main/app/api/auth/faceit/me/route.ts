export async function GET(req: Request) {
  const cookie = req.headers.get("cookie") || "";
  const match = cookie.match(/faceit_session=([^;]+)/);

  if (!match) {
    return new Response(JSON.stringify({ loggedIn: false }), {
      status: 401,
    });
  }

  const profile = JSON.parse(decodeURIComponent(match[1]));

  return new Response(
    JSON.stringify({
      loggedIn: true,
      profile,
    }),
    {
      headers: { "Content-Type": "application/json" },
    }
  );
}