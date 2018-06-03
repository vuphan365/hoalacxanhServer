const express = require('express');

const blogRouter = express.Router();
const blogController = require('../controllers/blogController');

function router(sql) {
  const { getDetailAllBlogs, getDetailBlogById, getViewBlogById, addBlog, editBlog,
    getViewAllBlogs, getContentBlogById, deleteBlogById }
    = blogController(sql);
  blogRouter.route('/detail')
    .get(getDetailAllBlogs);
  blogRouter.route('/detail/:id')
    .get(getDetailBlogById);
  blogRouter.route('/view')
    .get(getViewAllBlogs);
  blogRouter.route('/view/:id')
    .get(getViewBlogById);
  blogRouter.route('/view/:id/content')
    .get(getContentBlogById);
  blogRouter.route('/add')
    .post(addBlog);
  blogRouter.route('/edit/:id')
    .post(editBlog);
  blogRouter.route('/delete/:id')
    .get(deleteBlogById);
  return blogRouter;
}

module.exports = router;
