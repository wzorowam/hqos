export async function GET() {
  return Response.json({
    status: "ok",
    service: "hqos",
    time: new Date().toISOString(),
  });
}
