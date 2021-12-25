import React, { useEffect, useState } from "react";
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
    const newPerson: IPersonData = await Calls.postPeople(data);
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
      <h1>My New Project!</h1>
      <PeopleContainer>
        {people.map((person) => (
          <Person
            // email={person.email}
            // favoriteProgrammingLanguage={person.favoriteProgrammingLanguage}
            id={person.id}
            // name={person.name}
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
  display: flex;
  flex-direction: row;
`;
