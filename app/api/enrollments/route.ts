import { NextRequest, NextResponse } from 'next/server';
import { EnrollmentService } from '@/lib/services/enrollment.service';
import { verifySessionToken, AUTH_COOKIE_NAME } from '@/lib/auth/session';

/**
 * GET /api/enrollments?userId=...
 * Authenticated: Returns enrollments of the logged-in user (or any user if caller is ADMIN)
 */
export async function GET(request: NextRequest) {
  try {
    const cookie = request.cookies.get(AUTH_COOKIE_NAME);
    if (!cookie?.value) {
      return NextResponse.json(
        { success: false, message: 'Autentikasi diperlukan. Silakan login terlebih dahulu.' },
        { status: 401 }
      );
    }

    const payload = verifySessionToken(cookie.value);
    if (!payload?.userId) {
      return NextResponse.json(
        { success: false, message: 'Sesi tidak valid atau telah berakhir.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const requestedUserId = searchParams.get('userId') || payload.userId;

    // Prevent IDOR: Normal users can only view their own enrollments
    if (requestedUserId !== payload.userId && payload.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak: Anda tidak diizinkan melihat data kelas pengguna lain.' },
        { status: 403 }
      );
    }

    const enrolledClasses = await EnrollmentService.getUserEnrolledClasses(requestedUserId);
    const enrolledClassIds = enrolledClasses.map((c) => c.id);

    return NextResponse.json({
      success: true,
      data: {
        enrolledClasses,
        enrolledClassIds,
      },
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch user enrollments',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/enrollments
 * Authenticated: Enrolls the logged-in user strictly (prevents IDOR)
 */
export async function POST(request: NextRequest) {
  try {
    const cookie = request.cookies.get(AUTH_COOKIE_NAME);
    if (!cookie?.value) {
      return NextResponse.json(
        { success: false, message: 'Autentikasi diperlukan. Silakan login terlebih dahulu.' },
        { status: 401 }
      );
    }

    const payload = verifySessionToken(cookie.value);
    if (!payload?.userId) {
      return NextResponse.json(
        { success: false, message: 'Sesi tidak valid atau telah berakhir.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { classId } = body;

    if (!classId) {
      return NextResponse.json(
        { success: false, message: 'classId is required' },
        { status: 400 }
      );
    }

    const enrollment = await EnrollmentService.enrollUser(payload.userId, classId);
    return NextResponse.json({
      success: true,
      message: 'Successfully enrolled in class',
      data: enrollment,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to enroll in class',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
