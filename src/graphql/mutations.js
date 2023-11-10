/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const updateTraitResponse = /* GraphQL */ `
  mutation UpdateTraitResponse(
    $updateTraitResponseInput: UpdateTraitResponseInput
  ) {
    updateTraitResponse(updateTraitResponseInput: $updateTraitResponseInput) {
      status
      __typename
    }
  }
`;
export const updateProfile = /* GraphQL */ `
  mutation UpdateProfile($updateProfileInput: UpdateProfileInput) {
    updateProfile(updateProfileInput: $updateProfileInput) {
      status
      __typename
    }
  }
`;
export const addDependent = /* GraphQL */ `
  mutation AddDependent($addDependentInput: AddDependentInput) {
    addDependent(addDependentInput: $addDependentInput) {
      status
      __typename
    }
  }
`;
export const UpdateDependentBio = /* GraphQL */ `
  mutation UpdateDependentBio($updateDependentInput: UpdateDependentInput) {
    UpdateDependentBio(updateDependentInput: $updateDependentInput) {
      status
      __typename
    }
  }
`;
export const deleteDependent = /* GraphQL */ `
  mutation DeleteDependent($deleteDependentInput: DeleteDependentInput) {
    deleteDependent(deleteDependentInput: $deleteDependentInput) {
      status
      __typename
    }
  }
`;
export const markThreadValidity = /* GraphQL */ `
  mutation MarkThreadValidity(
    $collection_name: String
    $thread_id: String
    $new_validity: Boolean
  ) {
    markThreadValidity(
      collection_name: $collection_name
      thread_id: $thread_id
      new_validity: $new_validity
    ) {
      status
      __typename
    }
  }
`;
export const markMessageValidity = /* GraphQL */ `
  mutation MarkMessageValidity(
    $collection_name: String
    $thread_id: String
    $new_validity: Boolean
    $message_text: String
  ) {
    markMessageValidity(
      collection_name: $collection_name
      thread_id: $thread_id
      new_validity: $new_validity
      message_text: $message_text
    ) {
      status
      __typename
    }
  }
`;
