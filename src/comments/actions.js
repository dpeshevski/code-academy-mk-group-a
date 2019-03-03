import models from '../models/index';
import hat from 'hat';

const Comments = models.Comments;

const addComment = async (req, res, next) => {
  const {
    content,
    commenterUsername,
    commenterEmail,
    postId,
  }: {
    postId: string,
    content: string,
    commenterUsername: string,
    commenterEmail: string
  } = req.body;

  const commentId = hat();

  await Comments.create({
    id: commentId,
    content,
    commenterUsername,
    commenterEmail,
    postId
  });

  res.status(201).send({ info: 'Comment is added'});
  await next;
}

export default {
  addComment
};
