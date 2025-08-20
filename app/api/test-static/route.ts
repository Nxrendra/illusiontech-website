export async function GET() {
  return new Response(JSON.stringify({ 
    success: true, 
    message: 'Static API route working',
    timestamp: new Date().toISOString()
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
}
