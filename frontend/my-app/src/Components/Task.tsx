import { Button, ButtonGroup, IconButton, TextField } from "@mui/material";
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

  const [owner, setOwner] = useState<string>();
  const [status, setStatus] = useState<string>();
  const [isSetStatus, setIsSetStatus] = useState<boolean>(false);
  const [isSetOwner, setIsSetOwner] = useState<boolean>(false);

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

  const handleGetOwner = async () => {
    const response = await Calls.getTaskOwner(taskId);
    setOwner(response);
  };

  const handleGetStatus = async () => {
    const response = await Calls.getTaskStatus(taskId);
    setStatus(response);
  };

  return (
    <Container>
      <IconButton onClick={() => setIsPatch(!isPatch)}>
        <EditIcon
          style={{
            color: "#1976d2",
          }}
        />
      </IconButton>
      <IconButton onClick={() => deleteTask(taskId)}>
        <DeleteIcon
          style={{
            color: "#1976d2",
          }}
        />
      </IconButton>
      {isPatch ? (
        <FormContainer>
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
            Patch Task
          </Button>
        </FormContainer>
      ) : (
        <SmallContainer>
          <div>
            <h2>{task?.title}</h2>
            <h3>Details: {task?.details}</h3>
            <h3>Due Date: {task?.dueDate}</h3>
          </div>
          <ButtonsContainer>
            <Button variant="contained" onClick={handleGetOwner}>
              Get Owner
            </Button>
            {owner && <h3>Owner ID: {owner}</h3>}
            {isSetOwner ? (
              <div>
                <Button
                  variant="contained"
                  onClick={() => setIsSetOwner(false)}
                >
                  Cancel
                </Button>
                <TextField size="small" label="New Owner ID" />
              </div>
            ) : (
              <Button variant="contained" onClick={() => setIsSetOwner(true)}>
                Set Owner
              </Button>
            )}
            <Button variant="contained" onClick={handleGetStatus}>
              Get Status
            </Button>
            {status && <h3>Status: {status}</h3>}
            {isSetStatus ? (
              <div>
                <Button
                  variant="contained"
                  onClick={() => setIsSetStatus(false)}
                >
                  Cancel
                </Button>
                <TextField size="small" label="New Status" />
              </div>
            ) : (
              <Button variant="contained" onClick={() => setIsSetStatus(true)}>
                Set Status
              </Button>
            )}
          </ButtonsContainer>
        </SmallContainer>
      )}
    </Container>
  );
}

const Container = styled.div`
  text-align: center;
  padding: 20px;
`;

const FormContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 320px;
  padding-top: 20px;
`;

const StyledTextField = styled(TextField)`
  box-shadow: 0 0 10px #dee4ff;
`;

const SmallContainer = styled.div`
  text-align: left;
  padding: 0 20px;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;
