import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: Request, { params }: { params: Promise<{ fileName: string }> }) {
    try {
        const { fileName } = await params;
        const session = await getServerSession(authOptions) as any;
        const token = session?.user?.accessToken;

        const headers: any = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;

        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://cvanalysisapp.runasp.net/api"}/Cv/download/${fileName}`, {
            method: "GET",
            headers: headers
        });

        if (!res.ok) {
            return new NextResponse("File not found", { status: res.status });
        }

        const arrayBuffer = await res.arrayBuffer();

        return new NextResponse(arrayBuffer, {
            headers: {
                "Content-Type": res.headers.get("Content-Type") || "application/octet-stream",
                "Content-Disposition": res.headers.get("Content-Disposition") || `attachment; filename="${fileName}"`
            }
        });
    } catch (error: any) {
        return new NextResponse(error.message || "Internal Server Error", { status: 500 });
    }
}

