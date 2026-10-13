import "dotenv/config"
import mongoose from "mongoose";
import User from "../src/backend/models/User";
import Event from "../src/backend/models/Event";

const seedEvents = [
  {
    title: "Indie Music Night",
    category: "Music",
    city: "Bhopal",
    daysFromNow: 3,
    price: 299,
    description: "An evening of independent music and local artists.",
    isActive: true,
  },
  {
    title: "Acoustic Sunset",
    category: "Music",
    city: "Indore",
    daysFromNow: 7,
    price: 199,
    description: "Live acoustic performances at sunset.",
    isActive: true,
  },
  {
    title: "Electronic Beats Festival",
    category: "Music",
    city: "Mumbai",
    daysFromNow: 12,
    price: 799,
    description: "A night of electronic music and dance.",
    isActive: false,
  },
  {
    title: "Guitar for Beginners",
    category: "Workshop",
    city: "Bhopal",
    daysFromNow: 5,
    price: 499,
    description: "Learn basic chords, rhythm, and strumming.",
    isActive: true,
  },
  {
    title: "Build Your First Website",
    category: "Workshop",
    city: "Pune",
    daysFromNow: 9,
    price: 0,
    description: "A hands-on introduction to building websites.",
    isActive: true,
  },
  {
    title: "Pottery and Clay",
    category: "Workshop",
    city: "Delhi",
    daysFromNow: 15,
    price: 699,
    description: "Create your own pottery with a local artist.",
    isActive: true,
  },
  {
    title: "Street Food Walk",
    category: "Food",
    city: "Indore",
    daysFromNow: 2,
    price: 349,
    description: "Explore popular local street food spots.",
    isActive: true,
  },
  {
    title: "Home Baking Basics",
    category: "Food",
    city: "Bhopal",
    daysFromNow: 8,
    price: 599,
    description: "Learn to bake simple cakes and cookies.",
    isActive: true,
  },
  {
    title: "Coffee Tasting Session",
    category: "Food",
    city: "Bengaluru",
    daysFromNow: 11,
    price: 399,
    description: "Discover coffee aromas, brewing, and tasting.",
    isActive: false,
  },
  {
    title: "Sunday Football",
    category: "Sports",
    city: "Bhopal",
    daysFromNow: 4,
    price: 100,
    description: "A friendly football match for all skill levels.",
    isActive: true,
  },
  {
    title: "Badminton Meetup",
    category: "Sports",
    city: "Pune",
    daysFromNow: 6,
    price: 150,
    description: "Meet other players for casual badminton games.",
    isActive: true,
  },
  {
    title: "City Cycling Ride",
    category: "Sports",
    city: "Delhi",
    daysFromNow: 13,
    price: 0,
    description: "A relaxed group cycling ride around the city.",
    isActive: true,
  },
  {
    title: "Kids' Science Lab",
    category: "Kids",
    city: "Bhopal",
    daysFromNow: 5,
    price: 249,
    description: "Fun science experiments for young learners.",
    isActive: true,
  },
  {
    title: "Little Artists Club",
    category: "Kids",
    city: "Indore",
    daysFromNow: 10,
    price: 199,
    description: "A creative painting and drawing session.",
    isActive: true,
  },
  {
    title: "Family Board Game Day",
    category: "Kids",
    city: "Mumbai",
    daysFromNow: 16,
    price: 0,
    description: "A family-friendly afternoon of board games.",
    isActive: false,
  },
  {
    title: "Jazz in the Park",
    category: "Music",
    city: "Pune",
    daysFromNow: 18,
    price: 450,
    description: "An outdoor jazz performance featuring local musicians.",
    isActive: true,
  },
  {
    title: "Photography Walk",
    category: "Workshop",
    city: "Mumbai",
    daysFromNow: 20,
    price: 299,
    description: "Practice composition and street photography.",
    isActive: true,
  },
  {
    title: "Regional Cuisine Festival",
    category: "Food",
    city: "Delhi",
    daysFromNow: 22,
    price: 499,
    description: "Discover regional dishes from across India.",
    isActive: true,
  },
  {
    title: "Table Tennis Tournament",
    category: "Sports",
    city: "Indore",
    daysFromNow: -3,
    price: 100,
    description: "A past tournament for testing date filters.",
    isActive: true,
  },
  {
    title: "Old Food Festival",
    category: "Food",
    city: "Bhopal",
    daysFromNow: -10,
    price: 199,
    description: "A past food festival for testing upcoming-event queries.",
    isActive: false,
  },
];

async function main() {
    const databaseUrl = process.env.MONGODB_URI;

    if (!databaseUrl) {
    throw new Error("DATABASE_URL is missing from environment variables");
    }

    await mongoose.connect(databaseUrl);

  const admin = await User.findOne({ role: "Admin" });

  if (!admin) {
    throw new Error("No admin user found. Promote an account before seeding.");
  }

  const events = seedEvents.map(({ daysFromNow, ...event }) => {
    const date = new Date();
    date.setDate(date.getDate() + daysFromNow);
    date.setHours(18, 0, 0, 0);

    return {
      ...event,
      date,
      imageUrl: "https://placehold.co/1200x800?text=Community+Event",
      publisher: admin._id,
    };
  });

  const result = await Event.insertMany(events);

  console.log(`Seeded ${result.length} events for ${admin.email}.`);
}

main()
  .catch((error) => {
    console.error("Event seeding failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await mongoose.disconnect();
  });