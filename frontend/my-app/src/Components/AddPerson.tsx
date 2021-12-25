import { Button, TextField } from "@mui/material";
import { useState } from "react";
import styled from "styled-components";

interface IProps {
  postNewPerson: (data: IPersonPostValues) => void;
}

export default function AddPerson({ postNewPerson }: IProps) {
  const initFormValues: IPersonPostValues = {
    name: "",
    email: "",
    favoriteProgrammingLanguage: "",
  };

  const [formValues, setFormValues] =
    useState<IPersonPostValues>(initFormValues);

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
    postNewPerson(formValues);
    setFormValues(initFormValues);
  };

  return (
    <Box>
      <TextFieldsContainer>
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
        <Button onClick={handleSubmit}>Add Person</Button>
      </TextFieldsContainer>
    </Box>
  );
}

const Box = styled.div`
  border: black 1px solid;
`;

const TextFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
