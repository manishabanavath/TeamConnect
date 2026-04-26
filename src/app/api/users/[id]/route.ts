export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";

export async function GET(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const user = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        role: true,
        skills: { include: { skill: true } },
        projects: { include: { requirements: { include: { skill: true } } } }
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ user });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
}

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const cookieStore = await cookies();
    const currentUserId = cookieStore.get("userId")?.value;

    if (currentUserId !== id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { bio, role, skills } = await req.json();

    // Ensure skills exist
    const skillRecords = await Promise.all(
      (skills || []).map(async (skillName: string) => {
        let skill = await prisma.skill.findUnique({ where: { name: skillName.toLowerCase() } });
        if (!skill) {
          skill = await prisma.skill.create({ data: { name: skillName.toLowerCase() } });
        }
        return skill;
      })
    );

    // Delete existing UserSkills to recreate them
    await prisma.userSkill.deleteMany({ where: { userId: id } });

    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        bio,
        role,
        skills: {
          create: skillRecords.map(skill => ({ skillId: skill.id }))
        }
      },
      include: {
        skills: { include: { skill: true } }
      }
    });

    return NextResponse.json({ user: updatedUser });
  } catch (error) {
    return NextResponse.json({ error: "Failed to update profile" }, { status: 500 });
  }
}
