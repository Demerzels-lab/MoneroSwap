// MoneroSwap Analytics API
// Provides analytics data for dashboard

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Max-Age': '86400',
  'Access-Control-Allow-Credentials': 'false'
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const url = new URL(req.url);
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const endpoint = url.searchParams.get('type') || 'overview';
    const walletAddress = url.searchParams.get('wallet');
    const days = parseInt(url.searchParams.get('days') || '30');
    
    if (endpoint === 'overview') {
      // Get overall platform stats
      const [totalTxResponse, completedTxResponse, tokenStatsResponse] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/swap_transactions?select=count`, {
          headers: { 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey, 'Prefer': 'count=exact' }
        }),
        fetch(`${supabaseUrl}/rest/v1/swap_transactions?status=eq.completed&select=count`, {
          headers: { 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey, 'Prefer': 'count=exact' }
        }),
        fetch(`${supabaseUrl}/rest/v1/token_stats?order=swap_count.desc&limit=5`, {
          headers: { 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey }
        })
      ]);
      
      const totalCount = totalTxResponse.headers.get('content-range')?.split('/')[1] || '0';
      const completedCount = completedTxResponse.headers.get('content-range')?.split('/')[1] || '0';
      const topTokens = await tokenStatsResponse.json();
      
      return new Response(JSON.stringify({
        success: true,
        data: {
          total_swaps: parseInt(totalCount),
          completed_swaps: parseInt(completedCount),
          success_rate: parseInt(totalCount) > 0 ? (parseInt(completedCount) / parseInt(totalCount) * 100).toFixed(1) : 0,
          top_tokens: topTokens
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (endpoint === 'wallet' && walletAddress) {
      // Get wallet-specific stats
      const [txResponse, volumeResponse] = await Promise.all([
        fetch(`${supabaseUrl}/rest/v1/swap_transactions?wallet_address=eq.${walletAddress}&select=count`, {
          headers: { 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey, 'Prefer': 'count=exact' }
        }),
        fetch(`${supabaseUrl}/rest/v1/swap_transactions?wallet_address=eq.${walletAddress}&status=eq.completed&select=from_amount,to_amount,from_token,to_token,created_at`, {
          headers: { 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey }
        })
      ]);
      
      const txCount = txResponse.headers.get('content-range')?.split('/')[1] || '0';
      const transactions = await volumeResponse.json();
      
      // Calculate token breakdown
      const tokenBreakdown: Record<string, number> = {};
      transactions.forEach((tx: { from_token: string; to_token: string }) => {
        tokenBreakdown[tx.from_token] = (tokenBreakdown[tx.from_token] || 0) + 1;
        tokenBreakdown[tx.to_token] = (tokenBreakdown[tx.to_token] || 0) + 1;
      });
      
      return new Response(JSON.stringify({
        success: true,
        data: {
          total_swaps: parseInt(txCount),
          completed_swaps: transactions.length,
          token_breakdown: tokenBreakdown,
          recent_activity: transactions.slice(0, 10)
        }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (endpoint === 'daily') {
      // Get daily analytics
      const dailyResponse = await fetch(
        `${supabaseUrl}/rest/v1/analytics_daily?order=date.desc&limit=${days}`,
        {
          headers: { 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey }
        }
      );
      
      const dailyData = await dailyResponse.json();
      
      return new Response(JSON.stringify({
        success: true,
        data: dailyData
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (endpoint === 'tokens') {
      // Get token statistics
      const tokenResponse = await fetch(
        `${supabaseUrl}/rest/v1/token_stats?order=total_volume.desc`,
        {
          headers: { 'Authorization': `Bearer ${supabaseKey}`, 'apikey': supabaseKey }
        }
      );
      
      const tokenData = await tokenResponse.json();
      
      return new Response(JSON.stringify({
        success: true,
        data: tokenData
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({
      error: { code: 'INVALID_ENDPOINT', message: 'Invalid analytics endpoint' }
    }), {
      status: 400,
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
