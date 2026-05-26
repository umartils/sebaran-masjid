import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { NextResponse } from "next/server";

const userSchema = z.object({
  name: z.string().min(3, "Nama minimal 3 karakter"),

  email: z.string().email("Format email tidak valid"),

  nomorTelepon: z.string().min(10, "Nomor telepon minimal 10 digit"),

  role: z.enum(["Admin", "Relawan"], {
    message: "Role tidak valid",
  }),

  password: z.string().min(8, "Password minimal 8 karakter"),

  userInput: z.string().min(1, "User input wajib diisi"),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = userSchema.parse(body);

    const { name, email, nomorTelepon, role, password, userInput } =
      validatedData;

    // cek email
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "Email sudah terdaftar",
        },
        {
          status: 409,
        }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        nomorTelepon,
        role,
        password: hashedPassword,
        userInput,
      },
    });

    const { password: _password, ...userWithoutPassword } = newUser;

    return NextResponse.json(
      {
        success: true,
        message: "Registrasi berhasil",
        user: userWithoutPassword,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error(error);

    // zod validation error
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: error.errors[0].message,
          errors: error.errors,
        },
        {
          status: 400,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Terjadi kesalahan server",
      },
      {
        status: 500,
      }
    );
  }
}