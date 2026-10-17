import { redirect } from "next/navigation";

/**
 * Route: /demo
 * Redirects visitors/recruiters to /demo/login with pre-configured demo credentials
 */
export default function DemoPage() {
  redirect("/demo/login");
}
