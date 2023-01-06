import { gql } from 'graphql-request';

const createRunMutation = gql`
  mutation create_run_withinput(
    $name: String
    $sampleInput: [[String]]
    $simulation_id: String
    $env_list: [[String]]
    $timeout_values: [Int]
  ) {
    Create_Run_WithInput(
      name: $name
      sampleInput: $sampleInput
      simulation_id: $simulation_id
      env_list: $env_list
      timeout_values: $timeout_values
    )
  }
`;

export default createRunMutation;
