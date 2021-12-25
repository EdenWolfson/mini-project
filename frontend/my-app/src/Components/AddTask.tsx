import { Button, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Calls } from "../Calls";

interface IProps {
  ownerId: string;
  postNewTask: (data: ITaskPostValues) => Promise<void>;
  closeAddTask: () => void;
}

export default function AddTask({
  ownerId,
  postNewTask,
  closeAddTask,
}: IProps) {
  const initFormValues: ITaskPostValues = {
    title: "",
    details: "",
    dueDate: "",
    status: "active",
    ownerId: ownerId,
  };

  const [formValues, setFormValues] = useState<ITaskPostValues>(initFormValues);

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
    postNewTask(formValues);
    closeAddTask();
    setFormValues(initFormValues);
  };

  return (
    <Box>
      <TextFieldsContainer>
        <TextField
          variant="outlined"
          label="title"
          onChange={(event) => handleChange("title", event)}
        />
        <TextField
          variant="outlined"
          label="details"
          onChange={(event) => handleChange("details", event)}
        />
        <TextField
          variant="outlined"
          label="dueDate"
          onChange={(event) => handleChange("dueDate", event)}
        />
        <TextField
          variant="outlined"
          label="status"
          onChange={(event) => handleChange("status", event)}
        />
      </TextFieldsContainer>
      <Button onClick={handleSubmit}>Add Task</Button>
    </Box>
  );
}

const Box = styled.div`
  /* border: black 1px solid; */
  padding: 20px;
`;

const TextFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
