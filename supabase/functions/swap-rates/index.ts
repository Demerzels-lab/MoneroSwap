// MoneroSwap Exchange Rates API
// Provides live exchange rates with rate limiting

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

// Simulated rates - in production, fetch from external APIs
const BASE_RATES: Record<string, number> = {
  'ETH': 1800,
  'SOL': 100,
  'XMR': 150,
  'USDC': 1,
  'USDT': 1,
  'DAI': 1,
  'BNB': 300,
  'MATIC': 0.8,
  'AVAX': 35,
  'LINK': 15,
  'UNI': 7,
  'AAVE': 90,
  'WBTC': 43000
};

function getRate(from: string, to: string): number {
  const fromUsd = BASE_RATES[from.toUpperCase()] || 1;
  const toUsd = BASE_RATES[to.toUpperCase()] || 1;
  return fromUsd / toUsd;
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const from = url.searchParams.get('from')?.toUpperCase();
    const to = url.searchParams.get('to')?.toUpperCase();
    const amount = parseFloat(url.searchParams.get('amount') || '1');
    
    // Rate limiting by IP
    const clientIP = req.headers.get('x-forwarded-for')?.split(',')[0] || 'unknown';
    const rateLimitKey = `rate_${clientIP}`;
    
    // Check rate limit (100 requests per minute)
    const now = new Date();
    const windowStart = new Date(now.getTime() - 60000); // 1 minute ago
    
    const rateLimitResponse = await fetch(
      `${supabaseUrl}/rest/v1/rate_limits?wallet_address=eq.${rateLimitKey}&endpoint=eq.rates&window_start=gte.${windowStart.toISOString()}`,
      {
        headers: { 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey }
      }
    );
    
    const rateLimitData = await rateLimitResponse.json();
    
    if (Array.isArray(rateLimitData) && rateLimitData.length > 0 && rateLimitData[0].request_count >= 100) {
      return new Response(JSON.stringify({
        error: { code: 'RATE_LIMITED', message: 'Too many requests. Please wait a moment.' }
      }), {
        status: 429,
        headers: { ...corsHeaders, 'Content-Type': 'application/json', 'Retry-After': '60' }
      });
    }
    
    // Update rate limit counter
    if (Array.isArray(rateLimitData) && rateLimitData.length > 0) {
      await fetch(`${supabaseUrl}/rest/v1/rate_limits?id=eq.${rateLimitData[0].id}`, {
        method: 'PATCH',
        headers: { 
          'Authorization': `Bearer ${supabaseKey}`, 
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ request_count: rateLimitData[0].request_count + 1 })
      });
    } else {
      await fetch(`${supabaseUrl}/rest/v1/rate_limits`, {
        method: 'POST',
        headers: { 
          'Authorization': `Bearer ${supabaseKey}`, 
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          wallet_address: rateLimitKey, 
          endpoint: 'rates',
          request_count: 1,
          window_start: now.toISOString()
        })
      });
    }
    
    // If specific pair requested
    if (from && to) {
      const rate = getRate(from, to);
      const outputAmount = amount * rate;
      
      // Add small random variance to simulate real market
      const variance = 1 + (Math.random() - 0.5) * 0.002; // ±0.1%
      
      return new Response(JSON.stringify({
        success: true,
        data: {
          from,
          to,
          rate: rate * variance,
          input_amount: amount,
          output_amount: outputAmount * variance,
          price_impact: amount > 10000 ? 0.5 : amount > 1000 ? 0.1 : 0.01,
          timestamp: now.toISOString(),
          expires_at: new Date(now.getTime() + 30000).toISOString() // 30 seconds
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    // Return all rates
    const allRates: Record<string, { usd: number; change_24h: number }> = {};
    for (const [token, usd] of Object.entries(BASE_RATES)) {
      allRates[token] = {
        usd,
        change_24h: (Math.random() - 0.5) * 10 // Random ±5% change
      };
    }
    
    return new Response(JSON.stringify({
      success: true,
      data: {
        rates: allRates,
        timestamp: now.toISOString()
      }
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
    
  } catch (error) {
    return new Response(JSON.stringify({
      error: { code: 'INTERNAL_ERROR', message: error.message }
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
});
