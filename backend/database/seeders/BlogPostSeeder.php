<?php

namespace Database\Seeders;

use App\Models\BlogPost;
use App\Models\Company;
use Illuminate\Database\Seeder;

class BlogPostSeeder extends Seeder
{
    public function run(): void
    {
        $company = Company::query()->where('code', 'LUXE001')->first();

        if (! $company) {
            return;
        }

        $posts = [
            [
                'slug' => 'summer-hair-care-tips-dubai',
                'title' => 'Summer Hair Care Tips for Dubai\'s Climate',
                'excerpt' => 'Protect your colour and keep hair hydrated through heat, humidity, and pool season with these salon-approved rituals.',
                'content' => <<<'HTML'
<p>Dubai summers are beautiful — but harsh on hair. Between sun exposure, air conditioning, and chlorinated pools, even the healthiest strands need extra care.</p>
<h3>Hydrate from the inside out</h3>
<p>Increase water intake and use a lightweight leave-in conditioner after every wash. Our stylists recommend a weekly deep-conditioning mask during peak summer months.</p>
<h3>Shield your colour</h3>
<p>UV rays fade balayage and highlights faster than you think. Wear a hat or use UV-protective styling products before heading outdoors.</p>
<h3>Book a trim early</h3>
<p>Split ends travel quickly in dry heat. A maintenance trim every 6–8 weeks keeps ends fresh and styles polished.</p>
<p><strong>Ready for a summer refresh?</strong> Book a consultation with our colour team — we'll tailor a plan to your hair type and lifestyle.</p>
HTML,
                'featured_image' => 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1200&q=80',
                'author_name' => 'Maya Fernandez',
                'category' => 'Hair Care',
                'tags' => ['summer', 'hair', 'dubai'],
                'published_at' => now()->subDays(3),
            ],
            [
                'slug' => 'benefits-of-gold-facial',
                'title' => 'Why the Gold Facial Is Our Most Requested Treatment',
                'excerpt' => 'Discover how 24K gold-infused skincare delivers radiance, firmness, and a red-carpet glow before your next event.',
                'content' => <<<'HTML'
<p>The gold facial has become a signature at Luxe Beauty Lounge — and for good reason. This luxurious treatment combines deep cleansing, gentle exfoliation, and gold-enriched serums that brighten dull skin.</p>
<h3>Instant luminosity</h3>
<p>Gold particles reflect light beautifully, giving skin an immediate glow that's perfect before weddings, galas, or photography sessions.</p>
<h3>Anti-ageing support</h3>
<p>Gold is known for its antioxidant properties. Regular sessions can help improve elasticity and reduce the appearance of fine lines over time.</p>
<h3>Who is it for?</h3>
<p>Ideal for all skin types seeking hydration and radiance. We customize each session based on a brief skin analysis at the start of your visit.</p>
HTML,
                'featured_image' => 'https://images.unsplash.com/photo-1570172619644-dfd03ed5d881?auto=format&fit=crop&w=1200&q=80',
                'author_name' => 'Lina Khoury',
                'category' => 'Skincare',
                'tags' => ['facial', 'skincare', 'gold'],
                'published_at' => now()->subDays(8),
            ],
            [
                'slug' => 'bridal-beauty-timeline',
                'title' => 'The Ultimate Bridal Beauty Timeline',
                'excerpt' => 'From trials to touch-ups — plan your wedding day look with our step-by-step bridal preparation guide.',
                'content' => <<<'HTML'
<p>Your wedding day deserves flawless beauty — and flawless beauty starts with planning. Here's the timeline our bridal specialists recommend.</p>
<h3>3 months before</h3>
<p>Book your bridal makeup and hair trial. Bring inspiration photos and discuss your dress neckline, venue lighting, and ceremony timing.</p>
<h3>1 month before</h3>
<p>Schedule a hydrating facial and manicure. Avoid major colour changes — focus on healthy, camera-ready skin and nails.</p>
<h3>1 week before</h3>
<p>Confirm your day-of schedule with our team. Pack a touch-up kit and arrange transportation to the salon if needed.</p>
<h3>Wedding day</h3>
<p>Arrive with clean, product-free skin and dry hair. Our artists will handle the rest — calm, precise, and on schedule.</p>
HTML,
                'featured_image' => 'https://images.unsplash.com/photo-1487412947147-5cebf100ffc2?auto=format&fit=crop&w=1200&q=80',
                'author_name' => 'Sara Al Hashimi',
                'category' => 'Bridal',
                'tags' => ['bridal', 'wedding', 'makeup'],
                'published_at' => now()->subDays(14),
            ],
            [
                'slug' => 'self-care-sunday-rituals',
                'title' => 'Self-Care Sunday: Spa Rituals You Can Recreate at Home',
                'excerpt' => 'Extend the salon experience between visits with aromatherapy, scalp massage, and mindful skincare steps.',
                'content' => <<<'HTML'
<p>Sundays are made for slowing down. While nothing replaces a professional treatment, these rituals help you maintain that post-spa feeling all week.</p>
<h3>Scalp massage</h3>
<p>Five minutes of circular massage with a nourishing oil stimulates circulation and eases tension — especially after a long week.</p>
<h3>At-home face mask</h3>
<p>Apply a hydrating mask while enjoying herbal tea. Focus on breathing and disconnecting from screens for twenty minutes.</p>
<h3>Hand and foot care</h3>
<p>Soak, exfoliate, and moisturize. Even a simple routine keeps nails and skin guest-ready between salon visits.</p>
<p>When you're ready to level up, our Signature Ritual package combines all three in one indulgent session.</p>
HTML,
                'featured_image' => 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874?auto=format&fit=crop&w=1200&q=80',
                'author_name' => 'Noor Rahman',
                'category' => 'Wellness',
                'tags' => ['spa', 'wellness', 'self-care'],
                'published_at' => now()->subDays(21),
            ],
        ];

        foreach ($posts as $index => $post) {
            BlogPost::query()->updateOrCreate(
                ['slug' => $post['slug']],
                [
                    ...$post,
                    'company_id' => $company->id,
                    'is_published' => true,
                    'sort_order' => $index + 1,
                ]
            );
        }
    }
}
