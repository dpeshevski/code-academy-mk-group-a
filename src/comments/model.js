export default (sequelize, DataType) => {
  const Comments = sequelize.define('comments', {
    id: {
      type: DataType.STRING,
      primaryKey: true,
      allowNull: false
    },
    postId: {
      type: DataType.STRING,
      allowNull: false,
    },
    content: {
      type: DataType.TEXT,
      required: true
    },
    commenterUsername: {
      type: DataType.STRING,
      required: true
    },
    commenterEmail: {
      type: DataType.STRING,
      required: true
    },
    status: {
      type: DataType.ENUM,
      values: ['approved', 'rejected', 'in review', 'pending'],
      defaultValue: 'pending'
    },
    createdAt: {
      type: DataType.DATE
    },
    updatedAt: DataType.DATE,
    deletedAt: DataType.DATE
  });
  return Comments;
}