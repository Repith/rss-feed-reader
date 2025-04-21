import { NextResponse } from "next/server";
import { z } from "zod";
import { cookies } from "next/headers";
import { AuthService } from "@/src/infrastructure/services/AuthService";

const authService = new AuthService();

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const validation = loginSchema.safeParse(body);

    if (!validation.success) {
      return NextResponse.json(
        { error: validation.error.errors },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;
    const { token, user } = await authService.loginUser(
      email,
      password
    );

    (await cookies()).set({
      name: "auth-token",
      value: token,
      httpOnly: true,
      path: "/",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === "Invalid credentials"
    ) {
      return NextResponse.json(
        { error: error.message },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { error: "Login failed" },
      { status: 500 }
    );
  }
}
