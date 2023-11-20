/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const getTraitCategory = /* GraphQL */ `
  query GetTraitCategory($id: ID!) {
    getTraitCategory(id: $id) {
      id
      Name
      Description
      TraitCount
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
      TraitCount
      __typename
    }
  }
`;
export const getTraitCategoryResponseCounts = /* GraphQL */ `
  query GetTraitCategoryResponseCounts($dependent_id: String) {
    getTraitCategoryResponseCounts(dependent_id: $dependent_id) {
      trait_category_id
      response_counts
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
      name
      last_name
      image_url
      country
      state
      city
      email
      dependents {
        id
        name
        thumbnail_url
        image_url
        string_id
        public_id
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
  query GetDependentDetails($dependent_id: String) {
    getDependentDetails(dependent_id: $dependent_id) {
      id
      name
      thumbnail_url
      image_url
      string_id
      public_id
      diagnosis
      verbal
      age
      __typename
    }
  }
`;
export const getDependentProfileComplete = /* GraphQL */ `
  query GetDependentProfileComplete($dependent_id: String) {
    getDependentProfileComplete(dependent_id: $dependent_id)
  }
`;
export const getDependentPublicDetails = /* GraphQL */ `
  query GetDependentPublicDetails($public_id: String) {
    getDependentPublicDetails(public_id: $public_id) {
      id
      name
      thumbnail_url
      image_url
      string_id
      public_id
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
export const getCaregiverProfilePublic = /* GraphQL */ `
  query GetCaregiverProfilePublic($public_id: String) {
    getCaregiverProfilePublic(public_id: $public_id) {
      dependent_id
      caregiver_categories {
        trait_category_name
        __typename
      }
      __typename
    }
  }
`;
export const getGPTResponse = /* GraphQL */ `
  query GetGPTResponse($query: String, $public_id: String) {
    getGPTResponse(query: $query, public_id: $public_id)
  }
`;
export const getThreadsAndMessages = /* GraphQL */ `
  query GetThreadsAndMessages(
    $threads_to_read: Int
    $threads_to_skip: Int
    $collection_name: String
  ) {
    getThreadsAndMessages(
      threads_to_read: $threads_to_read
      threads_to_skip: $threads_to_skip
      collection_name: $collection_name
    ) {
      title
      _id
      tags
      messages {
        sender
        text
        messageType
        isValid
        __typename
      }
      isValid
      isValidQnA
      __typename
    }
  }
`;
export const getThreads = /* GraphQL */ `
  query GetThreads($collection_name: String, $key: String, $value: String) {
    getThreads(collection_name: $collection_name, key: $key, value: $value) {
      title
      _id
      tags
      messages {
        sender
        text
        messageType
        isValid
        __typename
      }
      isValid
      isValidQnA
      __typename
    }
  }
`;
