import { query } from "@/lib/db/pool";
import { createHash } from "crypto";

export interface VisitorStats {
  totalLandingVisits: number;
  uniqueLandingVisitors: number;
  landingVisitorsToday: number;
  landingVisitorsOnline: number;
}

export class AnalyticsService {
  /**
   * Record an anonymous landing page visit without login
   */
  static async recordVisit(data: {
    visitorId: string;
    path?: string;
    userAgent?: string;
    ip?: string;
  }): Promise<void> {
    const visitorId = data.visitorId.trim();
    const path = (data.path || "/").trim();
    const userAgent = data.userAgent ? data.userAgent.slice(0, 500) : null;
    const ipHash = data.ip ? createHash("sha256").update(data.ip).digest("hex") : null;

    // Throttle duplicate records for the same visitor & path within 5 minutes
    const recent = await query<{ id: string }>(
      `SELECT id FROM site_visits
       WHERE visitor_id = $1 AND path = $2 AND visited_at >= NOW() - INTERVAL '5 minutes'
       LIMIT 1`,
      [visitorId, path]
    );

    if (recent.length > 0) {
      // Already recorded recently, update timestamp
      await query(
        `UPDATE site_visits SET visited_at = CURRENT_TIMESTAMP WHERE id = $1`,
        [recent[0].id]
      );
      return;
    }

    // Insert new visit
    await query(
      `INSERT INTO site_visits (visitor_id, path, user_agent, ip_hash, visited_at)
       VALUES ($1, $2, $3, $4, CURRENT_TIMESTAMP)`,
      [visitorId, path, userAgent, ipHash]
    );
  }

  /**
   * Get landing page visitor statistics for admin dashboard
   */
  static async getVisitorStats(): Promise<VisitorStats> {
    const [row] = await query<{
      total_landing_visits: string;
      unique_landing_visitors: string;
      landing_visitors_today: string;
      landing_visitors_online: string;
    }>(
      `SELECT
         count(*)::text as total_landing_visits,
         count(DISTINCT visitor_id)::text as unique_landing_visitors,
         count(DISTINCT visitor_id) FILTER (WHERE visited_at >= CURRENT_DATE)::text as landing_visitors_today,
         count(DISTINCT visitor_id) FILTER (WHERE visited_at >= NOW() - INTERVAL '15 minutes')::text as landing_visitors_online
       FROM site_visits`
    );

    return {
      totalLandingVisits: parseInt(row?.total_landing_visits || "0", 10),
      uniqueLandingVisitors: parseInt(row?.unique_landing_visitors || "0", 10),
      landingVisitorsToday: parseInt(row?.landing_visitors_today || "0", 10),
      landingVisitorsOnline: parseInt(row?.landing_visitors_online || "0", 10),
    };
  }
}
