import { useEffect, useState } from "react";
import { Calls } from "../Calls";
import styled from "styled-components";
import AddPerson from "./AddPerson";
import Person from "./Person";

export default function Container() {
  const [people, setPeople] = useState<IPersonData[]>([]);
  const [forceUpdate, setForceUpdate] = useState<boolean>(false);

  useEffect(() => {
    async function getAll() {
      const result = await Calls.getAllPeople();
      setPeople(result);
    }
    getAll();
  }, [forceUpdate]);

  const update = () => {
    setForceUpdate(!forceUpdate);
  };

  const postNewPerson = async (data: IPersonPostValues) => {
    await Calls.postPeople(data);
    update();
  };

  const patchPerson = async (id: string, data: any) => {
    await Calls.patchPerson(id, data);
    update();
  };

  const deletePerson = async (id: string) => {
    await Calls.deletePerson(id);
    update();
  };

  return (
    <BigContainer>
      <Taskboard>Taskboard</Taskboard>
      <PeopleContainer>
        {people.map((person, index) => (
          <Person
            key={index}
            id={person.id}
            patchPerson={patchPerson}
            deletePerson={deletePerson}
          />
        ))}
        <AddPerson postNewPerson={postNewPerson} />
      </PeopleContainer>
    </BigContainer>
  );
}

const BigContainer = styled.div``;

const PeopleContainer = styled.div`
  display: inline-flex;
  flex-direction: row;
  box-shadow: 0 0 10px #8e9aaf;
  margin: 20px 50px;
`;

const Taskboard = styled.h1`
  margin-top: 50px;
  color: #8e9aaf;
`;
