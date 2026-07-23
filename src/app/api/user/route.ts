import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { NextResponse } from "next/server";

import { 
  userInputSchema, 
  userUpdateSchema 
} from "@/lib/validation";
import { success } from "zod/v4";

// const userSchema = z.object({
//   id: z.string().optional(),

//   name: z.string().min(3, "Nama minimal 3 karakter"),

//   email: z.string().email("Format email tidak valid"),

//   nomorTelepon: z.string().optional(),

//   role: z.string().optional(),

//   password: z.string().min(8, "Password minimal 8 karakter").optional(),

//   userInput: z.string().min(1, "User input wajib diisi"),
// });

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const validatedData = userInputSchema.parse(body);

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

    const hashedPassword = await bcrypt.hash(password ?? "", 10);

    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        nomorTelepon,
        role,
        password: hashedPassword || "",
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

export async function PUT(req: Request) {
  try {
    const body = await req.json();

    const validatedData = userUpdateSchema.parse(body);

    const { id, name, email, nomorTelepon, role, userInput } = validatedData;

    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser && existingUser.id !== id) {
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

    const existingUserInput = await prisma.user.findUnique({
      where: {
        id: userInput,
      },
    });

    if (!existingUserInput || existingUserInput.role !== "Admin") {
      return NextResponse.json(
        {
          success: false,
          message: "User Input tidak valid",
        },
        {
          status: 409,
        }
      )
    }

    const updatedUser = await prisma.user.update({
      data: {
        name,
        email,
        nomorTelepon,
        role,
      },
      where: {
        id,
      },
    });

    return NextResponse.json(
      {
      success: true,
      message: "User updated successfully",
      data: {
        name: updatedUser.name,
        email: updatedUser.email,
        userInput: updatedUser.userInput
      }
      },
      {
        status: 200,
      }
    );
  } catch (error) {
    console.log(error);
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