import { NextResponse } from "next/server";

// Receives the Google OAuth callback from the backend after successful Google auth.
// Forwards any query params (code, state, etc.) to the backend google-response endpoint
// and returns the resulting JSON (JWT token) to the browser.
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const backendUrl = `${process.env.NEXT_PUBLIC_API_URL}/ExternalAuth/google-response?${searchParams.toString()}`;

    const res = await fetch(backendUrl, {
      method: "GET",
      headers: { Accept: "application/json" },
    });

    const contentType = res.headers.get("content-type") ?? "";
    const data = contentType.includes("application/json")
      ? await res.json()
      : { message: await res.text() };

    if (!res.ok) {
      return NextResponse.json(
        { message: data.message ?? "External login verification failed" },
        { status: res.status }
      );
    }

    return NextResponse.json(data);
  } catch (error: any) {
    return NextResponse.json(
      { message: error.message ?? "Internal Server Error" },
      { status: 500 }
    );
  }
}
