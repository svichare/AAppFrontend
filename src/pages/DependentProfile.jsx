import {React, useState} from "react";

import * as S from "./DependentProfileStyles";
import { NavBar } from '../components';

export default function DependentProfile({dependentId}) {
  const [dependentData, setDependentData] = useState({
    name: "Rahagir",
    lastName: "Kaavi",
    id: "topId",
    age: 4
  });

  return (
    <S.Container>
      <S.Main>
          <NavBar />
          <h2> Super hero profile</h2>
          <h2>{dependentData.name}</h2>
          <h3>Age: {dependentData.age}</h3>
      </S.Main>
    </S.Container>
  );
}
