import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import blogsData from '../data/Blogs.js';

// Firebase configuration (using the same config as in your project)
const firebaseConfig = {
  // You can get this from your src/firebase/config.js file
  // For security, the actual config should be in environment variables
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Simple blog migration function
 * Run this script to migrate blog data from static files to Firestore
 */
async function migrateBlogsToFirestore() {
  console.log('🚀 Starting blog migration...');
  console.log(`📚 Found ${blogsData.length} blogs to migrate`);
  
  let successCount = 0;
  let skipCount = 0;
  let errorCount = 0;

  for (const blog of blogsData) {
    try {
      // Check if blog already exists
      const existingBlogQuery = query(
        collection(db, 'blogs'),
        where('originalId', '==', blog.id)
      );
      const existingBlogs = await getDocs(existingBlogQuery);

      if (!existingBlogs.empty) {
        console.log(`⏭️  Skipping "${blog.title}" (already exists)`);
        skipCount++;
        continue;
      }

      // Prepare blog data for Firestore
      const blogData = {
        originalId: blog.id,
        title: blog.title || 'Untitled Blog',
        subtitle: blog.subtitle || '',
        description: blog.description || '',
        author: {
          name: blog.author || '340 Real Estate Team',
          role: 'Real Estate Expert',
          email: '340realestateco@gmail.com'
        },
        category: blog.category || 'Real Estate',
        tags: blog.tags || ['St. John', 'Real Estate', 'USVI'],
        status: 'published',
        featured: false,
        coverImage: blog.coverImage || '',
        publishedAt: blog.publishedAt ? new Date(blog.publishedAt) : new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        views: blog.views || 0,
        likes: blog.likes || 0,
        slug: blog.id,
        metaDescription: blog.description?.substring(0, 160) || '',
        metaKeywords: blog.tags || ['St. John', 'Real Estate', 'USVI']
      };

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'blogs'), blogData);
      console.log(`✅ Migrated "${blog.title}" (ID: ${docRef.id})`);
      successCount++;

    } catch (error) {
      console.error(`❌ Error migrating "${blog.title}":`, error.message);
      errorCount++;
    }
  }

  console.log('\n📊 Migration Summary:');
  console.log(`✅ Successfully migrated: ${successCount} blogs`);
  console.log(`⏭️  Skipped (already exist): ${skipCount} blogs`);
  console.log(`❌ Errors: ${errorCount} blogs`);
  console.log('\n🎉 Migration completed!');
}

// Run migration if this file is executed directly
if (typeof window === 'undefined') {
  // Running in Node.js environment
  migrateBlogsToFirestore()
    .then(() => {
      console.log('Migration process finished.');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}

export { migrateBlogsToFirestore };