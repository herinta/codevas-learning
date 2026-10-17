import { NextRequest, NextResponse } from 'next/server';
import { ClassService } from '@/lib/services/class.service';

/**
 * GET /api/classes/[id]
 * Returns class details with all syllabus levels/challenges
 */
export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const courseClass = await ClassService.getClassWithChallenges(id);

    if (!courseClass) {
      return NextResponse.json(
        { success: false, message: `Class with id '${id}' not found` },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: courseClass,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch class details',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
