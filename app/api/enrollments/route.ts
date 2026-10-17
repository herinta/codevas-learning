import { NextRequest, NextResponse } from 'next/server';
import { EnrollmentService } from '@/lib/services/enrollment.service';

/**
 * GET /api/enrollments?userId=...
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'userId query parameter is required' },
        { status: 400 }
      );
    }

    const enrolledClasses = await EnrollmentService.getUserEnrolledClasses(userId);
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
 * Body: { userId, classId }
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userId, classId } = body;

    if (!userId || !classId) {
      return NextResponse.json(
        { success: false, message: 'userId and classId are required' },
        { status: 400 }
      );
    }

    const enrollment = await EnrollmentService.enrollUser(userId, classId);
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
