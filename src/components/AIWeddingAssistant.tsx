import React, { useState, useRef, useEffect } from 'react';

interface Message {
  id: string;
  type: 'user' | 'assistant';
  content: string;
  timestamp: string;
  thinking?: boolean;
}

export default function AIWeddingAssistant() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'assistant',
      content: 'Hello! I\'m your AI Wedding Assistant. I\'m here to help you plan your perfect wedding day. I can provide advice on budgets, timelines, vendors, venues, and much more. What would you like to discuss?',
      timestamp: new Date().toLocaleTimeString()
    }
  ]);
  
  const [inputMessage, setInputMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages are added
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // AI Response Generator
  const generateAIResponse = (userMessage: string): string => {
    const message = userMessage.toLowerCase();
    
    // Budget-related responses
    if (message.includes('budget') || message.includes('cost') || message.includes('money') || message.includes('price')) {
      return `💰 **Budget Planning Advice:**

For a typical UK wedding, here's a recommended budget breakdown:
• **40-50%** - Venue & Catering (£8,000-12,500 for a £25k budget)
• **10-15%** - Photography & Video (£2,500-3,750)
• **8-10%** - Attire & Beauty (£2,000-2,500)
• **8-10%** - Flowers & Decorations (£2,000-2,500)
• **5-8%** - Music & Entertainment (£1,250-2,000)
• **5%** - Transportation (£1,250)
• **10%** - Miscellaneous & Buffer (£2,500)

**💡 Top Money-Saving Tips:**
1. Book venues for Friday/Sunday for 20-30% savings
2. Consider off-season dates (Nov-March)
3. DIY centerpieces and favors
4. Opt for buffet over plated meals
5. Limit the guest list - biggest cost factor!

Would you like specific advice for any of these categories?`;
    }

    // Timeline-related responses
    if (message.includes('timeline') || message.includes('when') || message.includes('schedule') || message.includes('plan')) {
      return `⏰ **Wedding Planning Timeline:**

**12+ Months Before:**
• Set budget and guest list size
• Book venue and major vendors
• Choose wedding date
• Start dress shopping

**6-9 Months Before:**
• Send save-the-dates
• Book photographer, band/DJ, florist
• Order wedding dress
• Plan honeymoon

**3-6 Months Before:**
• Send invitations
• Menu tasting and finalize catering
• Order wedding cake
• Purchase rings
• Plan bachelor/bachelorette parties

**1-3 Months Before:**
• Final dress fitting
• Confirm details with all vendors
• Apply for marriage license
• Write vows
• Create seating chart

**1-2 Weeks Before:**
• Final headcount to caterer
• Rehearsal dinner
• Welcome bags for guests
• Final venue walkthrough

The key is starting early with the big items that book up fast! What specific timeline questions do you have?`;
    }

    // Venue-related responses
    if (message.includes('venue') || message.includes('location') || message.includes('where')) {
      return `🏰 **Choosing the Perfect Venue:**

**Key Questions to Ask:**
• What's included in the rental fee?
• Are there preferred vendors or restrictions?
• What's the rain backup plan?
• How many hours is the rental?
• What's the capacity for ceremony + reception?

**Popular UK Venue Types:**
• **Historic Estates** - Grand but expensive (£3k-8k+)
• **Barn Venues** - Rustic charm (£1.5k-4k)
• **Hotels** - All-inclusive convenience (£2k-6k)
• **Registry Offices** - Budget-friendly (£200-800)
• **Country Clubs** - Elegant settings (£2k-5k)
• **Unique Venues** - Museums, castles (£1k-10k+)

**💡 Insider Tips:**
1. Visit on the same day of week as your wedding
2. Ask about setup/cleanup time included
3. Consider venues that allow outside catering
4. Check noise restrictions for music
5. Ensure adequate parking for guests

Are you looking for a specific style or have a particular location in mind?`;
    }

    // Photography-related responses
    if (message.includes('photo') || message.includes('camera') || message.includes('picture')) {
      return `📸 **Wedding Photography Guide:**

**Choosing Your Photographer:**
• Review full wedding galleries, not just highlights
• Meet in person to ensure personality fit
• Ask about backup plans and second shooters
• Understand what's included (edited photos, rights, etc.)

**Photography Styles:**
• **Traditional** - Classic posed shots
• **Photojournalistic** - Candid, story-telling
• **Fine Art** - Artistic, editorial approach
• **Lifestyle** - Natural, relaxed poses

**Budget Expectations (UK):**
• **Budget:** £800-1,500 (6-8 hours)
• **Mid-range:** £1,500-3,000 (8-10 hours + engagement)
• **Luxury:** £3,000-6,000+ (full day + extras)

**Must-Have Shots Checklist:**
✓ Getting ready details
✓ First look (if desired)
✓ Ceremony entrance & exit
✓ Ring exchange
✓ First kiss
✓ Family group photos
✓ Couple portraits
✓ Reception details & dancing

**💡 Pro Tips:**
• Book 12+ months ahead for popular photographers
• Consider engagement session to build rapport
• Create shot list but trust photographer's expertise
• Discuss timeline to ensure adequate photo time

What's your photography budget and style preference?`;
    }

    // Catering/food related responses
    if (message.includes('food') || message.includes('catering') || message.includes('menu') || message.includes('cake')) {
      return `🍽️ **Wedding Catering & Menu Planning:**

**Service Style Options:**
• **Plated Dinner** - Most formal, higher cost (£35-80/person)
• **Buffet** - Cost-effective, variety (£20-45/person)
• **Food Stations** - Interactive, trendy (£25-55/person)
• **Family Style** - Casual, communal (£30-60/person)
• **Cocktail Reception** - Light bites only (£15-35/person)

**Menu Planning Tips:**
• Consider dietary restrictions (vegetarian, gluten-free, allergies)
• Choose seasonal ingredients for freshness & cost savings
• Offer 2-3 protein options for plated meals
• Include children's menu if needed
• Don't forget vendor meals!

**Wedding Cake Guide:**
• **Traditional Tiered** - £3-8 per slice
• **Cupcake Tower** - £2-4 per person  
• **Dessert Bar** - £5-12 per person
• **Cheese Wheel "Cake"** - £8-15 per person

**💡 Money-Saving Ideas:**
1. Brunch or lunch receptions cost 20-40% less
2. Signature cocktails instead of full open bar
3. Late-night snack instead of full dinner
4. Cake for photos, sheet cake for serving
5. BYOB venues with corkage fees

**Alcohol Considerations:**
• Open bar vs. cash bar vs. limited selection
• Average consumption: 1 drink per person per hour
• Don't forget champagne for toasts!

What type of reception style are you considering?`;
    }

    // Music/entertainment responses
    if (message.includes('music') || message.includes('band') || message.includes('dj') || message.includes('dance')) {
      return `🎵 **Wedding Music & Entertainment:**

**DJ vs. Band Decision:**
• **DJ Pros:** More song variety, lower cost (£400-1,200), guaranteed music
• **Band Pros:** Live energy, interactive (£800-3,000+), memorable experience
• **Both:** Some couples do acoustic ceremony + DJ reception

**Popular Music Timeline:**
• **Prelude:** Soft background (30-45 min before ceremony)
• **Processional:** Bridal party entrance
• **Bride's Entrance:** Your special moment!
• **Recessional:** Celebration exit music
• **Cocktail Hour:** Light jazz, acoustic covers
• **Reception:** Mix of genres for all ages

**Song Selection Tips:**
• **First Dance:** Choose something meaningful to you both
• **Parent Dances:** Ask parents for input
• **Party Music:** Mix decades (70s, 80s, 90s, current)
• **Must-Play List:** Give DJ 10-15 guaranteed songs
• **Do-Not-Play List:** Equally important!

**💡 Entertainment Ideas:**
• Photo booth with props
• Acoustic guitarist for ceremony
• Jazz trio for cocktail hour
• LED uplighting for ambiance
• Special dances (anniversary dance, etc.)

**Questions to Ask Musicians:**
• What's included in setup time?
• Do you have backup equipment?
• Can you act as MC for announcements?
• What do you wear/dress code?
• How many breaks do you take?

Are you leaning toward live music or a DJ for your reception?`;
    }

    // Flowers/decorations responses
    if (message.includes('flower') || message.includes('decoration') || message.includes('centerpiece') || message.includes('bouquet')) {
      return `🌸 **Wedding Flowers & Decorations:**

**Essential Florals:**
• **Bridal Bouquet** - Your signature piece (£75-200)
• **Bridesmaid Bouquets** - Smaller versions (£25-75 each)
• **Boutonnieres** - Groom & groomsmen (£8-25 each)
• **Ceremony Arrangements** - Altar pieces (£100-500)
• **Centerpieces** - Reception tables (£30-150 each)

**Seasonal Flower Guide:**
• **Spring:** Tulips, daffodils, cherry blossoms, lilacs
• **Summer:** Roses, peonies, hydrangeas, sunflowers
• **Fall:** Dahlias, chrysanthemums, marigolds, wheat
• **Winter:** Amaryllis, evergreens, holly, white roses

**Budget-Friendly Tips:**
1. Choose in-season, local flowers
2. Use grocery store flowers for practice bouquets
3. Repurpose ceremony arrangements at reception
4. Mix fresh flowers with greenery/branches
5. DIY simple arrangements for cocktail tables

**Popular Wedding Flowers:**
• **Roses** - Classic, available year-round
• **Peonies** - Romantic, but seasonal (May-June)
• **Hydrangeas** - Full, cost-effective
• **Baby's Breath** - Trendy, budget-friendly
• **Eucalyptus** - Great greenery filler

**💡 Creative Alternatives:**
• Potted plants guests can take home
• Fruit arrangements (lemons, pears)
• Candles with minimal florals
• Succulent gardens
• Paper flower backdrops

**Questions for Your Florist:**
• What's your delivery/setup fee?
• Can you work within my budget?
• What flowers do you recommend for my date?
• Do you offer rental items (vases, etc.)?

What's your vision for the wedding flowers and overall style?`;
    }

    // Guest list responses
    if (message.includes('guest') || message.includes('invitation') || message.includes('rsvp')) {
      return `👥 **Guest List & Invitation Management:**

**Creating Your Guest List:**
• Start with immediate family
• Add close friends you can't imagine celebrating without
• Consider venue capacity and budget per person
• Discuss with both families early
• Remember: Each guest affects your budget significantly!

**RSVP Timeline:**
• **Save the Dates:** 6-8 months before (destination weddings: 8-12 months)
• **Invitations:** 6-8 weeks before
• **RSVP Deadline:** 2-3 weeks before wedding
• **Final Headcount:** 1 week before to caterer

**Invitation Etiquette:**
• Include ceremony & reception details
• Specify dress code if not obvious
• Mention meal choice if plated dinner
• Include accommodation suggestions for out-of-town guests
• Add wedding website for additional info

**Managing RSVPs:**
• Online RSVP systems make tracking easier
• Follow up with non-responders 1 week after deadline
• Have B-list ready if A-list declines
• Expect 15-20% decline rate for local weddings
• Consider plus-ones carefully (married couples, long-term partners)

**💡 Guest List Strategy:**
• **Intimate:** 30-50 people - Close family & best friends
• **Medium:** 75-100 people - Extended family & friend groups  
• **Large:** 150+ people - Everyone you'd like to celebrate with

**Cost Impact:**
Every guest adds £30-80+ to your budget (food, drink, favors, etc.)
Cutting 20 guests can save £600-1,600!

How many guests are you planning to invite?`;
    }

    // Dress/attire responses
    if (message.includes('dress') || message.includes('attire') || message.includes('suit') || message.includes('outfit')) {
      return `👗 **Wedding Attire Guide:**

**Wedding Dress Shopping:**
• **Start Early:** 8-12 months before wedding
• **Budget:** £300-3,000+ (average £800-1,500)
• **Appointment Tips:** Bring 2-3 trusted people max
• **Try Different Styles:** A-line, ballgown, mermaid, sheath
• **Consider Your Venue:** Beach vs. church vs. garden affects style

**Dress Shopping Timeline:**
• **12 months:** Start browsing, book appointments
• **9-10 months:** Order dress (allows 6 months for alterations)
• **6 months:** Accessories shopping
• **2-3 months:** Final fitting
• **1 month:** Final alterations pickup

**Groom's Attire:**
• **Rental:** £80-200 (good for distant groomsmen)
• **Purchase:** £200-800+ (yours to keep)
• **Formal Levels:** White tie > black tie > cocktail > casual
• **Coordinate:** Match formality with bride's dress

**Bridal Party Attire:**
• **Bridesmaids:** Consider their budgets (£50-300)
• **Mix & Match:** Same color, different styles works well
• **Groomsmen:** Coordinate ties/pocket squares with bridesmaid colors

**💡 Money-Saving Tips:**
1. Sample sales at bridal shops
2. Online retailers (order early for returns)
3. Rent designer dresses
4. Consider non-bridal dresses in white/ivory
5. Alterations included vs. separate

**Don't Forget:**
• Undergarments & shapewear
• Comfortable shoes for dancing
• Weather backup (wrap, umbrella)
• Emergency kit for day-of

What's your vision for the wedding day style?`;
    }

    // General planning responses
    if (message.includes('stress') || message.includes('overwhelm') || message.includes('help') || message.includes('where to start')) {
      return `💕 **Wedding Planning Support:**

**Feeling Overwhelmed? You're Not Alone!**
Wedding planning can feel like a full-time job. Here's how to stay sane:

**📝 Break It Down:**
1. **Start with the Big 3:** Date, venue, budget
2. **Tackle one category per week**
3. **Use checklists and timelines**
4. **Delegate tasks to willing family/friends**

**🧘‍♀️ Stress Management:**
• Remember why you're getting married - it's about love!
• Take breaks from planning
• Communicate openly with your partner
• Don't compare your wedding to others
• Focus on what truly matters to you both

**⚖️ Priority Setting:**
• **Must-Haves:** Non-negotiables for your day
• **Nice-to-Haves:** Would be lovely but not essential
• **Don't-Cares:** Let these go to save time/money

**🤝 Getting Help:**
• **Wedding Planner:** Full service (£2k-5k+) or day-of coordination (£500-1.5k)
• **Family & Friends:** Delegate specific tasks
• **Online Tools:** Apps, spreadsheets, websites
• **BridalLink Community:** Connect with other couples!

**💡 Sanity-Saving Tips:**
1. Set a weekly planning limit (2-3 hours max)
2. Keep a "decision journal" to remember why you chose things
3. Have a non-wedding date night weekly
4. Remember: Done is better than perfect
5. Focus on the marriage, not just the wedding

**Most Important:**
Your wedding day will be beautiful because it's YOURS. The flowers might wilt, the cake might be lopsided, but your love story is perfect.

What specific aspect of planning is causing you the most stress right now?`;
    }

    // Weather/season responses
    if (message.includes('weather') || message.includes('season') || message.includes('rain') || message.includes('outdoor')) {
      return `🌤️ **Weather & Seasonal Planning:**

**UK Wedding Weather by Season:**

**Spring (March-May):**
• **Pros:** Beautiful blooms, mild temps, less expensive
• **Cons:** Unpredictable weather, possible rain
• **Average Temp:** 8-16°C
• **Backup Plans:** Essential for outdoor ceremonies

**Summer (June-August):**
• **Pros:** Warmest weather, long daylight hours
• **Cons:** Peak season pricing, higher demand
• **Average Temp:** 14-22°C
• **Peak Month:** July (busiest & most expensive)

**Autumn (September-November):**
• **Pros:** Beautiful foliage, comfortable temps, lower prices
• **Cons:** Earlier sunsets, possible rain
• **Average Temp:** 6-15°C
• **Sweet Spot:** September (still warm, lower prices)

**Winter (December-February):**
• **Pros:** Lowest prices, cozy atmosphere, unique beauty
• **Cons:** Cold weather, limited daylight, holiday conflicts
• **Average Temp:** 2-7°C
• **Bonus:** Holiday decorations already up!

**☔ Weather Backup Plans:**
• **Outdoor Ceremony:** Always have indoor alternative
• **Tented Reception:** Sidewalls for wind/rain
• **Guest Comfort:** Blankets, umbrellas, heaters
• **Photography:** Covered areas for photos

**💡 Weather-Smart Tips:**
1. Check historical weather data for your date
2. Rent market lights for earlier sunsets
3. Provide pashminas/shawls for guests
4. Choose venues with covered outdoor spaces
5. Embrace the weather - rain photos can be magical!

**Seasonal Considerations:**
• **Flowers:** Choose what's in season
• **Menu:** Hearty vs. light options
• **Attire:** Layer options for guests
• **Activities:** Indoor alternatives ready

What season are you planning for, and do you have weather concerns?`;
    }

    // Honeymoon responses
    if (message.includes('honeymoon') || message.includes('travel') || message.includes('vacation')) {
      return `✈️ **Honeymoon Planning:**

**When to Book:**
• **6-12 months ahead:** Best prices and availability
• **After Wedding:** Book dates but wait on specifics if budget is tight
• **Consider:** Recovery time needed after wedding stress

**Popular Honeymoon Styles:**
• **Beach Relaxation:** Maldives, Caribbean, Greek Islands
• **City Exploration:** Paris, Rome, Tokyo, New York
• **Adventure:** New Zealand, Costa Rica, Iceland
• **Safari:** Kenya, Tanzania, South Africa
• **Cultural:** India, Morocco, Peru, Vietnam

**Budget Planning:**
• **Budget:** £1,500-3,000 (Europe, all-inclusive resorts)
• **Mid-Range:** £3,000-6,000 (Long-haul, nice hotels)
• **Luxury:** £6,000+ (First-class, 5-star resorts)

**💡 Money-Saving Tips:**
1. **Honeymoon Registry:** Let guests contribute
2. **Off-Season Travel:** 30-50% savings
3. **Package Deals:** Flight + hotel bundles
4. **Loyalty Points:** Use credit card rewards
5. **Local Gems:** Undiscovered destinations

**Travel Considerations:**
• **Passport Validity:** 6+ months for many countries
• **Vaccinations:** Research requirements early
• **Travel Insurance:** Especially for expensive trips
• **Time Zones:** Factor in jet lag recovery
• **Weather:** Research destination's seasons

**Timing Options:**
• **Immediately After:** Traditional, ride the newlywed high
• **Delayed Honeymoon:** Save money, plan better, avoid stress
• **Mini-Moon:** Short trip after, big trip later

**💕 Romantic Touches:**
• Upgrade to honeymoon suite
• Couples massage
• Private dinners
• Sunset experiences
• Adventure activities you both love

Do you have a dream destination in mind, or are you looking for inspiration?`;
    }

    // Default responses for unclear queries
    const defaultResponses = [
      `I'd be happy to help you with your wedding planning! I can provide detailed advice on:

🏰 **Venues & Locations**
💰 **Budget Planning & Cost Breakdown**  
📸 **Photography & Videography**
🍽️ **Catering & Menu Planning**
🌸 **Flowers & Decorations**
🎵 **Music & Entertainment**
👗 **Attire & Beauty**
👥 **Guest Lists & Invitations**
⏰ **Timeline & Planning Schedule**
🌤️ **Weather & Seasonal Considerations**
✈️ **Honeymoon Planning**
💕 **Stress Management & Support**

What specific area would you like to discuss? Feel free to ask about any wedding planning topic!`,

      `Great question! Let me help you with that wedding planning topic. 

Here are some areas I can provide detailed guidance on:
• **Budget breakdowns** and cost-saving tips
• **Vendor selection** and what questions to ask
• **Timeline planning** so you don't miss important deadlines
• **Guest list management** and invitation etiquette
• **Venue selection** criteria and what to look for
• **Seasonal planning** considerations for your wedding date

Could you be more specific about what aspect of wedding planning you'd like to focus on? The more details you share, the better I can tailor my advice to your specific situation!`,

      `I'm here to make your wedding planning journey smoother! 

**Popular topics couples ask me about:**
• Setting realistic budgets and sticking to them
• Creating timelines that actually work
• Choosing between different vendor options
• Managing family expectations and guest lists
• Planning for different seasons and weather
• Destination wedding considerations
• Stress management during planning

**Pro tip:** The most successful weddings focus on what matters most to the couple. What aspects of your wedding day are you most excited about?

Feel free to ask me anything specific - I'm here to help!`
    ];

    return defaultResponses[Math.floor(Math.random() * defaultResponses.length)];
  };

  const handleSendMessage = () => {
    if (!inputMessage.trim()) return;

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputMessage.trim(),
      timestamp: new Date().toLocaleTimeString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setIsTyping(true);

    // Simulate AI thinking time and generate response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'assistant',
        content: generateAIResponse(inputMessage),
        timestamp: new Date().toLocaleTimeString()
      };

      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500 + Math.random() * 2000); // 1.5-3.5 second delay for realism
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickPrompts = [
    "Help me set a realistic wedding budget",
    "What should my wedding planning timeline be?",
    "How do I choose between venues?",
    "What questions should I ask photographers?",
    "I'm feeling overwhelmed with planning"
  ];

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="text-center space-y-4">
        <div className="bg-gradient-to-r from-purple-100 to-pink-100 p-4 rounded-full w-16 h-16 mx-auto flex items-center justify-center">
          <span className="text-2xl">🤖</span>
        </div>
        <h1 className="text-3xl font-bold text-amber-800">AI Wedding Assistant</h1>
        <p className="text-amber-700">Your intelligent wedding planning companion</p>
      </div>
      
      {/* Personalized Recommendations */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h2 className="text-xl font-semibold text-amber-800 mb-4">Personalized AI Recommendations</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 rounded-lg p-4 border-l-4 border-blue-400">
            <h3 className="font-semibold text-amber-800 mb-2">💡 Budget Optimization</h3>
            <p className="text-amber-700 text-sm">Based on average UK weddings, consider allocating 40% to venue and catering for the best value. This approach gives you the most impact for your investment.</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4 border-l-4 border-green-400">
            <h3 className="font-semibold text-amber-800 mb-2">⏰ Timeline Alert</h3>
            <p className="text-amber-700 text-sm">Start booking major vendors 8-12 months in advance. Popular photographers and venues fill up quickly, especially for summer weekends.</p>
          </div>
          <div className="bg-purple-50 rounded-lg p-4 border-l-4 border-purple-400">
            <h3 className="font-semibold text-amber-800 mb-2">🌤️ Weather Planning</h3>
            <p className="text-amber-700 text-sm">UK weather can be unpredictable! Always have a backup plan for outdoor ceremonies and consider the season when choosing your venue and menu.</p>
          </div>
          <div className="bg-rose-50 rounded-lg p-4 border-l-4 border-rose-400">
            <h3 className="font-semibold text-amber-800 mb-2">🎵 Music Suggestion</h3>
            <p className="text-amber-700 text-sm">Popular first dance songs this year include "Perfect" by Ed Sheeran and "All of Me" by John Legend. Consider your venue's sound restrictions when planning music.</p>
          </div>
        </div>
      </div>

      {/* Main Chat Interface */}
      <div className="bg-white rounded-lg border shadow-sm p-6">
        <h2 className="text-xl font-semibold text-amber-800 mb-4">Chat with AI Assistant</h2>
        
        {/* Quick Prompts */}
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Quick questions to get started:</p>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((prompt, index) => (
              <button
                key={index}
                onClick={() => setInputMessage(prompt)}
                className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-xs hover:bg-purple-200 transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>

        {/* Messages Container */}
        <div className="bg-gray-50 rounded-lg p-4 min-h-[400px] max-h-[500px] overflow-y-auto mb-4">
          <div className="space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`p-4 rounded-lg ${
                  message.type === 'user'
                    ? 'bg-purple-100 ml-8 border-l-4 border-purple-500'
                    : 'bg-white mr-8 shadow-sm border-l-4 border-amber-400'
                }`}
              >
                <div className="flex justify-between items-start mb-2">
                  <div className={`font-semibold ${
                    message.type === 'user' ? 'text-purple-700' : 'text-amber-700'
                  }`}>
                    {message.type === 'user' ? '👤 You' : '🤖 AI Wedding Assistant'}
                  </div>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
                <div className={`text-sm leading-relaxed ${
                  message.type === 'user' ? 'text-purple-800' : 'text-gray-700'
                }`}>
                  {/* Render AI responses with basic markdown-style formatting */}
                  {message.content.split('\n').map((line, index) => {
                    if (line.startsWith('**') && line.endsWith('**')) {
                      return (
                        <div key={index} className="font-semibold text-amber-800 mt-3 mb-1">
                          {line.slice(2, -2)}
                        </div>
                      );
                    }
                    if (line.startsWith('• ')) {
                      return (
                        <div key={index} className="ml-4 mb-1">
                          {line}
                        </div>
                      );
                    }
                    if (line.trim() === '') {
                      return <div key={index} className="h-2"></div>;
                    }
                    return <div key={index} className="mb-1">{line}</div>;
                  })}
                </div>
              </div>
            ))}
            
            {/* Typing Indicator */}
            {isTyping && (
              <div className="bg-white mr-8 p-4 rounded-lg shadow-sm border-l-4 border-amber-400">
                <div className="flex justify-between items-start mb-2">
                  <div className="font-semibold text-amber-700">🤖 AI Wedding Assistant</div>
                  <span className="text-xs text-gray-500">Typing...</span>
                </div>
                <div className="flex items-center space-x-1">
                  <div className="flex space-x-1">
                    <div className="h-2 w-2 bg-amber-400 rounded-full animate-pulse"></div>
                    <div className="h-2 w-2 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.2s' }}></div>
                    <div className="h-2 w-2 bg-amber-400 rounded-full animate-pulse" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                  <span className="text-xs text-gray-500 ml-2">Thinking...</span>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Area */}
        <div className="flex gap-2">
          <div className="flex-1">
            <textarea
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask me anything about wedding planning..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-300 resize-none"
              rows={2}
              disabled={isTyping}
            />
            <div className="text-xs text-gray-500 mt-1">
              Press Enter to send, Shift+Enter for new line
            </div>
          </div>
          <button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim() || isTyping}
            className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors self-start"
          >
            {isTyping ? (
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Sending</span>
              </div>
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>

      {/* AI Capabilities */}
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg border p-6">
        <h3 className="text-lg font-semibold text-amber-800 mb-4">What I Can Help With</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="text-center">
            <div className="text-2xl mb-2">💰</div>
            <h4 className="font-semibold text-amber-800 mb-1">Budget Planning</h4>
            <p className="text-xs text-amber-700">Cost breakdowns, saving tips, vendor pricing</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">⏰</div>
            <h4 className="font-semibold text-amber-800 mb-1">Timeline Guidance</h4>
            <p className="text-xs text-amber-700">Planning schedules, booking deadlines</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">🏰</div>
            <h4 className="font-semibold text-amber-800 mb-1">Venue Selection</h4>
            <p className="text-xs text-amber-700">Types, questions to ask, what to look for</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">📸</div>
            <h4 className="font-semibold text-amber-800 mb-1">Vendor Advice</h4>
            <p className="text-xs text-amber-700">Photography, catering, music, flowers</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">👥</div>
            <h4 className="font-semibold text-amber-800 mb-1">Guest Management</h4>
            <p className="text-xs text-amber-700">List planning, invitation etiquette</p>
          </div>
          <div className="text-center">
            <div className="text-2xl mb-2">💕</div>
            <h4 className="font-semibold text-amber-800 mb-1">Stress Support</h4>
            <p className="text-xs text-amber-700">Planning tips, prioritization help</p>
          </div>
        </div>
      </div>
    </div>
  );
}