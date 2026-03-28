export async function GET() {
  const params = new URLSearchParams({
    client_id: "91174f46-9961-45a0-92ea-7e164eaf43e8",
    redirect_uri: `https://localhost:3000/api/auth/faceit/callback`,
    response_type: "code",
    scope: "openid profile",
  });

  return Response.redirect(
    `https://accounts.faceit.com/oauth/authorize?${params.toString()}`
  );
}