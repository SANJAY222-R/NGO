import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { FoodPost } from "@/models";
import { foodPostSchema } from "@/lib/validations";

export async function GET(request: Request) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Parse URL parameters for filtering (e.g., ?status=AVAILABLE)
    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status");

    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    if (session.user.role === "DONOR") {
      whereClause.donorId = session.user.id;
    }

    const posts = await FoodPost.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    });

    return NextResponse.json({ data: posts });
  } catch (error) {
    console.error("GET /api/food-posts error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "DONOR") {
      return NextResponse.json({ error: "Forbidden: Only donors can create posts" }, { status: 403 });
    }

    const body = await request.json();
    
    // Zod Validation
    const validation = foodPostSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed", details: validation.error.format() }, { status: 400 });
    }

    const newPost = await FoodPost.create({
      ...validation.data,
      donorId: session.user.id,
      status: "AVAILABLE",
    });

    return NextResponse.json({ data: newPost }, { status: 201 });
  } catch (error) {
    console.error("POST /api/food-posts error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
