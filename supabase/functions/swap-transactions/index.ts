// MoneroSwap Transactions API
// Handles CRUD operations for swap transactions

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS, PUT, DELETE, PATCH',
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
    
    // Simple rate limiting check
    const clientIP = req.headers.get('x-forwarded-for') || 'unknown';
    
    if (req.method === 'GET') {
      // Get transactions for a wallet
      const walletAddress = url.searchParams.get('wallet');
      const limit = parseInt(url.searchParams.get('limit') || '50');
      const offset = parseInt(url.searchParams.get('offset') || '0');
      const status = url.searchParams.get('status');
      
      if (!walletAddress) {
        return new Response(JSON.stringify({ 
          error: { code: 'MISSING_WALLET', message: 'Wallet address is required' } 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      let query = `SELECT * FROM swap_transactions WHERE wallet_address = '${walletAddress}'`;
      if (status && status !== 'all') {
        query += ` AND status = '${status}'`;
      }
      query += ` ORDER BY created_at DESC LIMIT ${limit} OFFSET ${offset}`;
      
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ query })
      });
      
      // Use direct REST API instead
      const txResponse = await fetch(
        `${supabaseUrl}/rest/v1/swap_transactions?wallet_address=eq.${walletAddress}&order=created_at.desc&limit=${limit}&offset=${offset}${status && status !== 'all' ? `&status=eq.${status}` : ''}`,
        {
          headers: {
            'Authorization': `Bearer ${supabaseKey}`,
            'apikey': supabaseKey
          }
        }
      );
      
      const transactions = await txResponse.json();
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: transactions,
        pagination: { limit, offset }
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (req.method === 'POST') {
      // Create new transaction
      const body = await req.json();
      const { 
        wallet_address, 
        from_token, 
        to_token, 
        from_amount, 
        to_amount, 
        rate,
        from_chain_id,
        to_chain_id,
        slippage,
        ring_size
      } = body;
      
      // Validation
      if (!wallet_address || !from_token || !to_token || !from_amount) {
        return new Response(JSON.stringify({ 
          error: { code: 'VALIDATION_ERROR', message: 'Missing required fields' } 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      // Amount validation
      if (parseFloat(from_amount) <= 0) {
        return new Response(JSON.stringify({ 
          error: { code: 'INVALID_AMOUNT', message: 'Amount must be greater than 0' } 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const txData = {
        wallet_address,
        from_token,
        to_token,
        from_amount: parseFloat(from_amount),
        to_amount: parseFloat(to_amount || 0),
        rate: parseFloat(rate || 0),
        from_chain_id: from_chain_id || 1,
        to_chain_id: to_chain_id || 1,
        slippage: parseFloat(slippage || 1),
        ring_size: ring_size || 16,
        status: 'pending'
      };
      
      const insertResponse = await fetch(`${supabaseUrl}/rest/v1/swap_transactions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(txData)
      });
      
      const newTx = await insertResponse.json();
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: Array.isArray(newTx) ? newTx[0] : newTx 
      }), {
        status: 201,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    if (req.method === 'PATCH') {
      // Update transaction status
      const body = await req.json();
      const { id, status, tx_hash } = body;
      
      if (!id) {
        return new Response(JSON.stringify({ 
          error: { code: 'MISSING_ID', message: 'Transaction ID is required' } 
        }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' }
        });
      }
      
      const updateData: Record<string, unknown> = { updated_at: new Date().toISOString() };
      if (status) {
        updateData.status = status;
        if (status === 'completed') {
          updateData.completed_at = new Date().toISOString();
        }
      }
      if (tx_hash) updateData.tx_hash = tx_hash;
      
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/swap_transactions?id=eq.${id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${supabaseKey}`,
          'apikey': supabaseKey,
          'Content-Type': 'application/json',
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(updateData)
      });
      
      const updatedTx = await updateResponse.json();
      
      return new Response(JSON.stringify({ 
        success: true, 
        data: Array.isArray(updatedTx) ? updatedTx[0] : updatedTx 
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    return new Response(JSON.stringify({ 
      error: { code: 'METHOD_NOT_ALLOWED', message: 'Method not allowed' } 
    }), {
      status: 405,
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
