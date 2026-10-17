import { NextRequest, NextResponse } from "next/server";
import { verifyAdminRequest } from "@/lib/auth/admin-guard";
import { UserService } from "@/lib/services/user.service";

/**
 * GET /api/admin/users
 * Search and paginate users
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.isAdmin || auth.errorResponse) {
      return auth.errorResponse!;
    }

    const { searchParams } = new URL(req.url);
    const search = searchParams.get("search") || undefined;
    const role = searchParams.get("role") || undefined;
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = parseInt(searchParams.get("limit") || "20", 10);
    const offset = (page - 1) * limit;

    const result = await UserService.getUsersList({
      search,
      role,
      limit,
      offset,
    });

    return NextResponse.json({
      success: true,
      data: {
        users: result.users,
        total: result.total,
        page,
        limit,
        totalPages: Math.ceil(result.total / limit),
      },
    });
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("[GET /api/admin/users Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil daftar pengguna",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * Admin creates a new user
 */
export async function POST(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.isAdmin || auth.errorResponse) {
      return auth.errorResponse!;
    }

    const body = await req.json();
    const { username, email, password, full_name, role } = body;

    if (!username || !email || !password) {
      return NextResponse.json(
        { success: false, message: "Username, email, dan password wajib diisi." },
        { status: 400 }
      );
    }

    // Check existing
    const existingEmail = await UserService.findByEmail(email);
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: "Email sudah terdaftar." },
        { status: 409 }
      );
    }

    const existingUser = await UserService.findByUsername(username);
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "Username sudah digunakan." },
        { status: 409 }
      );
    }

    const newUser = await UserService.createUser({
      username,
      email,
      password,
      full_name,
    });

    if (role === "ADMIN") {
      await UserService.updateUserRole(newUser.id, "ADMIN");
      newUser.role = "ADMIN";
    }

    return NextResponse.json({
      success: true,
      message: `User @${newUser.username} berhasil dibuat!`,
      data: newUser,
    });
  } catch (error) {
    console.error("[POST /api/admin/users Error]:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat pengguna baru",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
