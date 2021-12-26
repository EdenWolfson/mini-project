import { Button, IconButton, TextField } from "@mui/material";
import { useEffect, useState } from "react";
import styled from "styled-components";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import { Calls } from "../Calls";
import TaskList from "./TaskList";

interface IProps {
  id: string;
  patchPerson: (id: string, data: any) => Promise<void>;
  deletePerson: (id: string) => Promise<void>;
}

export default function Person({ id, patchPerson, deletePerson }: IProps) {
  const [formValues, setFormValues] = useState<IPersonPostValues>({
    name: "",
    email: "",
    favoriteProgrammingLanguage: "",
  });

  const [isPatch, setIsPatch] = useState<boolean>(false);

  const fields = ["name", "email", "favoriteProgrammingLanguage"];

  useEffect(() => {
    async function getPerson() {
      const result: IPersonData = await Calls.getPerson(id);
      setFormValues(result);
    }
    getPerson();
  }, [id]);

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
    patchPerson(id, formValues);
    setIsPatch(false);
  };

  return (
    <Box>
      <IconButton onClick={() => setIsPatch(!isPatch)}>
        <EditIcon
          style={{
            color: "#1976d2",
          }}
        />
      </IconButton>
      <IconButton onClick={() => deletePerson(id)}>
        <DeleteIcon
          style={{
            color: "#1976d2",
          }}
        />
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
          <Button
            variant="contained"
            onClick={handleSubmit}
            style={{ textTransform: "none" }}
          >
            Patch Person
          </Button>
        </FormContainer>
      ) : (
        <div>
          <Name>{formValues.name}</Name>
          <Field>{formValues.email}</Field>
          <Field>{formValues.favoriteProgrammingLanguage}</Field>
          <Field>{id}</Field>
        </div>
      )}
      <TaskList id={id} />
    </Box>
  );
}

const Box = styled.div`
  border: #a7abbe 1px solid;
  border-right: none;
  padding: 20px;
  width: 370px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Name = styled.h2`
  color: #6a7281;
  font-size: 30px;
`;

const Field = styled.h3`
  color: #3e434b;
`;
