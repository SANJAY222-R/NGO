import { NextResponse } from "next/server";
import { auth as nextAuth } from "../../../auth";
import { Claim, FoodPost } from "../../../models";
import { claimSchema } from "../../../lib/validations";
import { sequelize } from "../../../lib/sequelize";

export async function GET(request: Request) {
  try {
    const session = await nextAuth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Role-based filtering
    const whereClause: any = {};
    if (session.user.role === "NGO") {
      whereClause.ngoId = session.user.id;
    }
    // Donors shouldn't directly access all claims without going through their own posts,
    // but for simplicity, we'll allow admins or NGOs to view their claims.
    
    const claims = await Claim.findAll({
      where: whereClause,
      include: [{ model: FoodPost }],
      order: [["claimedAt", "DESC"]],
    });

    return NextResponse.json({ data: claims });
  } catch (error) {
    console.error("GET /api/claims error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const session = await nextAuth();
    if (!session?.user || session.user.role !== "NGO") {
      return NextResponse.json({ error: "Forbidden: Only NGOs can claim food" }, { status: 403 });
    }

    const body = await request.json();
    
    // Zod Validation
    const validation = claimSchema.safeParse(body);
    if (!validation.success) {
      return NextResponse.json({ error: "Validation failed", details: validation.error.format() }, { status: 400 });
    }

    const { foodPostId } = validation.data;

    // Use a transaction to ensure food isn't double-claimed
    const result = await sequelize.transaction(async (t) => {
      const foodPost = await FoodPost.findByPk(foodPostId, { transaction: t });
      
      if (!foodPost) {
        throw new Error("Food post not found");
      }
      
      if (foodPost.get("status") !== "AVAILABLE") {
        throw new Error("Food post is no longer available");
      }

      // Create the claim
      const newClaim = await Claim.create({
        foodPostId,
        ngoId: session.user.id,
        status: "PENDING",
      }, { transaction: t });

      // Update food post status
      await foodPost.update({ status: "RESERVED" }, { transaction: t });

      return newClaim;
    });

    return NextResponse.json({ data: result }, { status: 201 });
  } catch (error: any) {
    console.error("POST /api/claims error:", error);
    if (error.message === "Food post not found" || error.message === "Food post is no longer available") {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
