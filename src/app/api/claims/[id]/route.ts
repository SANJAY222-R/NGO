import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { Claim, FoodPost } from "@/models";
import { sequelize } from "@/lib/sequelize";

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const session = await auth();
    if (!session?.user || session.user.role !== "NGO") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await request.json();

    if (body.status !== "COMPLETED") {
      return NextResponse.json({ error: "Invalid status update" }, { status: 400 });
    }

    const result = await sequelize.transaction(async (t) => {
      const claim = await Claim.findByPk(id, { transaction: t });
      
      if (!claim) {
        throw new Error("Claim not found");
      }

      if (claim.get('ngoId') !== session.user.id) {
        throw new Error("Unauthorized to update this claim");
      }

      // Update Claim status
      await claim.update({ 
        status: "COMPLETED",
        completedAt: new Date()
      }, { transaction: t });

      // Update associated FoodPost status
      const foodPostId = claim.get('foodPostId');
      if (foodPostId) {
        const post = await FoodPost.findByPk(foodPostId as string, { transaction: t });
        if (post) {
          await post.update({ status: "PICKED_UP" }, { transaction: t });
        }
      }

      return claim;
    });

    return NextResponse.json({ data: result }, { status: 200 });

  } catch (error: any) {
    console.error("PATCH /api/claims/[id] error:", error);
    if (error.message === "Claim not found" || error.message === "Unauthorized to update this claim") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
