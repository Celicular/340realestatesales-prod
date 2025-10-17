import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getBlogs, getBlog } from "../../firebase/firestore";
import blogsData from "../../data/Blogs";

// Async thunk for fetching blogs from Firestore
export const fetchBlogs = createAsyncThunk(
  "blogs/fetchBlogs",
  async (limitCount = 20) => {
    const result = await getBlogs(limitCount);
    if (result.success) {
      return result.data.filter((blog) => blog.status === "published");
    }
    throw new Error(result.error);
  }
);

// Async thunk for fetching a single blog
export const fetchBlogById = createAsyncThunk(
  "blogs/fetchBlogById",
  async (blogId) => {
    // First check if it's a hardcoded blog
    const hardcodedBlog = blogsData.find((blog) => blog.id === blogId);
    if (hardcodedBlog) {
      return { ...hardcodedBlog, isHardcoded: true };
    }

    // Try Firestore
    const result = await getBlog(blogId);
    if (result.success) {
      return { ...result.data, isHardcoded: false };
    }
    throw new Error(result.error);
  }
);

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    // Keep hardcoded blogs for backward compatibility
    hardcodedBlogs: blogsData,
    firebaseBlogs: [],
    allBlogs: [...blogsData], // Combined blogs
    currentBlog: null,
    loading: false,
    error: null,
    lastFetch: null,
  },
  reducers: {
    clearCurrentBlog: (state) => {
      state.currentBlog = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    // Add blog to local state (useful for real-time updates)
    addBlog: (state, action) => {
      state.firebaseBlogs.unshift(action.payload);
      state.allBlogs = [...state.firebaseBlogs, ...state.hardcodedBlogs];
    },
    // Update blog in local state
    updateBlogInState: (state, action) => {
      const { id, updates } = action.payload;
      const blogIndex = state.firebaseBlogs.findIndex((blog) => blog.id === id);
      if (blogIndex !== -1) {
        state.firebaseBlogs[blogIndex] = {
          ...state.firebaseBlogs[blogIndex],
          ...updates,
        };
        state.allBlogs = [...state.firebaseBlogs, ...state.hardcodedBlogs];
      }
      if (state.currentBlog && state.currentBlog.id === id) {
        state.currentBlog = { ...state.currentBlog, ...updates };
      }
    },
    // Remove blog from local state
    removeBlogFromState: (state, action) => {
      const blogId = action.payload;
      state.firebaseBlogs = state.firebaseBlogs.filter(
        (blog) => blog.id !== blogId
      );
      state.allBlogs = [...state.firebaseBlogs, ...state.hardcodedBlogs];
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch blogs
      .addCase(fetchBlogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogs.fulfilled, (state, action) => {
        state.loading = false;
        state.firebaseBlogs = action.payload;
        state.allBlogs = [...action.payload, ...state.hardcodedBlogs];
        state.lastFetch = new Date().toISOString();
      })
      .addCase(fetchBlogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        // If Firebase fails, still show hardcoded blogs
        state.allBlogs = [...state.hardcodedBlogs];
      })
      // Fetch single blog
      .addCase(fetchBlogById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBlogById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBlog = action.payload;
      })
      .addCase(fetchBlogById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
        state.currentBlog = null;
      });
  },
});

export const {
  clearCurrentBlog,
  clearError,
  addBlog,
  updateBlogInState,
  removeBlogFromState,
} = blogSlice.actions;

// Selectors
export const selectAllBlogs = (state) => state.blogs.allBlogs;
export const selectFirebaseBlogs = (state) => state.blogs.firebaseBlogs;
export const selectHardcodedBlogs = (state) => state.blogs.hardcodedBlogs;
export const selectCurrentBlog = (state) => state.blogs.currentBlog;
export const selectBlogsLoading = (state) => state.blogs.loading;
export const selectBlogsError = (state) => state.blogs.error;
export const selectBlogsLastFetch = (state) => state.blogs.lastFetch;

export default blogSlice.reducer;
