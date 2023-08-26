/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTraitCategory = /* GraphQL */ `
  query GetTraitCategory($id: ID!) {
    getTraitCategory(id: $id) {
      id
      Name
      Description
      __typename
    }
  }
`;
export const allTraitCategories = /* GraphQL */ `
  query AllTraitCategories {
    allTraitCategories {
      id
      Name
      Description
      __typename
    }
  }
`;
export const getTraitQuestionList = /* GraphQL */ `
  query GetTraitQuestionList($id: ID!) {
    getTraitQuestionList(id: $id) {
      QuestionList {
        id
        Name
        Description
        Type
        DefaultSelection
        __typename
      }
      __typename
    }
  }
`;
export const getTraitOptionList = /* GraphQL */ `
  query GetTraitOptionList($id: ID!) {
    getTraitOptionList(id: $id) {
      OptionList {
        id
        QuestionText
        __typename
      }
      __typename
    }
  }
`;
