import { NextRequest, NextResponse } from 'next/server';
import { ChallengeService } from '@/lib/services/challenge.service';

/**
 * GET /api/challenges/[id]
 * Returns challenge details with locked template and validation rule
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const challenge = await ChallengeService.getChallengeById(id);

    if (!challenge) {
      return NextResponse.json(
        { success: false, message: `Challenge with id '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: challenge,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch challenge details',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
