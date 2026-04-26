export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      include: {
        creator: { select: { id: true, name: true } },
        requirements: { include: { skill: true } }
      },
      orderBy: { createdAt: "desc" }
    });
    return NextResponse.json({ projects });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch projects" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { title, description, skills } = await req.json();

    if (!title || !description) {
      return NextResponse.json({ error: "Missing title or description" }, { status: 400 });
    }

    // Ensure skills exist or create them
    const skillRecords = await Promise.all(
      (skills || []).map(async (skillName: string) => {
        let skill = await prisma.skill.findUnique({ where: { name: skillName.toLowerCase() } });
        if (!skill) {
          skill = await prisma.skill.create({ data: { name: skillName.toLowerCase() } });
        }
        return skill;
      })
    );

    const project = await prisma.project.create({
      data: {
        title,
        description,
        creatorId: userId,
        requirements: {
          create: skillRecords.map((skill) => ({
            skillId: skill.id
          }))
        }
      },
      include: {
        requirements: { include: { skill: true } }
      }
    });

    return NextResponse.json({ project }, { status: 201 });
  } catch (error) {
    console.error("Project creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
