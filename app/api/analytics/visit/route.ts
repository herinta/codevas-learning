import { NextRequest, NextResponse } from "next/server";
import { AnalyticsService } from "@/lib/services/analytics.service";
import { randomUUID } from "crypto";

const VISITOR_COOKIE_NAME = "codevas_vid";

/**
 * POST /api/analytics/visit
 * Public endpoint to track landing page visitors without login
 */
export async function POST(req: NextRequest) {
  try {
    const cookie = req.cookies.get(VISITOR_COOKIE_NAME);
    let visitorId = cookie?.value;
    let isNewVisitor = false;

    if (!visitorId) {
      visitorId = `v_${randomUUID().replace(/-/g, "")}`;
      isNewVisitor = true;
    }

    let path = "/";
    try {
      const body = await req.json();
      if (body.path && typeof body.path === "string") {
        path = body.path;
      }
    } catch {
      // Body is optional
    }

    const userAgent = req.headers.get("user-agent") || undefined;
    const forwarded = req.headers.get("x-forwarded-for");
    const ip = forwarded ? forwarded.split(",")[0].trim() : req.headers.get("x-real-ip") || "127.0.0.1";

    // Record visit asynchronously in background
    AnalyticsService.recordVisit({
      visitorId,
      path,
      userAgent,
      ip,
    }).catch((err) => console.error("[Analytics Record Error]:", err));

    const response = NextResponse.json({
      success: true,
      visitorId,
    });

    if (isNewVisitor) {
      // Store anonymous visitor ID cookie for 1 year
      response.cookies.set(VISITOR_COOKIE_NAME, visitorId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return response;
  } catch (error: any) {
    if (error && typeof error === "object" && "digest" in error) {
      throw error;
    }
    console.error("[POST /api/analytics/visit Error]:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
