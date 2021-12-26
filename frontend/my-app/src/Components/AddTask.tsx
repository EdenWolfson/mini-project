import { Button, TextField } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";

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

  const fields = ["title", "details", "dueDate", "status"];

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
        {fields.map((field, index) => (
          <StyledTextField
            key={index}
            variant="outlined"
            label={field}
            onChange={(event) => handleChange(field, event)}
          />
        ))}
        <Button
          variant="contained"
          onClick={handleSubmit}
          style={{ textTransform: "none" }}
        >
          Add Task
        </Button>
      </TextFieldsContainer>
    </Box>
  );
}

const Box = styled.div`
  padding: 20px;
`;

const TextFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 330px;
`;

const StyledTextField = styled(TextField)`
  box-shadow: 0 0 10px #dee4ff;
`;
