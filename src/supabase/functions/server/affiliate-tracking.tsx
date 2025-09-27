import { Hono } from 'npm:hono';
import { cors } from 'npm:hono/cors';
import { createClient } from 'npm:@supabase/supabase-js@2';
import * as kv from './kv_store.tsx';

const app = new Hono();

// Enable CORS
app.use('*', cors({
  origin: '*',
  allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowHeaders: ['Content-Type', 'Authorization'],
}));

// Initialize Supabase client
const supabase = createClient(
  Deno.env.get('SUPABASE_URL') || '',
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || ''
);

interface ClickData {
  programId: string;
  productName: string;
  timestamp: string;
  userAgent: string;
  referrer: string;
  ipAddress?: string;
  sessionId?: string;
}

interface ConversionData {
  programId: string;
  productName: string;
  orderId: string;
  orderValue: number;
  commission: number;
  timestamp: string;
}

// Track affiliate click
app.post('/make-server-5ea3da9c/track-click', async (c) => {
  try {
    const clickData: ClickData = await c.req.json();
    
    // Generate unique click ID
    const clickId = `click_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store click data in KV store
    const clickRecord = {
      ...clickData,
      clickId,
      ipAddress: c.req.header('CF-Connecting-IP') || 'unknown',
      userAgent: c.req.header('User-Agent') || 'unknown',
      sessionId: c.req.header('X-Session-ID') || 'anonymous'
    };
    
    await kv.set(`affiliate_click:${clickId}`, JSON.stringify(clickRecord));
    
    // Update program statistics
    const statsKey = `affiliate_stats:${clickData.programId}:${new Date().toISOString().slice(0, 7)}`; // YYYY-MM format
    const existingStats = await kv.get(statsKey);
    
    let stats = existingStats ? JSON.parse(existingStats) : {
      programId: clickData.programId,
      month: new Date().toISOString().slice(0, 7),
      clicks: 0,
      conversions: 0,
      revenue: 0,
      commission: 0
    };
    
    stats.clicks += 1;
    await kv.set(statsKey, JSON.stringify(stats));
    
    // Log for debugging
    console.log(`Affiliate click tracked: ${clickData.programId} - ${clickData.productName}`);
    
    return c.json({ 
      success: true, 
      clickId,
      message: 'Click tracked successfully' 
    });
    
  } catch (error) {
    console.error('Error tracking click:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to track click' 
    }, 500);
  }
});

// Track conversion (when a sale is made)
app.post('/make-server-5ea3da9c/track-conversion', async (c) => {
  try {
    const conversionData: ConversionData = await c.req.json();
    
    // Generate unique conversion ID
    const conversionId = `conversion_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store conversion data
    const conversionRecord = {
      ...conversionData,
      conversionId,
      timestamp: new Date().toISOString()
    };
    
    await kv.set(`affiliate_conversion:${conversionId}`, JSON.stringify(conversionRecord));
    
    // Update program statistics
    const statsKey = `affiliate_stats:${conversionData.programId}:${new Date().toISOString().slice(0, 7)}`;
    const existingStats = await kv.get(statsKey);
    
    let stats = existingStats ? JSON.parse(existingStats) : {
      programId: conversionData.programId,
      month: new Date().toISOString().slice(0, 7),
      clicks: 0,
      conversions: 0,
      revenue: 0,
      commission: 0
    };
    
    stats.conversions += 1;
    stats.revenue += conversionData.orderValue;
    stats.commission += conversionData.commission;
    
    await kv.set(statsKey, JSON.stringify(stats));
    
    console.log(`Conversion tracked: ${conversionData.programId} - £${conversionData.orderValue} (£${conversionData.commission} commission)`);
    
    return c.json({ 
      success: true, 
      conversionId,
      message: 'Conversion tracked successfully' 
    });
    
  } catch (error) {
    console.error('Error tracking conversion:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to track conversion' 
    }, 500);
  }
});

// Get affiliate statistics
app.get('/make-server-5ea3da9c/affiliate-stats/:programId/:month?', async (c) => {
  try {
    const programId = c.req.param('programId');
    const month = c.req.param('month') || new Date().toISOString().slice(0, 7);
    
    const statsKey = `affiliate_stats:${programId}:${month}`;
    const stats = await kv.get(statsKey);
    
    if (!stats) {
      return c.json({
        programId,
        month,
        clicks: 0,
        conversions: 0,
        revenue: 0,
        commission: 0,
        conversionRate: 0
      });
    }
    
    const parsedStats = JSON.parse(stats);
    const conversionRate = parsedStats.clicks > 0 ? (parsedStats.conversions / parsedStats.clicks) * 100 : 0;
    
    return c.json({
      ...parsedStats,
      conversionRate: parseFloat(conversionRate.toFixed(2))
    });
    
  } catch (error) {
    console.error('Error fetching stats:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch statistics' 
    }, 500);
  }
});

// Get all affiliate programs stats summary
app.get('/make-server-5ea3da9c/affiliate-summary/:month?', async (c) => {
  try {
    const month = c.req.param('month') || new Date().toISOString().slice(0, 7);
    const programs = ['amazon-uk', 'asos', 'etsy', 'booking', 'john-lewis'];
    
    const summary = await Promise.all(
      programs.map(async (programId) => {
        const statsKey = `affiliate_stats:${programId}:${month}`;
        const stats = await kv.get(statsKey);
        
        if (!stats) {
          return {
            programId,
            clicks: 0,
            conversions: 0,
            revenue: 0,
            commission: 0,
            conversionRate: 0
          };
        }
        
        const parsedStats = JSON.parse(stats);
        const conversionRate = parsedStats.clicks > 0 ? (parsedStats.conversions / parsedStats.clicks) * 100 : 0;
        
        return {
          ...parsedStats,
          conversionRate: parseFloat(conversionRate.toFixed(2))
        };
      })
    );
    
    // Calculate totals
    const totals = summary.reduce((acc, program) => ({
      totalClicks: acc.totalClicks + program.clicks,
      totalConversions: acc.totalConversions + program.conversions,
      totalRevenue: acc.totalRevenue + program.revenue,
      totalCommission: acc.totalCommission + program.commission
    }), {
      totalClicks: 0,
      totalConversions: 0,
      totalRevenue: 0,
      totalCommission: 0
    });
    
    const overallConversionRate = totals.totalClicks > 0 
      ? (totals.totalConversions / totals.totalClicks) * 100 
      : 0;
    
    return c.json({
      month,
      programs: summary,
      totals: {
        ...totals,
        overallConversionRate: parseFloat(overallConversionRate.toFixed(2))
      }
    });
    
  } catch (error) {
    console.error('Error fetching summary:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to fetch summary' 
    }, 500);
  }
});

// Generate affiliate link with tracking
app.post('/make-server-5ea3da9c/generate-link', async (c) => {
  try {
    const { originalUrl, programId, productName } = await c.req.json();
    
    // Generate tracking ID
    const trackingId = `track_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Store link mapping
    await kv.set(`link_mapping:${trackingId}`, JSON.stringify({
      originalUrl,
      programId,
      productName,
      createdAt: new Date().toISOString()
    }));
    
    // Generate affiliate URL based on program
    let affiliateUrl = originalUrl;
    
    switch (programId) {
      case 'amazon-uk':
        const amazonTag = `tag=${Deno.env.get('AMAZON_AFFILIATE_ID')}`;
        const separator = originalUrl.includes('?') ? '&' : '?';
        affiliateUrl = `${originalUrl}${separator}${amazonTag}&linkId=${trackingId}`;
        break;
        
      case 'asos':
        const encodedUrl = encodeURIComponent(originalUrl);
        affiliateUrl = `https://www.awin1.com/cread.php?awinmid=3785&awinaffid=${Deno.env.get('ASOS_AFFILIATE_ID')}&clickref=${trackingId}&p=${encodedUrl}`;
        break;
        
      case 'booking':
        const bookingParams = `aid=${Deno.env.get('BOOKING_AFFILIATE_ID')}&label=bridallink-${trackingId}`;
        const bookingSeparator = originalUrl.includes('?') ? '&' : '?';
        affiliateUrl = `${originalUrl}${bookingSeparator}${bookingParams}`;
        break;
        
      default:
        // Generic tracking parameter
        const genericSeparator = originalUrl.includes('?') ? '&' : '?';
        affiliateUrl = `${originalUrl}${genericSeparator}ref=bridallink&tid=${trackingId}`;
    }
    
    return c.json({
      success: true,
      trackingId,
      affiliateUrl,
      originalUrl
    });
    
  } catch (error) {
    console.error('Error generating link:', error);
    return c.json({ 
      success: false, 
      error: 'Failed to generate affiliate link' 
    }, 500);
  }
});

Deno.serve(app.fetch);