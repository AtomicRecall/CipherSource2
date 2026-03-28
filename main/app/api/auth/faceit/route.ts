export async function GET() {
  const params = new URLSearchParams({
    client_id: "fc47747f-a252-4e38-b3be-028626a8a06e",
    redirect_uri: `https://cipher.onl/api/auth/faceit/callback`,
    response_type: "code",
    scope: "openid profile",
  });

  return Response.redirect(
    `https://accounts.faceit.com/oauth/authorize?${params.toString()}`
  );
}