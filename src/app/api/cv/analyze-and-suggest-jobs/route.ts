import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: Request) {
    try {
        const session = await getServerSession(authOptions) as any;
        const token = session?.user?.accessToken;

        const formData = await req.formData();
        
        const headers: any = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://cvanalysisapp.runasp.net/api"}/Cv/analyze-and-suggest-jobs`, {
            method: "POST",
            body: formData,
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
