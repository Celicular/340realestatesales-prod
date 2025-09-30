import { createSlice } from "@reduxjs/toolkit";
import blogsData from "../../../src/data/Blogs";

const blogSlice = createSlice({
  name: "blogs",
  initialState: {
    items: blogsData,
  },
  reducers: {},
});

export const selectAllBlogs = (state) => state.blogs.items;
export default blogSlice.reducer;
