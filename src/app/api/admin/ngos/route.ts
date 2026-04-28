import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { User } from "@/models";

export async function GET(req: Request) {
  try {
    const session = await auth();
    if (!session || session.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const ngos = await User.findAll({
      where: { role: "NGO" },
      order: [["createdAt", "DESC"]],
      attributes: { exclude: ['password'] }
    });

    return NextResponse.json({ data: ngos });
  } catch (error) {
    console.error("GET /api/admin/ngos error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
