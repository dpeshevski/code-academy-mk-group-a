import models from '../models/index';
import hat from 'hat';

const Posts = models.Posts;

const createPost = async (req, res, next) => {
  const {
    content,
    userId
  }: {
    content: string,
    userId: string
  } = req.body;

  const postId = hat();

  await Posts.create({
    id: postId,
    content,
    userId
  });

  res.status(201).send({ info: 'Post has been created!'});

  await next;
}

export default {
  createPost,
};
