import { NextRequest, NextResponse } from 'next/server';
import { ProgressService } from '@/lib/services/progress.service';
import { ProgressStatus } from '@/lib/db/entities';

/**
 * GET /api/progress?userId=...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'Query parameter userId is required' },
        { status: 400 }
      );
    }

    const progress = await ProgressService.getUserProgress(userId);
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
 * Body: { userId, challengeId, status, codeSnapshot }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, challengeId, status, codeSnapshot } = body;

    if (!userId || !challengeId || !status) {
      return NextResponse.json(
        {
          success: false,
          message: 'userId, challengeId, and status are required fields',
        },
        { status: 400 }
      );
    }

    const updated = await ProgressService.upsertProgress(
      userId,
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
