import { 
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  onSnapshot
} from 'firebase/firestore';
import { db } from './config';

// Collections
const PROPERTIES_COLLECTION = 'properties';
const RENTAL_PROPERTIES_COLLECTION = 'rentalProperties'; // NEW: For rental forms
const SALE_PROPERTIES_COLLECTION = 'saleProperties'; // NEW: For sale forms
const USERS_COLLECTION = 'users';
const BLOGS_COLLECTION = 'blogs';
const CONTACTS_COLLECTION = 'contacts';
const REVIEWS_COLLECTION = 'reviews'; // NEW: For testimonials/reviews

// Property operations
export const addProperty = async (propertyData) => {
  try {
    const docRef = await addDoc(collection(db, PROPERTIES_COLLECTION), {
      ...propertyData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// NEW: Add rental property from agent form
export const addRentalProperty = async (rentalData, agentInfo) => {
  try {
    const docRef = await addDoc(collection(db, RENTAL_PROPERTIES_COLLECTION), {
      ...rentalData,
      agentInfo: {
        email: agentInfo.email,
        name: agentInfo.name,
        role: agentInfo.role
      },
      status: 'pending', // pending, approved, rejected
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// NEW: Add sale property from agent form
export const addSaleProperty = async (saleData, agentInfo) => {
  try {
    console.log('Adding sale property to collection:', SALE_PROPERTIES_COLLECTION);
    const docRef = await addDoc(collection(db, SALE_PROPERTIES_COLLECTION), {
      ...saleData,
      agentInfo: {
        email: agentInfo.email,
        name: agentInfo.name,
        role: agentInfo.role
      },
      status: 'pending', // pending, approved, rejected
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getProperty = async (propertyId) => {
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, propertyId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Property not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getProperties = async (filters = {}, limitCount = 10) => {
  try {
    let q = collection(db, PROPERTIES_COLLECTION);
    
    // Apply filters
    if (filters.type) {
      q = query(q, where('type', '==', filters.type));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.minPrice) {
      q = query(q, where('price', '>=', filters.minPrice));
    }
    if (filters.maxPrice) {
      q = query(q, where('price', '<=', filters.maxPrice));
    }
    
    // Apply ordering and limit
    q = query(q, orderBy('createdAt', 'desc'), limit(limitCount));
    
    const querySnapshot = await getDocs(q);
    const properties = [];
    
    querySnapshot.forEach((doc) => {
      properties.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: properties };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// NEW: Get rental properties for admin approval
export const getRentalProperties = async (filters = {}) => {
  try {
    let q = collection(db, RENTAL_PROPERTIES_COLLECTION);
    
    // Apply filters
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.agentEmail) {
      q = query(q, where('agentInfo.email', '==', filters.agentEmail));
    }
    
    // Remove ordering temporarily to avoid index requirement
    // q = query(q, orderBy('submittedAt', 'desc'));
    
    const querySnapshot = await getDocs(q);
    const rentalProperties = [];
    
    querySnapshot.forEach((doc) => {
      rentalProperties.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort in JavaScript instead of Firestore
    if (rentalProperties.length > 0) {
      rentalProperties.sort((a, b) => {
        const dateA = a.submittedAt?.toDate?.() || new Date(a.submittedAt) || new Date(0);
        const dateB = b.submittedAt?.toDate?.() || new Date(b.submittedAt) || new Date(0);
        return dateB - dateA; // Descending order
      });
    }
    
    return { success: true, data: rentalProperties };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// NEW: Get sale properties for admin approval
export const getSaleProperties = async (filters = {}) => {
  try {
    console.log('Getting sale properties from collection:', SALE_PROPERTIES_COLLECTION);
    let q = collection(db, SALE_PROPERTIES_COLLECTION);
    
    // Apply filters
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.agentEmail) {
      q = query(q, where('agentInfo.email', '==', filters.agentEmail));
    }
    
    const querySnapshot = await getDocs(q);
    const saleProperties = [];
    
    querySnapshot.forEach((doc) => {
      saleProperties.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort in JavaScript instead of Firestore
    if (saleProperties.length > 0) {
      saleProperties.sort((a, b) => {
        const dateA = a.submittedAt?.toDate?.() || new Date(a.submittedAt) || new Date(0);
        const dateB = b.submittedAt?.toDate?.() || new Date(b.submittedAt) || new Date(0);
        return dateB - dateA; // Descending order
      });
    }
    
    return { success: true, data: saleProperties };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateProperty = async (propertyId, updateData) => {
  try {
    const docRef = doc(db, PROPERTIES_COLLECTION, propertyId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// NEW: Update rental property status (for admin approval/rejection)
export const updateRentalPropertyStatus = async (rentalId, status, adminNotes = '') => {
  try {
    const docRef = doc(db, RENTAL_PROPERTIES_COLLECTION, rentalId);
    await updateDoc(docRef, {
      status: status,
      adminNotes: adminNotes,
      reviewedAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// NEW: Delete rental property (admin only)
export const deleteRentalProperty = async (rentalId) => {
  try {
    const docRef = doc(db, RENTAL_PROPERTIES_COLLECTION, rentalId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// NEW: Update sale property status (for admin approval/rejection)
export const updateSalePropertyStatus = async (saleId, status, adminNotes = '') => {
  try {
    const docRef = doc(db, SALE_PROPERTIES_COLLECTION, saleId);
    await updateDoc(docRef, {
      status: status,
      adminNotes: adminNotes,
      reviewedAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// NEW: Delete sale property (admin only)
export const deleteSaleProperty = async (saleId) => {
  try {
    const docRef = doc(db, SALE_PROPERTIES_COLLECTION, saleId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Sold Properties Collection
const SOLD_PROPERTIES_COLLECTION = 'soldProperties';

export const addSoldProperty = async (soldData, agentInfo) => {
  try {
    console.log('Adding sold property to collection:', SOLD_PROPERTIES_COLLECTION);
    const docRef = await addDoc(collection(db, SOLD_PROPERTIES_COLLECTION), {
      ...soldData,
      agentInfo: {
        email: agentInfo.email,
        name: agentInfo.name,
        role: agentInfo.role
      },
      status: 'pending',
      submittedAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getSoldProperties = async (filters = {}) => {
  try {
    console.log('Getting sold properties from collection:', SOLD_PROPERTIES_COLLECTION);
    let q = collection(db, SOLD_PROPERTIES_COLLECTION);
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    if (filters.agentEmail) {
      q = query(q, where('agentInfo.email', '==', filters.agentEmail));
    }
    const querySnapshot = await getDocs(q);
    const soldProperties = [];
    querySnapshot.forEach((doc) => {
      soldProperties.push({ id: doc.id, ...doc.data() });
    });
    if (soldProperties.length > 0) {
      soldProperties.sort((a, b) => {
        const dateA = a.submittedAt?.toDate?.() || new Date(a.submittedAt) || new Date(0);
        const dateB = b.submittedAt?.toDate?.() || new Date(b.submittedAt) || new Date(0);
        return dateB - dateA;
      });
    }
    return { success: true, data: soldProperties };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateSoldPropertyStatus = async (soldId, status, adminNotes = '') => {
  try {
    const docRef = doc(db, SOLD_PROPERTIES_COLLECTION, soldId);
    await updateDoc(docRef, {
      status: status,
      adminNotes: adminNotes,
      reviewedAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// NEW: Delete sold property (admin only)
export const deleteSoldProperty = async (soldId) => {
  try {
    const docRef = doc(db, SOLD_PROPERTIES_COLLECTION, soldId);
    await deleteDoc(docRef);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteProperty = async (propertyId) => {
  try {
    await deleteDoc(doc(db, PROPERTIES_COLLECTION, propertyId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// User operations
export const addUser = async (userData) => {
  try {
    // Use the UID as the document ID for consistency
    const docRef = doc(db, USERS_COLLECTION, userData.uid);
    await setDoc(docRef, {
      ...userData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: userData.uid };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getUser = async (userId) => {
  try {
    const docRef = doc(db, USERS_COLLECTION, userId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'User not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Blog operations
export const addBlog = async (blogData) => {
  try {
    const docRef = await addDoc(collection(db, BLOGS_COLLECTION), {
      ...blogData,
      createdAt: new Date(),
      updatedAt: new Date()
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getBlogs = async (limitCount = 10) => {
  try {
    const q = query(
      collection(db, BLOGS_COLLECTION),
      orderBy('createdAt', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    const blogs = [];
    
    querySnapshot.forEach((doc) => {
      blogs.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: blogs };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const getBlog = async (blogId) => {
  try {
    const docRef = doc(db, BLOGS_COLLECTION, blogId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      return { success: true, data: { id: docSnap.id, ...docSnap.data() } };
    } else {
      return { success: false, error: 'Blog not found' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const updateBlog = async (blogId, updateData) => {
  try {
    const docRef = doc(db, BLOGS_COLLECTION, blogId);
    await updateDoc(docRef, {
      ...updateData,
      updatedAt: new Date()
    });
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

export const deleteBlog = async (blogId) => {
  try {
    await deleteDoc(doc(db, BLOGS_COLLECTION, blogId));
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Contact form submissions
export const submitContact = async (contactData) => {
  try {
    const docRef = await addDoc(collection(db, CONTACTS_COLLECTION), {
      ...contactData,
      createdAt: new Date(),
      status: 'new'
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Real-time listeners
export const subscribeToProperties = (callback, filters = {}) => {
  let q = collection(db, PROPERTIES_COLLECTION);
  
  if (filters.type) {
    q = query(q, where('type', '==', filters.type));
  }
  if (filters.status) {
    q = query(q, where('status', '==', filters.status));
  }
  
  q = query(q, orderBy('createdAt', 'desc'));
  
  return onSnapshot(q, (querySnapshot) => {
    const properties = [];
    querySnapshot.forEach((doc) => {
      properties.push({ id: doc.id, ...doc.data() });
    });
    callback(properties);
  });
};

// Review operations
export const addReview = async (reviewData) => {
  try {
    console.log('Adding review to Firebase:', reviewData);
    const docRef = await addDoc(collection(db, REVIEWS_COLLECTION), {
      ...reviewData,
      status: 'approved', // Auto-approve reviews for now
      createdAt: new Date(),
      updatedAt: new Date()
    });
    console.log('Review added successfully with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding review:', error);
    return { success: false, error: error.message };
  }
};

export const getReviews = async (limitCount = 50) => {
  try {
    const q = query(
      collection(db, REVIEWS_COLLECTION),
      where('status', '==', 'approved')
    );
    
    const querySnapshot = await getDocs(q);
    const reviews = [];
    
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort in JavaScript instead of Firestore to avoid index requirement
    reviews.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
      return dateB - dateA; // Descending order (newest first)
    });
    
    // Apply limit after sorting
    const limitedReviews = reviews.slice(0, limitCount);
    
    return { success: true, data: limitedReviews };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Real-time reviews listener
export const subscribeToReviews = (callback) => {
  console.log('Setting up reviews listener...');
  const q = query(
    collection(db, REVIEWS_COLLECTION),
    where('status', '==', 'approved')
  );
  
  return onSnapshot(q, (querySnapshot) => {
    console.log('Firebase reviews snapshot received, docs count:', querySnapshot.size);
    const reviews = [];
    querySnapshot.forEach((doc) => {
      reviews.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort in JavaScript instead of Firestore to avoid index requirement
    reviews.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
      return dateB - dateA; // Descending order (newest first)
    });
    
    console.log('Processed reviews:', reviews);
    callback(reviews);
  });
};

// Booking Request operations
export const addBookingRequest = async (rentalPropertyId, bookingData) => {
  try {
    // Add to the bookingRequests subcollection of the rental property
    const bookingRequestsRef = collection(db, 'rentalProperties', rentalPropertyId, 'bookingRequests');
    const docRef = await addDoc(bookingRequestsRef, {
      ...bookingData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Booking request added with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding booking request:', error);
    return { success: false, error: error.message };
  }
};

// Villa booking requests - separate collection since villas are static data
export const addVillaBookingRequest = async (villaId, bookingData) => {
  try {
    // Add to the villa bookings collection
    const docRef = await addDoc(collection(db, 'villaBookings'), {
      villaId: villaId,
      ...bookingData,
      status: 'pending',
      createdAt: new Date(),
      updatedAt: new Date()
    });
    
    console.log('Villa booking request added with ID:', docRef.id);
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error('Error adding villa booking request:', error);
    return { success: false, error: error.message };
  }
};

export const getVillaBookingRequests = async (filters = {}) => {
  try {
    let q = collection(db, 'villaBookings');
    
    if (filters.villaId) {
      q = query(q, where('villaId', '==', filters.villaId));
    }
    if (filters.status) {
      q = query(q, where('status', '==', filters.status));
    }
    
    const querySnapshot = await getDocs(q);
    const bookingRequests = [];
    
    querySnapshot.forEach((doc) => {
      bookingRequests.push({ id: doc.id, ...doc.data() });
    });
    
    // Sort by creation date
    bookingRequests.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
      return dateB - dateA;
    });
    
    return { success: true, data: bookingRequests };
  } catch (error) {
    console.error('Error fetching villa booking requests:', error);
    return { success: false, error: error.message };
  }
};

export const updateVillaBookingRequestStatus = async (bookingId, status, adminNotes = '') => {
  try {
    const bookingRef = doc(db, 'villaBookings', bookingId);
    await updateDoc(bookingRef, {
      status,
      adminNotes,
      updatedAt: new Date(),
      ...(status === 'approved' && { approvedAt: new Date() }),
      ...(status === 'rejected' && { rejectedAt: new Date() })
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating villa booking request status:', error);
    return { success: false, error: error.message };
  }
};

export const getBookingRequests = async (rentalPropertyId) => {
  try {
    const bookingRequestsRef = collection(db, 'rentalProperties', rentalPropertyId, 'bookingRequests');
    const q = query(bookingRequestsRef, orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const bookingRequests = [];
    querySnapshot.forEach((doc) => {
      bookingRequests.push({ id: doc.id, ...doc.data() });
    });
    
    return { success: true, data: bookingRequests };
  } catch (error) {
    console.error('Error fetching booking requests:', error);
    return { success: false, error: error.message };
  }
};

export const updateBookingRequestStatus = async (rentalPropertyId, bookingRequestId, status, adminNotes = '') => {
  try {
    const bookingRequestRef = doc(db, 'rentalProperties', rentalPropertyId, 'bookingRequests', bookingRequestId);
    await updateDoc(bookingRequestRef, {
      status,
      adminNotes,
      updatedAt: new Date(),
      ...(status === 'approved' && { approvedAt: new Date() }),
      ...(status === 'rejected' && { rejectedAt: new Date() })
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating booking request status:', error);
    return { success: false, error: error.message };
  }
};

export const getAllBookingRequestsForAgent = async (agentEmail) => {
  try {
    // First get all rental properties for this agent
    const rentalPropertiesRef = collection(db, 'rentalProperties');
    const agentPropertiesQuery = query(
      rentalPropertiesRef, 
      where('agentInfo.email', '==', agentEmail)
    );
    const agentPropertiesSnapshot = await getDocs(agentPropertiesQuery);
    
    const allBookingRequests = [];
    
    // For each property, get its booking requests
    for (const propertyDoc of agentPropertiesSnapshot.docs) {
      const propertyData = { id: propertyDoc.id, ...propertyDoc.data() };
      
      const bookingRequestsRef = collection(db, 'rentalProperties', propertyDoc.id, 'bookingRequests');
      const bookingQuery = query(bookingRequestsRef, orderBy('createdAt', 'desc'));
      const bookingSnapshot = await getDocs(bookingQuery);
      
      bookingSnapshot.forEach((bookingDoc) => {
        allBookingRequests.push({
          id: bookingDoc.id,
          propertyId: propertyDoc.id,
          propertyName: propertyData.name || propertyData.propertyInfo?.name,
          propertySlug: propertyData.propertyInfo?.slug,
          ...bookingDoc.data()
        });
      });
    }
    
    // Sort all booking requests by creation date
    allBookingRequests.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
      return dateB - dateA;
    });
    
    return { success: true, data: allBookingRequests };
  } catch (error) {
    console.error('Error fetching agent booking requests:', error);
    return { success: false, error: error.message };
  }
};

export const getAllBookingRequestsForAdmin = async () => {
  try {
    // Get all rental properties
    const rentalPropertiesRef = collection(db, 'rentalProperties');
    const propertiesSnapshot = await getDocs(rentalPropertiesRef);
    
    const allBookingRequests = [];
    
    // For each property, get its booking requests
    for (const propertyDoc of propertiesSnapshot.docs) {
      const propertyData = { id: propertyDoc.id, ...propertyDoc.data() };
      
      const bookingRequestsRef = collection(db, 'rentalProperties', propertyDoc.id, 'bookingRequests');
      const bookingQuery = query(bookingRequestsRef, orderBy('createdAt', 'desc'));
      const bookingSnapshot = await getDocs(bookingQuery);
      
      bookingSnapshot.forEach((bookingDoc) => {
        allBookingRequests.push({
          id: bookingDoc.id,
          propertyId: propertyDoc.id,
          propertyName: propertyData.name || propertyData.propertyInfo?.name,
          propertySlug: propertyData.propertyInfo?.slug,
          agentName: propertyData.agentInfo?.name,
          agentEmail: propertyData.agentInfo?.email,
          ...bookingDoc.data()
        });
      });
    }
    
    // Sort all booking requests by creation date
    allBookingRequests.sort((a, b) => {
      const dateA = a.createdAt?.toDate?.() || new Date(a.createdAt) || new Date(0);
      const dateB = b.createdAt?.toDate?.() || new Date(b.createdAt) || new Date(0);
      return dateB - dateA;
    });
    
    return { success: true, data: allBookingRequests };
  } catch (error) {
    console.error('Error fetching all booking requests:', error);
    return { success: false, error: error.message };
  }
};
