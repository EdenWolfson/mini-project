import { Button, Dialog, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Calls } from "../Calls";
import AddIcon from "@mui/icons-material/Add";
import AddTask from "./AddTask";

interface IProps {
  id: string;
}

export default function TaskList({ id }: IProps) {
  const [tasks, setTasks] = useState<ITaskData[]>([]);
  const [openAddTask, setOpenAddTask] = useState<boolean>(false);
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);

  useEffect(() => {
    async function getTasks() {
      const result = await Calls.getPersonTasks(id);
      console.log(result);
      setTasks(result);
    }
    getTasks();
  }, [forceUpdate]);

  const update = () => {
    setForceUpdate(!forceUpdate);
  };

  const postNewTask = async (data: ITaskPostValues) => {
    const newTask: ITaskPostValues = await Calls.postPersonTasks(id, data);
    update();
  };

  const closeAddTask = () => {
    setOpenAddTask(false);
  };

  return (
    <div>
      <h2>Tasks:</h2>
      {tasks.map((task) => (
        <h4>{task.title}</h4>
      ))}
      <IconButton onClick={() => setOpenAddTask(true)}>
        <AddIcon />
      </IconButton>
      <Dialog open={openAddTask} onClose={() => setOpenAddTask(false)}>
        <AddTask
          ownerId={id}
          postNewTask={postNewTask}
          closeAddTask={closeAddTask}
        />
      </Dialog>
    </div>
  );
}
