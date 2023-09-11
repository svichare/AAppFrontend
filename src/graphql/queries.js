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
        option_text
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
        string_id
        diagnosis
        verbal
        age
        __typename
      }
      __typename
    }
  }
`;
export const getDependentDetails = /* GraphQL */ `
  query GetDependentDetails($string_id: String) {
    getDependentDetails(string_id: $string_id) {
      id
      name
      thumbnail_url
      image_url
      string_id
      diagnosis
      verbal
      age
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
export const getTraitCategoryDisplayStrings = /* GraphQL */ `
  query GetTraitCategoryDisplayStrings($compound_id: String) {
    getTraitCategoryDisplayStrings(compound_id: $compound_id) {
      compound_id
      dependent_id
      trait_category_id
      trait_display_strings {
        Trait
        Response
        __typename
      }
      __typename
    }
  }
`;
export const getCaregiverProfile = /* GraphQL */ `
  query GetCaregiverProfile($dependent_id: String) {
    getCaregiverProfile(dependent_id: $dependent_id) {
      dependent_id
      caregiver_categories {
        trait_category_name
        __typename
      }
      __typename
    }
  }
`;
