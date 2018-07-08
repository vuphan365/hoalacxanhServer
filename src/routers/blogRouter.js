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
    .post((req, res) => {
      validateToken(req, res, isAdminExist).then(() => {
        addBlog(req, res);
      }).catch(() => res.sendStatus(403));
    });
  blogRouter.route('/edit/:id')
    .post((req, res) => {
      validateToken(req, res, isAdminExist).then(() => {
        editBlog(req, res);
      }).catch(() => res.sendStatus(403));
    });
  blogRouter.route('/delete/:id')
    .post((req, res) => {
      validateToken(req, res, isAdminExist).then(() => {
        deleteBlogById(req, res);
      }).catch(() => res.sendStatus(403));
    });
  return blogRouter;
}

module.exports = router;
