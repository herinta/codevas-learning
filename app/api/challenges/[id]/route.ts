import { NextRequest, NextResponse } from 'next/server';
import { ChallengeService } from '@/lib/services/challenge.service';
import { verifySessionToken, AUTH_COOKIE_NAME } from '@/lib/auth/session';

/**
 * GET /api/challenges/[id]
 * Returns dynamic challenge details including question instructions, theory/materials, hints, and visual targets
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const cookie = request.cookies.get(AUTH_COOKIE_NAME);
    let userId: string | undefined = undefined;

    if (cookie?.value) {
      const payload = verifySessionToken(cookie.value);
      if (payload) {
        userId = payload.userId;
      }
    }

    const challenge = await ChallengeService.getChallengeById(id, userId);

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
