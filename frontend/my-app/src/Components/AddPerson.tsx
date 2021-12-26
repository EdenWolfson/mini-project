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

  const fields = ["name", "email", "favoriteProgrammingLanguage"];

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

  const getValue = (field: string) => {
    return field === "name"
      ? formValues.name
      : field === "email"
      ? formValues.email
      : formValues.favoriteProgrammingLanguage;
  };

  return (
    <Box>
      <TextFieldsContainer>
        {fields.map((field: string, index) => (
          <StyledTextField
            key={index}
            variant="outlined"
            label={field}
            onChange={(event) => handleChange(field, event)}
            value={getValue(field)}
          />
        ))}
        <Button
          variant="contained"
          onClick={handleSubmit}
          style={{ textTransform: "none" }}
        >
          Add Person
        </Button>
      </TextFieldsContainer>
    </Box>
  );
}

const Box = styled.div`
  border: #a7abbe 1px solid;
  padding: 20px;
`;

const TextFieldsContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 250px;
`;

const StyledTextField = styled(TextField)`
  box-shadow: 0 0 10px #dee4ff;
`;
