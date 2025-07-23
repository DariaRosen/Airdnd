import { storageService } from "./async-storage.service.js"
import { utilService } from "./util.service.js"
import usersData from "../data/users.json"

const STORAGE_KEY_LOGGEDIN_USER = "loggedinUser"
const STORAGE_KEY_USER_DB = "userDB"

export const userService = {
  login,
  logout,
  signup,
  getLoggedinUser,
  saveLocalUser,
  getUsers,
  getById,
  remove,
  update,
  getEmptyUser,
}

window.userService = userService

_createUsers()

function getUsers() {
  return storageService.query(STORAGE_KEY_USER_DB)
}

async function getById(userId) {
  return await storageService.get(STORAGE_KEY_USER_DB, userId)
}

function remove(userId) {
  return storageService.remove(STORAGE_KEY_USER_DB, userId)
}

async function update(userToUpdate) {
  const user = await getById(userToUpdate.id)
  const updatedUser = await storageService.put(STORAGE_KEY_USER_DB, {
    ...user,
    ...userToUpdate,
  })
  if (getLoggedinUser()?.id === updatedUser.id) saveLocalUser(updatedUser)
  return updatedUser
}

async function login(userCred) {
  const users = await storageService.query(STORAGE_KEY_USER_DB)
  const user = users.find(
    (user) =>
      user.username === userCred.username && user.password === userCred.password
  )
  if (user) return saveLocalUser(user)
  else throw new Error("Invalid credentials")
}

async function signup(userCred) {
  const user = {
    ...getEmptyUser(),
    ...userCred,
  }
  if (!user.imgUrl) {
    user.imgUrl =
      "https://cdn.pixabay.com/photo/2020/07/01/12/58/icon-5359553_1280.png"
  }
  const savedUser = await storageService.post(STORAGE_KEY_USER_DB, user)
  return saveLocalUser(savedUser)
}

function logout() {
  sessionStorage.removeItem(STORAGE_KEY_LOGGEDIN_USER)
}

function getEmptyUser() {
  return {
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    email: "",
    imgUrl: "",
  }
}

function saveLocalUser(user) {
  const minimalUser = {
    id: user.id,
    firstName: user.firstName,
    lastName: user.lastName,
    imgUrl: user.imgUrl,
    role: user.role,
  }
  sessionStorage.setItem(STORAGE_KEY_LOGGEDIN_USER, JSON.stringify(minimalUser))
  return minimalUser
}

function getLoggedinUser() {
  return JSON.parse(sessionStorage.getItem(STORAGE_KEY_LOGGEDIN_USER))
}

function _createUsers() {
  let users = utilService.loadFromStorage(STORAGE_KEY_USER_DB)
  if (!users || !users.length) {
    users = usersData
    utilService.saveToStorage(STORAGE_KEY_USER_DB, users)
  }
  return users
}
