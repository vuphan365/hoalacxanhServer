const express = require('express');

const blogRouter = express.Router();
const blogController = require('../controllers/blogController');
const adminController = require('../controllers/adminController');
const jsontoken = require('../config/jsontoken');

function router(sql) {
  const { getDetailAllBlogs, getDetailBlogById, getViewBlogById, addBlog, editBlog,
    getViewAllBlogs, getContentBlogById, deleteBlogById }
    = blogController(sql);
  const { isAdminExist } = adminController(sql);
  const { validateToken } = jsontoken();
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
    .all((req, res, next) => {
      validateToken(req, res, next, isAdminExist);
    })
    .post(addBlog);
  blogRouter.route('/edit/:id')
    .all((req, res, next) => {
      validateToken(req, res, next, isAdminExist);
    })
    .post(editBlog);
  blogRouter.route('/delete/:id')
    .all((req, res, next) => {
      validateToken(req, res, next, isAdminExist);
    })
    .get(deleteBlogById);
  return blogRouter;
}

module.exports = router;
