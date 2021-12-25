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

  useEffect(() => {
    async function getPerson() {
      const result: IPersonData = await Calls.getPerson(id);
      setFormValues(result);
    }
    getPerson();
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
    patchPerson(id, formValues);
    setIsPatch(false);
  };

  return (
    <Box>
      <IconButton onClick={() => setIsPatch(!isPatch)}>
        <EditIcon />
      </IconButton>
      <IconButton onClick={() => deletePerson(id)}>
        <DeleteIcon />
      </IconButton>
      {isPatch ? (
        <FormContainer>
          <TextField
            variant="outlined"
            label={"name"}
            onChange={(event) => handleChange("name", event)}
          />
          <TextField
            variant="outlined"
            label={"email"}
            onChange={(event) => handleChange("email", event)}
          />
          <TextField
            variant="outlined"
            label={"favoriteProgrammingLanguage"}
            onChange={(event) =>
              handleChange("favoriteProgrammingLanguage", event)
            }
          />
          <Button onClick={handleSubmit}>Patch Person</Button>
        </FormContainer>
      ) : (
        <div>
          <h2>{formValues.name}</h2>
          <h3>{formValues.email}</h3>
          <h3>{formValues.favoriteProgrammingLanguage}</h3>
          <h3>{id}</h3>
        </div>
      )}
      <TaskList id={id} />
    </Box>
  );
}

const Box = styled.div`
  border: black 1px solid;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
