import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { User } from "@/models";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { status } = await req.json(); // "VERIFIED" or "REJECTED"

    const ngo = await User.findByPk(id);
    if (!ngo || ngo.get("role") !== "NGO") {
      return NextResponse.json({ error: "NGO not found" }, { status: 404 });
    }

    await ngo.update({ verificationStatus: status });

    return NextResponse.json({ data: ngo });
  } catch (error) {
    console.error("POST /api/admin/ngos/[id]/verify error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
