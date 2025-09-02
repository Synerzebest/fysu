import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {  
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(orders);
  } catch (err: any) {
    console.error("Erreur fetch orders:", err.message);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
