import React from "react";

import * as S from "./HomeStyles";
import { NavBar } from '../components';


export default function Home() {
  return (
    <S.Container>
      <S.Main>
          <NavBar />
      </S.Main>
      <S.Bottom />
    </S.Container>
  );
}