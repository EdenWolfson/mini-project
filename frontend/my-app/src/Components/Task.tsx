import { Button, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Calls } from "../Calls";

interface IProps {
  taskId: string;
}

export default function Task({ taskId }: IProps) {
  const [task, setTask] = useState<ITaskData>();

  useEffect(() => {
    async function getTask() {
      const result: ITaskData = await Calls.getTask(taskId);
      setTask(result);
    }
    getTask();
  }, []);

  // const update = () => {
  //   setForceUpdate(!forceUpdate);
  // };

  return (
    <div>
      <h2>{task?.title}</h2>
      <h3>Details: {task?.details}</h3>
      <h3>Due Date: {task?.dueDate}</h3>
      <h3>Owner ID: {task?.ownerId}</h3>
      <h3>Status: {task?.status}</h3>
    </div>
  );
}
