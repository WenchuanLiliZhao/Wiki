import { NextRequest, NextResponse } from "next/server";
import { randomUUID } from "crypto";

export function GET(_req: NextRequest) {
  const root = process.env.DEVTOOLS_WORKSPACE_ROOT || process.cwd();
  const uuid = process.env.DEVTOOLS_WORKSPACE_UUID || randomUUID();

  return NextResponse.json({
    workspace: {
      root,
      uuid,
    },
  });
} 