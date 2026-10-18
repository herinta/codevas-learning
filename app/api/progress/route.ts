import { NextRequest, NextResponse } from 'next/server';
import { ProgressService } from '@/lib/services/progress.service';
import { ProgressStatus } from '@/lib/db/entities';
import { verifySessionToken, AUTH_COOKIE_NAME } from '@/lib/auth/session';

/**
 * GET /api/progress?userId=...
 * Authenticated: Returns progress of the logged-in user (or any user if caller is ADMIN)
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

    // Prevent IDOR: Normal users can only view their own progress
    if (requestedUserId !== payload.userId && payload.role !== 'ADMIN') {
      return NextResponse.json(
        { success: false, message: 'Akses ditolak: Anda tidak diizinkan melihat progres pengguna lain.' },
        { status: 403 }
      );
    }

    const progress = await ProgressService.getUserProgress(requestedUserId);
    return NextResponse.json({
      success: true,
      data: progress,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch user progress',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/progress
 * Authenticated: Saves progress strictly for the logged-in user (prevents IDOR)
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
    const { challengeId, status, codeSnapshot } = body;

    if (!challengeId || !status) {
      return NextResponse.json(
        {
          success: false,
          message: 'challengeId and status are required fields',
        },
        { status: 400 }
      );
    }

    // Always enforce the authenticated user's ID
    const updated = await ProgressService.upsertProgress(
      payload.userId,
      challengeId,
      status as ProgressStatus,
      codeSnapshot
    );

    return NextResponse.json({
      success: true,
      data: updated,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to update progress',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
