import axios from 'axios';
import fs from 'fs';
import hat from 'hat';

import urlsConfigs from '../../config/urls.json';

import models from '../models/index';

const baseUrl = urlsConfigs[process.env.NODE_ENV || 'dev'];
const getUsersUrl = baseUrl.users;
const { users } = baseUrl;

const Users = models.Users;

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
    const checkFile: boolean = fs.existsSync('localStorage.json');
    if (checkFile) {
      const readStorageFile = fs.readFileSync('localStorage.json');
      const parsedReadStorageData: Array = JSON.parse(readStorageFile);
      parsedReadStorageData.push(...user);
      
      const writeDataToStorageFile: string = JSON.stringify(parsedReadStorageData, null, 2);
      fs.writeFileSync('localStorage.json', writeDataToStorageFile);
    } else {
      const writeDataToStorageFile: string = JSON.stringify(user, null, 2);
      fs.writeFileSync('localStorage.json', writeDataToStorageFile);
    }
    res.status(200).send(user);
  } else {
    res.status(404).send({ message: `User id ${id} is not found`});
  }
  await next;
};

const getUsersWithInclude = async (req, res, next) => {
  const result: Object = await Users.findAll({
    include: [
      {
        model: models.Posts,
        include: [
          {
            model: models.Comments
          }
        ]
      }
    ]
  });

  const resObj = result.map(user => {
    return Object.assign(
      {},
      {
        userId: user.id,
        email: user.email,
        name: user.name,
        posts: user.posts.map(post => {
          return Object.assign(
            {},
            {
              postId: post.id,
              userId: post.userId,
              content: post.content,
              comments: post.comments.map(comment => {
                return Object.assign(
                  {},
                  {
                    commentId: comment.id,
                    postId: comment.postId,
                    commenterUsername: comment.commenterUsername,
                    commenterEmail: comment.commenterEmail,
                    content: comment.content
                  }
                )
              })
            }
          )
        })
      }
    )
  });
  res.status(200).json(resObj);

  await next;
}

const listAllUsers = async (req, res, next) => {
  const results: Array = await Users.findAll();
  res.status(200).send(results);
  await next;
}

const registerUser = async (req, res, next) => {
  const {
    email,
    name
  }: {
    email: string,
    name: string
  } = req.body;

  const userId = hat();

  await Users.create({
    id: userId,
    name,
    email
  });
  res.status(201).send({ info: 'User has been created!'});

  await next;
}

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

    const checkFile: boolean = fs.existsSync('localStorage.json');
    if (checkFile) {
      const readStorageFile = fs.readFileSync('localStorage.json');
      const parsedReadStorageData = JSON.parse(readStorageFile);

      const checkName = parsedReadStorageData.filter(n => n.name === createData.name);
      const checkEmail = parsedReadStorageData.filter(e => e.email === createData.email);  
      
      if (createData.name && checkName.length > 0) {
        res.status(400).json({ info: `Name ${createData.name} is already exists`});
      } else if (createData.email && checkEmail.length > 0) {
        res.status(400).json({ info: `Email ${createData.email} is taken`});
      } else {
        parsedReadStorageData.push(createData);
        const writeDataToStorageFile: string = JSON.stringify(parsedReadStorageData, null, 2);
        fs.writeFileSync('localStorage.json', writeDataToStorageFile);
      }
    } else {
      const writeDataToStorageFile: string = JSON.stringify([createData], null, 2);
      fs.writeFileSync('localStorage.json', writeDataToStorageFile);
    }
    res.status(201).send(createData);
  } catch (error) {
    console.error(error);
  }
  
  await next;
};

const update = async (req, res, next) => {
  try {
    const { id }: { id: string } = req.params;
    const updateData: {
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
    } = Object.assign({}, req.body);

    const checkFile: boolean = fs.existsSync('localStorage.json');
    if (checkFile) {
      const readStorageFile = fs.readFileSync('localStorage.json');
      const parsedReadStorageData = JSON.parse(readStorageFile);

      const checkName = parsedReadStorageData.filter(n => n.name === updateData.name);
      const checkEmail = parsedReadStorageData.filter(e => e.email === updateData.email);  
      
      if (updateData.name && checkName.length > 0) {
        res.status(400).json({ info: `Name ${updateData.name} is already exists`});
      } else if (updateData.email && checkEmail.length > 0) {
        res.status(400).json({ info: `Email ${updateData.email} is taken`});
      } else {
        const foundIndex = parsedReadStorageData.findIndex(i => i.id.toString() === `${id}`);
        parsedReadStorageData.splice(foundIndex, 1, updateData);
        
        const writeDataToStorageFile: string = JSON.stringify(parsedReadStorageData, null, 2);
        fs.writeFileSync('localStorage.json', writeDataToStorageFile);
        res.status(204).send({ info: `User ${id} is updated`});
      }
    } else {
      res.status(404).send({ info: 'Storage is not found!'});
    }
  } catch (err) {
    console.error(err);
    res.status(400).json({ info: err.toString() })
  }
  await next;
}

const del = async (req, res, next) => {
  const { id }: { id: string } = req.params;

  const checkFile: boolean = fs.existsSync('localStorage.json');
  if (checkFile) {
    const readStorageFile = fs.readFileSync('localStorage.json');
    const parsedReadStorageData = JSON.parse(readStorageFile);
    
    parsedReadStorageData.splice(parsedReadStorageData.findIndex(i => i.id.toString() === `${id}`), 3);
    
    const writeDataToStorageFile: string = JSON.stringify(parsedReadStorageData, null, 2);
    fs.writeFileSync('localStorage.json', writeDataToStorageFile);
  } else {
    res.status(404).send({ info: `Storage is not found`});
  }
  res.status(202).send({ info: `Id ${id} has been removed from Local Storage`});
  await next;
};

export default {
  list,
  get,
  getUsersWithInclude,
  listAllUsers,
  create,
  update,
  registerUser,
  del,
};
