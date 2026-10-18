import { NextRequest, NextResponse } from 'next/server';
import { setupDatabase } from '@/lib/db/setup';
import { pool } from '@/lib/db/pool';
import { verifyAdminRequest } from '@/lib/auth/admin-guard';

/**
 * GET /api/setup-db
 * Checks database health and table status (Protected: Admin only)
 */
export async function GET(req: NextRequest) {
  try {
    const auth = await verifyAdminRequest(req);
    if (!auth.isAdmin || auth.errorResponse) {
      return auth.errorResponse!;
    }

    const client = await pool.connect();
    try {
      const res = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public' 
        ORDER BY table_name;
      `);
      const tableNames = res.rows.map((r: { table_name: string }) => r.table_name);
      return NextResponse.json({
        success: true,
        message: 'Connected to PostgreSQL successfully',
        database: 'codevas_db',
        existingTables: tableNames,
      });
    } finally {
      client.release();
    }
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Database connection failed',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

/**
 * POST /api/setup-db
 * Creates tables from entity code and seeds initial data (Protected: Admin only, disabled in production)
 */
export async function POST(req: NextRequest) {
  try {
    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json(
        {
          success: false,
          message: 'Akses ditolak: Setup/reset database via web API dinonaktifkan di lingkungan produksi. Gunakan CLI scripts/setup-db.mjs.',
        },
        { status: 403 }
      );
    }

    const auth = await verifyAdminRequest(req);
    if (!auth.isAdmin || auth.errorResponse) {
      return auth.errorResponse!;
    }

    const result = await setupDatabase();
    return NextResponse.json({
      success: true,
      message: 'Database tables and initial curriculum created successfully!',
      result,
    });
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        message: 'Failed to create database tables from entity code',
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}

