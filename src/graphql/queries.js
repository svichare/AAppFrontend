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
        OptionText
        __typename
      }
      __typename
    }
  }
`;
export const getParentDetails = /* GraphQL */ `
  query GetParentDetails($email: String) {
    getParentDetails(email: $email) {
      id
      Name
      LastName
      ImageURL
      DependentList {
        id
        name
        thumbnail_url
        image_url
        __typename
      }
      __typename
    }
  }
`;
export const getDependentDetails = /* GraphQL */ `
  query GetDependentDetails($name: String) {
    getDependentDetails(name: $name) {
      id
      name
      thumbnail_url
      image_url
      __typename
    }
  }
`;
export const getTraitCategoryResponses = /* GraphQL */ `
  query GetTraitCategoryResponses($compound_id: String) {
    getTraitCategoryResponses(compound_id: $compound_id) {
      compound_id
      dependent_id
      trait_category_id
      trait_responses {
        trait_id
        text_response
        __typename
      }
      __typename
    }
  }
`;
