export async function GET(req: Request) {
  const url = new URL(req.url);

  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    return Response.redirect(`${process.env.BASE_URL}/home.html`);
  }

  try {
    // Exchange code → token
    const tokenRes = await fetch(
      "https://api.faceit.com/auth/v1/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "authorization_code",
          code,
          client_id: "91174f46-9961-45a0-92ea-7e164eaf43e8",
          client_secret: "rlOrpt2FL0ghcp2tJ24UzK53AnEoSe8VOBPYkk2h",
          redirect_uri: `https://localhost:3000/api/auth/faceit/callback`,
        }),
      }
    );

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return Response.redirect(`${process.env.BASE_URL}/home.html`);
    }

    // Fetch FACEIT profile
    const profileRes = await fetch(
      "https://open.faceit.com/data/v4/players/me",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      }
    );

    const profile = await profileRes.json();

    // Store in cookie
    const res = Response.redirect(`${process.env.BASE_URL}/home.html`);

    res.headers.set(
      "Set-Cookie",
      `faceit_session=${encodeURIComponent(
        JSON.stringify(profile)
      )}; Path=/; HttpOnly; Secure`
    );

    return res;
  } catch (err) {
    return Response.redirect(`${process.env.BASE_URL}/home.html`);
  }
}