import { NextResponse } from "next/server";

// Redirects browser directly to the backend's Google OAuth entry point.
// NEXT_PUBLIC_API_URL = http://cvanalysisapp.runasp.net/api
// so the full URL becomes: http://cvanalysisapp.runasp.net/api/ExternalAuth/google-login
export async function GET() {
  const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/ExternalAuth/google-login`;
  return NextResponse.redirect(backendUrl);
}
