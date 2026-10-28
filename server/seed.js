require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');
const Book = require('./models/Book');

const seedData = async () => {
  try {
    console.log('Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    console.log('Deleting existing data...');
    await User.deleteMany({});
    await Book.deleteMany({});
    console.log('Existing users and books deleted');

    console.log('Creating demo user...');
    const demoUser = await User.create({
      name: 'Demo User',
      email: 'demo@pageturn.com',
      password: 'Demo@1234',
      yearlyGoal: 24
    });
    console.log(`Demo user created: ${demoUser.email} (ID: ${demoUser._id})`);

    const booksData = [
      {
        title: 'To Kill a Mockingbird',
        author: 'Harper Lee',
        genre: 'Fiction',
        totalPages: 281,
        currentPage: 281,
        status: 'finished',
        rating: 5,
        review: 'A masterpiece of American literature.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780061120084-L.jpg',
        startedAt: new Date('2026-01-15'),
        finishedAt: new Date('2026-02-01')
      },
      {
        title: '1984',
        author: 'George Orwell',
        genre: 'Dystopian',
        totalPages: 328,
        currentPage: 328,
        status: 'finished',
        rating: 5,
        review: 'Chillingly relevant even today.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780451524935-L.jpg',
        startedAt: new Date('2026-02-10'),
        finishedAt: new Date('2026-03-01')
      },
      {
        title: 'The Great Gatsby',
        author: 'F. Scott Fitzgerald',
        genre: 'Fiction',
        totalPages: 180,
        currentPage: 180,
        status: 'finished',
        rating: 4,
        review: 'Beautiful prose about the American dream.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780743273565-L.jpg',
        startedAt: new Date('2026-03-05'),
        finishedAt: new Date('2026-03-15')
      },
      {
        title: 'Sapiens',
        author: 'Yuval Noah Harari',
        genre: 'Non-Fiction',
        totalPages: 443,
        currentPage: 443,
        status: 'finished',
        rating: 4,
        review: 'Fascinating overview of human history.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062316097-L.jpg',
        startedAt: new Date('2026-04-01'),
        finishedAt: new Date('2026-05-10')
      },
      {
        title: 'Atomic Habits',
        author: 'James Clear',
        genre: 'Self-Help',
        totalPages: 320,
        currentPage: 320,
        status: 'finished',
        rating: 5,
        review: 'Life-changing framework for building good habits.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780735211292-L.jpg',
        startedAt: new Date('2026-05-20'),
        finishedAt: new Date('2026-06-15')
      },
      {
        title: 'Dune',
        author: 'Frank Herbert',
        genre: 'Science Fiction',
        totalPages: 688,
        currentPage: 688,
        status: 'finished',
        rating: 5,
        review: 'The greatest sci-fi epic ever written.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780441172719-L.jpg',
        startedAt: new Date('2026-06-20'),
        finishedAt: new Date('2026-08-01')
      },
      {
        title: 'Educated',
        author: 'Tara Westover',
        genre: 'Memoir',
        totalPages: 334,
        currentPage: 334,
        status: 'finished',
        rating: 4,
        review: 'An incredible story of self-invention.',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780399590504-L.jpg',
        startedAt: new Date('2026-08-10'),
        finishedAt: new Date('2026-09-01')
      },
      {
        title: 'The Hobbit',
        author: 'J.R.R. Tolkien',
        genre: 'Fantasy',
        totalPages: 310,
        currentPage: 205,
        status: 'reading',
        rating: null,
        review: '',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780547928227-L.jpg',
        startedAt: new Date('2026-10-01')
      },
      {
        title: 'Thinking, Fast and Slow',
        author: 'Daniel Kahneman',
        genre: 'Psychology',
        totalPages: 499,
        currentPage: 142,
        status: 'reading',
        rating: null,
        review: '',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780374533557-L.jpg',
        startedAt: new Date('2026-10-10')
      },
      {
        title: 'Project Hail Mary',
        author: 'Andy Weir',
        genre: 'Science Fiction',
        totalPages: 476,
        currentPage: 89,
        status: 'reading',
        rating: null,
        review: '',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780593135204-L.jpg',
        startedAt: new Date('2026-10-20')
      },
      {
        title: 'The Midnight Library',
        author: 'Matt Haig',
        genre: 'Fiction',
        totalPages: 288,
        currentPage: 0,
        status: 'want-to-read',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780525559474-L.jpg'
      },
      {
        title: 'Klara and the Sun',
        author: 'Kazuo Ishiguro',
        genre: 'Fiction',
        totalPages: 303,
        currentPage: 0,
        status: 'want-to-read',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780571364886-L.jpg'
      },
      {
        title: 'The Psychology of Money',
        author: 'Morgan Housel',
        genre: 'Finance',
        totalPages: 256,
        currentPage: 0,
        status: 'want-to-read',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780857197689-L.jpg'
      },
      {
        title: 'Becoming',
        author: 'Michelle Obama',
        genre: 'Memoir',
        totalPages: 448,
        currentPage: 0,
        status: 'want-to-read',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9781524763138-L.jpg'
      },
      {
        title: 'The Alchemist',
        author: 'Paulo Coelho',
        genre: 'Fiction',
        totalPages: 197,
        currentPage: 0,
        status: 'want-to-read',
        coverUrl: 'https://covers.openlibrary.org/b/isbn/9780062315007-L.jpg'
      }
    ];

    console.log(`Seeding ${booksData.length} books...`);
    for (const book of booksData) {
      await Book.create({
        ...book,
        user: demoUser._id
      });
      console.log(`- Created book: "${book.title}"`);
    }

    console.log('Seed completed successfully!');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

seedData();
