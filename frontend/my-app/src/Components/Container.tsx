import React, { useEffect, useState } from "react";
import { Calls } from "../Calls";
import styled from "styled-components";
import AddPerson from "./AddPerson";
import Person from "./Person";

interface ITaskData {
  title: string;
  details: string;
  dueDate: string;
  status: "active" | "done";
  ownerId: string;
}

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

  useEffect(() => {
    async function getOne() {
      console.log("getOne");
      const result = await Calls.getPerson(
        "55f1327f-3593-44cf-936b-0b5a7f13c4e8"
      );
      console.log(result);
      return result;
    }
    async function patchSomeone() {
      const data = {
        name: "E",
        email: "eden@bgu.ac.il",
        favoriteProgrammingLanguage: "TypeScript",
      };
      console.log("getOne");
      const result = await Calls.patchPerson(
        "55f1327f-3593-44cf-936b-0b5a7f13c4e8",
        { email: "shirWolfson@gmail.com" }
      );
      console.log(result);
      return result;
    }
    async function deleteSomeone() {
      const result = await Calls.deletePerson(
        "55f1327f-3593-44cf-936b-0b5a7f13c4e8"
      );
      console.log(result);
      return result;
    }
    async function postTask() {}
    // getOne();
    // patchSomeone();
    // deleteSomeone();
  });

  const update = () => {
    setForceUpdate(!forceUpdate);
  };

  const postNewPerson = async (data: IPersonPostValues) => {
    const newPerson: IPersonData = await Calls.postPeople(data);
    setPeople([...people, newPerson]);
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
