import axios from 'axios';
import urlsConfigs from '../../config/urls.json';

const baseUrl = urlsConfigs[process.env.NODE_ENV || 'dev'];
const getUsersUrl = baseUrl.users;

const { users } = baseUrl;

// const names = {
//   name1: 'ana', name2: 'marija', name3: 'igor', name4: 'sevda'};
// const { name1, name2 } = names;
// const name1 = names.name1;

// listing users
async function list(req, res, next) {
  const getUsers = await axios.get(users);
  
  const { data } = getUsers;
  res.status(200).send(data);
  await next;
}

// get user by
const get = async(req, res, next) => {
  const { id }: { id: string } = req.params;
  
  const getUsers = await axios.get(users);
  const { data } = getUsers;

  const user: Object = data.filter(user => user.id.toString() === id);

  res.status(200).send(user);

  await next;
};

export default {
  list,
  get,
};
