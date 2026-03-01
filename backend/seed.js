require("dotenv").config();
const { createClient } = require("@supabase/supabase-js");
const { places } = require("./src/mock/places");

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceRoleKey) {
    console.error("❌ Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: { persistSession: false }
});

async function seedDatabase() {
    try {
        console.log("🌱 Starting database seeding...\n");

        console.log("📍 Inserting places...");
        let inserted = 0;

        for (const place of places) {
            const placeData = {
                id: place.id,
                name: place.name,
                category: place.category,
                description: place.ai_description,
                lat: null, // You can add coordinates later
                lng: null,
                base_price: parseInt(place.price_label?.match(/\d+/)?.[0] || "0")
            };

            const { error } = await supabase
                .from("places")
                .insert([placeData])
                .select();

            if (error) {
                console.warn(`   ⚠️  "${place.name}" error:`, error.message);
            } else {
                inserted++;
                console.log(`   ✅ ${place.name}`);
            }
        }

        console.log(`\n✅ Seeding completed! Inserted ${inserted} places.\n`);
        process.exit(0);
    } catch (error) {
        console.error("❌ Seeding failed:", error);
        process.exit(1);
    }
}

seedDatabase();
