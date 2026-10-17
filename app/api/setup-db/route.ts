import { NextResponse } from 'next/server';
import { setupDatabase } from '@/lib/db/setup';
import { pool } from '@/lib/db/pool';

/**
 * GET /api/setup-db
 * Checks database health and table status
 */
export async function GET() {
  try {
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
 * Creates tables from entity code and seeds initial data
 */
export async function POST() {
  try {
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
