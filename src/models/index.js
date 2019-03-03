import Sequelize from 'sequelize';
import connection from '../db/sequelize';

const models = {
  Student: connection.import('../students/model'),
  Comments: connection.import('../comments/model'),
  Posts: connection.import('../posts/model'),
  Users: connection.import('../users/model')
};

Object.keys(models).forEach((modelName) => {
  if ('associate' in models[modelName]) {
    models[modelName].associate(models);
  }
});

models.Comments.belongsTo(models.Posts);  
models.Posts.hasMany(models.Comments);  
models.Posts.belongsTo(models.Users);  
models.Users.hasMany(models.Posts);

models.connection = connection;
models.Sequelize = Sequelize;

export default models;
