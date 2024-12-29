import {NextRequest} from "next/server";
import {createGatewayOnEdgeRuntime} from "@lobehub/chat-plugins-gateway";

export async function OPTIONS(req: NextRequest) {
  return createGatewayOnEdgeRuntime()(req)
}

export async function POST(req: Request) {
  console.log('SearXNG Search Plugin Gateway for LobeChat', process.env.NODE_ENV)
  return createGatewayOnEdgeRuntime()(req)
}
