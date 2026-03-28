export async function GET(req: Request) {
  const url = new URL(req.url);

  const code = url.searchParams.get("code");
  const error = url.searchParams.get("error");

  if (error || !code) {
    return Response.redirect(`https://cipher.onl/home.html`);
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
          client_id: "fc47747f-a252-4e38-b3be-028626a8a06e",
          client_secret: "wIVJZ74QTGEPSvdvPkVWr0P0r4vj8t2zZdUzaUZg",
          redirect_uri: `https://cipher.onl/api/auth/faceit/callback`,
        }),
      }
    );

    const tokenData = await tokenRes.json();

    if (!tokenData.access_token) {
      return Response.redirect(`https://cipher.onl/home.html`);
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
    const res = Response.redirect(`https://cipher.onl/home.html`);

    res.headers.set(
      "Set-Cookie",
      `faceit_session=${encodeURIComponent(
        JSON.stringify(profile)
      )}; Path=/; HttpOnly; Secure`
    );

    return res;
  } catch (err) {
    return Response.redirect(`https://cipher.onl/home.html`);
  }
}