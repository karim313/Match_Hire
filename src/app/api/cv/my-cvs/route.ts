import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
    try {
        const session = await getServerSession(authOptions) as any;
        const token = session?.user?.accessToken;

        const headers: any = { "Content-Type": "application/json" };
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://cvanalysisapp.runasp.net/api"}/Cv/my-cvs`, {
            method: "GET",
            headers: headers
        });
        
        let data;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
            data = await res.json();
        } else {
            data = { message: await res.text() || "Success" };
        }

        if (!res.ok) return NextResponse.json({ message: data.message }, { status: res.status });
        return NextResponse.json(data);
    } catch (error: any) {
        return NextResponse.json({ message: error.message || "Internal Server Error" }, { status: 500 });
    }
}
