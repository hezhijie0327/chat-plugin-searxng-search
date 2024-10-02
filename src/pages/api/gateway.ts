export const config = {
  runtime: 'edge',
};

export default async (req: Request) => {
  const { createGatewayOnEdgeRuntime } = await import('@lobehub/chat-plugins-gateway');

  return createGatewayOnEdgeRuntime()(req);
};
