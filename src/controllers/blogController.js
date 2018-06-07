function blogController(sql) {
  function getDetailAllBlogs(req, res) {
    return new Promise((resolve, reject) => {
      const request = new sql.Request();
      request.query('SELECT * from dbo.Blog').then((result) => {
        const blogs = result.recordset;
        res.json(blogs);
        resolve(blogs);
      }).catch(error => reject(error));
    });
  }
  function getViewAllBlogs(req, res) {
    return new Promise((resolve, reject) => {
      const request = new sql.Request();
      request.query('SELECT blogID, name, image, time from dbo.Blog').then((result) => {
        const blogs = result.recordset;
        res.json(blogs);
        resolve(blogs);
      }).catch(error => reject(error));
    });
  }
  function getDetailBlogById(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      const request = new sql.Request();
      request.query(`SELECT * from dbo.Blog WHERE blogID=${id}`).then((result) => {
        const blog = result.recordset;
        res.json(blog);
        resolve(blog);
      }).catch(error => reject(error));
    });
  }
  function getViewBlogById(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      const request = new sql.Request();
      request.query(`SELECT blogID, name, image, time FROM dbo.Blog WHERE blogID=${id}`).then((result) => {
        const blog = result.recordset;
        res.json(blog);
        resolve(blog);
      }).catch(error => reject(error));
    });
  }
  function getContentBlogById(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      const request = new sql.Request();
      request.query(`SELECT content FROM dbo.Blog WHERE blogID=${id}`).then((result) => {
        const blog = result.recordset;
        res.json(blog);
        resolve(blog);
      }).catch(error => reject(error));
    });
  }
  function addBlog(req, res) {
    return new Promise((resolve, reject) => {
      const { name, image, content } = req.body;
      const transaction = new sql.Transaction();
      const request = new sql.Request(transaction);
      if (image) {
        transaction.begin(() => {
          request.query(`INSERT INTO dbo.Blog (name, image, content, time)
          VALUES (N'${name}', ${image},N'${content}', GETDATE())`)
            .then((result) => {
              transaction.commit();
              res.send(result);
              resolve(result);
            }).catch((err) => {
              res.send(err);
              reject(err);
            });
        });
      } else {
        transaction.begin(() => {
          request.query(`INSERT INTO dbo.Blog (name, content, time)
           VALUES (N'${name}',N'${content}', GETDATE())`)
            .then((result) => {
              transaction.commit();
              res.send(result);
              resolve(result);
            }).catch((err) => {
              res.send(err);
              reject(err);
            });
        });
      }
    });
  }
  function editBlog(req, res) {
    return new Promise((resolve, reject) => {
      const blogID = req.params.id;
      const { name, image, content } = req.body;
      const transaction = new sql.Transaction();
      const request = new sql.Request(transaction);
      if (image) {
        transaction.begin(() => {
          request.query(`UPDATE dbo.Blog SET name = N'${name}', image = ${image},
           content = N'${content}', time= GETDATE() WHERE blogID = ${blogID}`)
            .then((result) => {
              transaction.commit();
              res.send(result);
              resolve(result);
            }).catch((err) => {
              res.send(err);
              reject(err);
            });
        });
      } else {
        transaction.begin(() => {
          request.query(`UPDATE dbo.Blog SET name = N'${name}',
          content = N'${content}', time= GETDATE() WHERE blogID = ${blogID}`)
            .then((result) => {
              transaction.commit();
              res.send(result);
              resolve(result);
            }).catch((err) => {
              res.send(err);
              reject(err);
            });
        });
      }
    });
  }
  function deleteBlogById(req, res) {
    return new Promise((resolve, reject) => {
      const { id } = req.params;
      const transaction = new sql.Transaction();
      const request = new sql.Request(transaction);
      transaction.begin(() => {
        request.query(`DELETE from dbo.Blog WHERE blogID = ${id}`)
          .then((result) => {
            transaction.commit();
            res.send(result);
            resolve(result);
          }).catch((err) => {
            res.send(err);
            reject(err);
          });
      });
    });
  }
  return {
    getDetailAllBlogs,
    getDetailBlogById,
    getViewAllBlogs,
    getContentBlogById,
    addBlog,
    editBlog,
    getViewBlogById,
    deleteBlogById
  };
}

module.exports = blogController;
