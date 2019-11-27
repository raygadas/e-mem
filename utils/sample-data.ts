import { User, Subject } from '../interfaces'

/** Dummy user data. */
export const sampleUserData: User[] = [
    { id: 101, name: 'Alice' },
    { id: 102, name: 'Bob' },
    { id: 103, name: 'Caroline' },
    { id: 104, name: 'Dave' },
];

export const subjects : Subject[] = [
    {
        id: 1,
        name: "Me",
        categories: [
            {
                id: 1,
                name: "Tough tasks",
                description: "lorem ipsum"
            },
            {
                id: 2,
                name: "Difficult decisions",
                description: "lorem ipsum"
            },
            {
                id: 3,
                name: "Stressful situations",
                description: "lorem ipsum"
            }
        ]
    },
    {
        id: 2,
        name: "About me",
        categories: [
            {
                id: 1,
                name: "Tough tasks",
                description: "lorem ipsum"
            },
            {
                id: 2,
                name: "Difficult decisions",
                description: "lorem ipsum"
            },
            {
                id: 3,
                name: "Stressful situations",
                description: "lorem ipsum"
            }
        ]
    },
    {
        id: 3,
        name: "Us",
        categories: [
            {
                id: 1,
                name: "Tough tasks",
                description: "lorem ipsum"
            },
            {
                id: 2,
                name: "Difficult decisions",
                description: "lorem ipsum"
            },
            {
                id: 3,
                name: "Stressful situations",
                description: "lorem ipsum"
            }
        ]
    },
];