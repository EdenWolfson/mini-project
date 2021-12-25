import axios from "axios";

const BASE = "http://127.0.0.1:8009/";

const Endpoints = {
  people: "people/",
  tasks: "tasks/",
  status: "status",
  owner: "owner",
};

async function get(url: string) {
  try {
    const response = await axios.get(BASE + url);
    return response.data;
  } catch (error) {
    return error;
  }
}

async function post(url: string, data: any) {
  try {
    const response = await axios.post(BASE + url, data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function patch(url: string, data: any) {
  try {
    const response = await axios.patch(BASE + url, data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function deletee(url: string) {
  try {
    const response = await axios.delete(BASE + url);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function put(url: string, data: any) {
  try {
    const response = await axios.put(BASE + url, data);
    return response.data;
  } catch (error) {
    console.log(error);
  }
}

async function postPeople(data: any) {
  return await post(Endpoints.people, data);
}

async function getAllPeople() {
  return await get(Endpoints.people);
}

async function getPerson(id: string) {
  return await get(Endpoints.people + id);
}

async function patchPerson(id: string, data: any) {
  return await patch(Endpoints.people + id, data);
}

async function deletePerson(id: string) {
  return await deletee(Endpoints.people + id);
}

async function getPersonTasks(id: string) {
  return await get(Endpoints.people + id + "/" + Endpoints.tasks);
}

async function postPersonTasks(id: string, data: any) {
  return await post(Endpoints.people + id + "/" + Endpoints.tasks, data);
}

async function getTask(id: string) {
  return await get(Endpoints.tasks + id);
}

async function patchTask(id: string, data: any) {
  return await patch(Endpoints.tasks + id, data);
}

async function deleteTask(id: string) {
  return await deletee(Endpoints.tasks + id);
}

async function getTaskStatus(id: string) {
  return await get(Endpoints.tasks + id + "/" + Endpoints.status);
}

async function putTaskStatus(id: string, data: any) {
  return await put(Endpoints.tasks + id + "/" + Endpoints.status, data);
}

async function getTaskOwner(id: string) {
  return await get(Endpoints.tasks + id + "/" + Endpoints.owner);
}

async function putTaskOwner(id: string, data: any) {
  return await put(Endpoints.tasks + id + "/" + Endpoints.owner, data);
}

export const Calls = {
  postPeople,
  getAllPeople,
  getPerson,
  patchPerson,
  deletePerson,
  getPersonTasks,
  postPersonTasks,
  getTask,
  patchTask,
  deleteTask,
  getTaskStatus,
  putTaskStatus,
  getTaskOwner,
  putTaskOwner,
};
