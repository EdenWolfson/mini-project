import { Button, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Calls } from "../Calls";

interface IProps {
  taskId: string;
  patchTask: (id: string, data: any) => Promise<void>;
  deleteTask: (id: string) => Promise<void>;
}

export default function Task({ taskId, patchTask, deleteTask }: IProps) {
  const [task, setTask] = useState<ITaskData>();
  const [isPatch, setIsPatch] = useState<boolean>(false);
  const [formValues, setFormValues] = useState<ITaskPutValues>({
    title: "",
    details: "",
    dueDate: "",
    status: undefined,
  });

  const fields = ["title", "details", "dueDate", "status"];

  useEffect(() => {
    async function getTask() {
      const result: ITaskData = await Calls.getTask(taskId);
      setTask(result);
      setFormValues(result);
    }
    getTask();
  }, []);

  const handleChange = (
    field: string,
    event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>
  ) => {
    setFormValues({
      ...formValues,
      [field]: event.target.value,
    });
  };

  const handleSubmit = () => {
    patchTask(taskId, formValues);
    setIsPatch(false);
  };

  return (
    <div>
      <IconButton onClick={() => setIsPatch(!isPatch)}>
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => deleteTask(taskId)}>
        <DeleteIcon />
      </IconButton>
      {isPatch ? (
        <FormContainer>
          {fields.map((field, index) => (
            <TextField
              key={index}
              variant="outlined"
              label={field}
              onChange={(event) => handleChange(field, event)}
            />
          ))}
          <Button onClick={handleSubmit}>Patch Task</Button>
        </FormContainer>
      ) : (
        <div>
          <h2>{task?.title}</h2>
          <h3>Details: {task?.details}</h3>
          <h3>Due Date: {task?.dueDate}</h3>
          <h3>Owner ID: {task?.ownerId}</h3>
          <h3>Status: {task?.status}</h3>
        </div>
      )}
    </div>
  );
}

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
