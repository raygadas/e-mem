import { User, Group } from '../interfaces'

/** Dummy user data. */
export const dataArray: User[] = [
  { id: 101, name: 'Alice' },
  { id: 102, name: 'Bob' },
  { id: 103, name: 'Caroline' },
  { id: 104, name: 'Dave' },
];

export const groupsArray: Group[] = [
  {
    id: 1, name: "Me", categories: [
      {
        id: 1,
        name: "Tough tasks",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
      },
      {
        id: 2,
        name: "Stressful situations",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
      },
      {
        id: 3,
        name: "Difficult decisions",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
      },
      {
        id: 4,
        name: "Other persons",
        description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor"
      },
    ]
  }
]

/**
 * Calls a mock API which finds the groups and categories information
 *
 * Throws an error if not found.
 */
export async function getGroups() {
  return groupsArray;
}


/**
 * Calls a mock API which finds a user by ID from the list above.
 *
 * Throws an error if not found.
 */
export async function findData(id: number | string) {
  const selected = dataArray.find(data => data.id === Number(id))

  if (!selected) {
    throw new Error('Cannot find user')
  }

  return selected
}

/** Calls a mock API which returns the above array to simulate "get all". */
export async function findAll() {
  // Throw an error, just for example.
  if (!Array.isArray(dataArray)) {
    throw new Error('Cannot find users')
  }

  return dataArray
}


