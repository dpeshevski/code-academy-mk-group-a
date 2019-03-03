export default (sequelize, DataType) => {
  const Posts = sequelize.define('posts', {
    id: {
      type: DataType.STRING,
      primaryKey: true,
      allowNull: false
    },
    userId: {
      type: DataType.STRING,
      allowNull: false
    },
    content: {
      type: DataType.STRING,
      required: true
    },
    craetedAt: {
      type: DataType.DATE,
    },
    updatedAt: DataType.DATE,
    deletedAt: DataType.DATE
  });
  return Posts;
};
