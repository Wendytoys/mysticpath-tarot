import React from 'react';
import { Link } from 'react-router-dom';
import type { BlogPost } from '../types';

const slugify = (text: string) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');

const threeCardSpreadTitle = "Tarot Reading for Beginners: A Complete Guide to Your First Three-Card Spread";
const majorArcanaTitle = "The Meanings of the 22 Major Arcana Cards: Your Spiritual Journey Map";
const crystalsTitle = "How to Use Crystals to Enhance Your Tarot Practice";

// Let's keep the detailed, hand-crafted posts
const initialPosts: BlogPost[] = [
    {
        slug: slugify(threeCardSpreadTitle),
        title: threeCardSpreadTitle,
        excerpt: "Feeling called to the cards but not sure where to start? The three-card spread is the perfect gateway into the world of Tarot. It's simple, powerful, and offers profound clarity on your past, present, and future.",
        imageUrl: 'https://images.unsplash.com/photo-1590179004415-ade880ce6c39?q=80&w=2070&auto=format&fit=crop',
        publishedDate: "2024-07-28",
        keywords: ["tarot for beginners", "three-card spread", "how to read tarot", "tarot reading", "past present future"],
        content: (
            <div className="space-y-6">
                <p>Feeling called to the cards but not sure where to start? The three-card spread is the perfect gateway into the world of Tarot. It's simple, powerful, and offers profound clarity on your past, present, and future. Let's walk through it together.</p>

                <h2 className="text-3xl font-playfair text-white mt-6 mb-2">1. Set Your Intention</h2>
                <p>Before you even touch the deck, take a moment to breathe. Close your eyes and center yourself. What question is on your mind? It could be specific ("What should I focus on in my career right now?") or general ("What do I need to know today?"). Hold this question in your heart as you shuffle the cards. You're not just randomizing; you're infusing the deck with your energy.</p>

                <h2 className="text-3xl font-playfair text-white mt-6 mb-2">2. Shuffling and Drawing</h2>
                <p>There's no single "right" way to shuffle. Do what feels comfortable. Once you feel the time is right, cut the deck into three piles and then reassemble them in any order. Now, draw three cards from the top of the deck and lay them face down in a row, from left to right.</p>

                <h2 className="text-3xl font-playfair text-white mt-6 mb-2">3. The Three Positions</h2>
                <p>Each card's position has a specific meaning. As you turn them over one by one, consider what each represents:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Card 1 (Left): The Past.</strong> This card represents the foundation of your situation. It points to past events, lessons learned, and energies that have brought you to where you are now.</li>
                    <li><strong>Card 2 (Center): The Present.</strong> This is the heart of the matter. This card reveals the current state of your situation, the primary challenge or opportunity you're facing right now.</li>
                    <li><strong>Card 3 (Right): The Future.</strong> This card offers guidance on the potential outcome. It's not a fixed destiny, but rather the likely path forward if you continue on your current course. It often suggests what you need to focus on or what you can expect.</li>
                </ul>

                <h2 className="text-3xl font-playfair text-white mt-6 mb-2">4. Weaving the Story</h2>
                <p>The real magic happens when you connect the dots. Don't just look at each card in isolation. How does the past influence the present? How does the present situation shape the potential future? Look for a narrative, a flow of energy from one card to the next. For instance, did The Tower (sudden change) in the past lead to The Star (hope) in the present, pointing towards The Sun (success) in the future? That's a story of overcoming hardship to find joy.</p>
                <p>Trust your intuition. The images, colors, and symbols on the cards will speak to you. Our app's Card Library is a great resource if you need help with a card's traditional meaning, but your personal connection is just as important. Happy reading!</p>
            </div>
        )
    },
    {
        slug: slugify(majorArcanaTitle),
        title: majorArcanaTitle,
        excerpt: "The Major Arcana, or 'great secrets,' are the 22 trump cards of the Tarot deck. They represent the major milestones and spiritual lessons of the soul's journey, from the innocent leap of The Fool to the cosmic completion of The World.",
        imageUrl: 'https://images.unsplash.com/photo-1610818252553-605b7a703a54?q=80&w=1974&auto=format&fit=crop',
        publishedDate: "2024-07-25",
        keywords: ["major arcana", "tarot card meanings", "spiritual journey", "the fool", "the magician", "the world"],
        content: (
            <div className="space-y-6">
                <p>The Major Arcana, or 'great secrets,' are the 22 trump cards of the Tarot deck. They represent the major milestones and spiritual lessons of the soul's journey, from the innocent leap of The Fool to the cosmic completion of The World. Understanding them is key to unlocking the deepest wisdom of the Tarot.</p>
                <p>Think of this as your soul's roadmap. Each card is a significant stop, a lesson to be integrated before moving to the next. Let's explore a few key points on this path:</p>
                
                <h3 className="text-2xl font-playfair text-white mt-4 mb-2">The Beginning: The Fool (0)</h3>
                <p>The journey starts with The Fool, representing pure potential, innocence, and the leap of faith required to begin a new adventure.</p>

                <h3 className="text-2xl font-playfair text-white mt-4 mb-2">The Tools: The Magician (1) & The High Priestess (2)</h3>
                <p>Early on, the soul learns to master its tools. The Magician teaches us to manifest our will in the outer world, while The High Priestess guides us to trust our inner world of intuition and subconscious knowledge.</p>
                
                <h3 className="text-2xl font-playfair text-white mt-4 mb-2">The Turning Point: The Wheel of Fortune (10)</h3>
                <p>At the midpoint of the journey, we encounter the Wheel of Fortune. This card teaches us about destiny, karma, and the cyclical nature of life. It’s a reminder that change is the only constant.</p>

                <h2 className="text-3xl font-playfair text-white mt-6 mb-2">The Great Test: Death (13) & The Tower (16)</h2>
                <p>No spiritual journey is without its challenges. The Death card signifies profound transformation and the need to let go of what no longer serves us. The Tower represents a sudden, often shocking, upheaval that destroys false structures to make way for the truth.</p>
                
                <h3 className="text-2xl font-playfair text-white mt-4 mb-2">The Illumination: The Star (17), The Moon (18), & The Sun (19)</h3>
                <p>After the trials, comes enlightenment. The Star offers hope and spiritual renewal. The Moon asks us to face our fears and illusions. Finally, The Sun brings clarity, joy, and success.</p>

                 <h3 className="text-2xl font-playfair text-white mt-4 mb-2">The Culmination: The World (21)</h3>
                <p>The journey concludes with The World card, symbolizing completion, integration, and fulfillment. The soul has integrated all its lessons and dances in harmony with the cosmos. A cycle is complete, and soon, The Fool will be ready to take another leap.</p>

                <p className="mt-6">To explore each of these cards in detail, visit our comprehensive <Link to="/library" className="text-accent-gold hover:underline">Card Library</Link>.</p>
            </div>
        )
    },
    {
        slug: slugify(crystalsTitle),
        title: crystalsTitle,
        excerpt: "Crystals and Tarot are two powerful divination tools that work in beautiful synergy. Crystals can help you ground your energy, amplify your intuition, and create a sacred space for your readings, making your connection to the cards deeper and clearer.",
        imageUrl: 'https://images.unsplash.com/photo-1612204103602-069d3e4a9a0a?q=80&w=2070&auto=format&fit=crop',
        publishedDate: "2024-07-22",
        keywords: ["tarot and crystals", "crystal healing", "enhance intuition", "amethyst", "clear quartz", "rose quartz"],
        content: (
            <div className="space-y-6">
                <p>Crystals and Tarot are two powerful divination tools that work in beautiful synergy. Crystals can help you ground your energy, amplify your intuition, and create a sacred space for your readings, making your connection to the cards deeper and clearer. Here’s how you can incorporate them into your practice.</p>

                <h2 className="text-3xl font-playfair text-white mt-6 mb-2">Choosing Your Crystal Companions</h2>
                <p>Different crystals carry different energies. Choosing one that aligns with your intention for the reading can be incredibly powerful. Here are a few staples for any tarot reader:</p>
                <ul className="list-disc list-inside space-y-2 pl-4">
                    <li><strong>Clear Quartz: The Master Healer.</strong> This crystal is known for amplifying energy and thought. Place it near your deck to clarify your question and magnify the messages from the cards.</li>
                    <li><strong>Amethyst: The Intuition Stone.</strong> Perfect for connecting with your higher self and psychic abilities. Hold amethyst or place it on your third eye before a reading to enhance your intuitive insights.</li>
                    <li><strong>Rose Quartz: The Heart Stone.</strong> If you're doing a reading about love, relationships, or self-love, Rose Quartz can bring a gentle, compassionate energy to the space.</li>
                    <li><strong>Black Tourmaline: The Protector.</strong> This is a grounding and protective stone. It's excellent for clearing negative energy from your space and shielding you from psychic noise, ensuring the messages you receive are pure.</li>
                </ul>

                <h2 className="text-3xl font-playfair text-white mt-6 mb-2">Ways to Use Crystals in Your Readings</h2>
                <ol className="list-decimal list-inside space-y-2 pl-4">
                    <li><strong>Cleanse Your Deck:</strong> Before and after readings, you can place a piece of Selenite or Clear Quartz on top of your tarot deck. This helps to clear any residual energy and "reset" the cards.</li>
                    <li><strong>Create a Crystal Grid:</strong> Arrange several crystals around your reading space to create a sacred container. You could place four Black Tourmaline crystals at the four corners of your table to create a protective grid.</li>
                    <li><strong>Hold a Crystal While Shuffling:</strong> Hold your chosen crystal in your non-dominant hand while you shuffle with your dominant hand. This helps to channel your intention and the crystal's energy directly into the deck.</li>
                    <li><strong>As Card Markers:</strong> You can use smaller tumble stones to mark specific cards in a larger spread that you want to come back to or meditate on further.</li>
                </ol>

                <p className="mt-6">Experiment and see what feels right for you. Your intuition is your best guide, both with the cards and with your crystal allies. The combination of these earthly and cosmic energies can elevate your tarot practice to a whole new level.</p>
            </div>
        )
    }
];


// Programmatically generate dummy posts to simulate a large blog
const generatedPosts: BlogPost[] = [];
const baseDummyContent = (
    <div className="space-y-6">
        <p>This is placeholder content for a future blog post. Stay tuned for more divine wisdom and insights from Mystic Path.</p>
        <p>Exploring the depths of consciousness requires patience and guidance. Our upcoming articles will delve into various spiritual practices, helping you on your journey of self-discovery. We will cover topics ranging from ancient philosophies to modern mindfulness techniques, providing you with the tools to navigate your spiritual path with confidence and clarity.</p>
    </div>
);

const dummyTitles = [
    "The Power of Daily Meditation", "Connecting with Your Spirit Guides", "Understanding the Four Tarot Suits", "Numerology and Your Life Path",
    "Astrology for Beginners: The Zodiac Signs", "The Art of Scrying", "Working with the Moon Cycles", "Finding Your Power Animal",
    "A Guide to Chakra Healing", "Lucid Dreaming Techniques", "The History of Tarot", "Creating Your Sacred Space", "Herbs for Spiritual Protection",
    "The Philosophy of Yin and Yang", "Mindfulness in a Hectic World"
];

for (let i = 0; i < 97; i++) {
    const title = dummyTitles[i % dummyTitles.length];
    const uniqueTitle = `${title} Vol. ${Math.floor(i / dummyTitles.length) + 1}`;
    
    generatedPosts.push({
        slug: slugify(uniqueTitle),
        title: uniqueTitle,
        excerpt: `An insightful exploration into "${title}". Discover the hidden meanings and spiritual significance that can guide you on your path. Full article coming soon.`,
        imageUrl: `https://picsum.photos/seed/${slugify(uniqueTitle)}/800/600`,
        // Stagger the publish dates
        publishedDate: new Date(new Date("2024-07-21").getTime() - (i * 24 * 60 * 60 * 1000)).toISOString().split('T')[0],
        keywords: ["spirituality", "meditation", "self-discovery", "mindfulness", ...title.toLowerCase().split(' ').filter(w => w.length > 3)],
        content: baseDummyContent,
    });
}


export const allPosts: BlogPost[] = [...initialPosts, ...generatedPosts];
