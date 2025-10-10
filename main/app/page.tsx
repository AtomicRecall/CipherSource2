import { redirect } from "next/navigation";

export default function Home() {
  // Redirect to the home page when no team_id is provided
  redirect("/home");
}
