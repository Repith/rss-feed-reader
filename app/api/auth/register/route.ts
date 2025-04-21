import { AuthService } from "@/src/infrastructure/services/AuthService";
import { NextResponse } from "next/server";
import { z } from "zod";

const authService = new AuthService();

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = registerSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password, name } = validation.data;
    const user = await authService.registerUser(
      email,
      password,
      name
    );

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "User already exists"
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Registration failed" },
      { status: 500 }
    );
  }
}
