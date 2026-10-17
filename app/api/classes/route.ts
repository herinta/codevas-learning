import { NextRequest, NextResponse } from 'next/server';
import { ClassService } from '@/lib/services/class.service';
import { ClassCategory } from '@/lib/db/entities';

/**
 * GET /api/classes
 * Query param: ?category=LIVE_CODE | DRAG_DROP | QUIZ
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const categoryParam = searchParams.get('category');
    const category = categoryParam ? (categoryParam.toUpperCase() as ClassCategory) : undefined;

    const classes = await ClassService.getAllClasses(category);
    return NextResponse.json({
      success: true,
      data: classes,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to fetch classes',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
