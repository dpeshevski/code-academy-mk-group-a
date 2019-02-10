import axios from 'axios';
import fs from 'fs';

import urlsConfigs from '../../config/urls.json';

const baseUrl = urlsConfigs[process.env.NODE_ENV || 'dev'];
const getUsersUrl = baseUrl.users;
const { users } = baseUrl;

// listing users
async function list(req, res, next) {
  const getUsers: Object = await axios.get(users);
  const { data } = getUsers;

  res.status(200).send(data);
  await next;
}

// get user by
const get = async(req, res, next) => {
  const { id }: { id: string } = req.params;
  
  const getUsers: Object = await axios.get(users);
  const { data } = getUsers;

  const user: Object = data.filter(user => user.id.toString() === id);

  const usersIds = data.map(i => i.id.toString());
  const checkUser: boolean = usersIds.includes(id);

  if (checkUser) {
    const checkFile: boolean = fs.existsSync('storageData.json');
    if (checkFile) {
      const readStorageFile = fs.readFileSync('storageData.json');
      const parsedReadStorageData: Array = JSON.parse(readStorageFile);
      parsedReadStorageData.push(...user);
      
      const writeDataToStorageFile: string = JSON.stringify(parsedReadStorageData, null, 2);
      fs.writeFileSync('storageData.json', writeDataToStorageFile);
    } else {
      const writeDataToStorageFile: string = JSON.stringify(user, null, 2);
      fs.writeFileSync('storageData.json', writeDataToStorageFile);
    }
    res.status(200).send(user);
  } else {
    res.status(404).send({ message: `User id ${id} is not found`});
  }
  await next;
};

// create user
const create = async (req, res, next) => {
  try {
    const createData: {
      id: number,
      name: string,
      email: string,
      address: ?Object<{
        street: string,
        suite: string,
        city: string,
        zipcode: string,
        geo: Object<{
          lat: string,
          lng: string
        }>
      }>,
      phone: ?string,
      website: ?string,
      company: ?Object<{
        name: string,
        catchPhrase: string,
        bs: string
      }>
    } = req.body;
  
    const { data } = await axios({ method: 'post', url: users, data: createData });

    res.status(201).send(data);
    
  } catch (error) {
    res.status(400).send({ error: error.toString() });
  }
  
  await next;
};

export default {
  list,
  get,
  create,
};
