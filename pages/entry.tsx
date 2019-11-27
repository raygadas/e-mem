import * as React from 'react'
import Layout from '../components/Layout'
import { NextPage } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Router, { useRouter } from 'next/router';
import withAuthorization from "./withAuthorization";
import { formatDate } from '../utils';

const Entry: NextPage<any> = ({ firebase, user }) => {
    const router = useRouter();
    const { query } = router;
    const [experience, setExperience] = React.useState(Object);
    const [category, setCategory] = React.useState(Object)
    const [subject, setSubject] = React.useState(Object)
    const { db } = firebase;

    React.useEffect(() => {
        const fetchExperience = async (experience_id: string | string[]) => {
            let experienceRef = await db.collection('users').doc(user.uid).collection('experiences').doc(experience_id).get();
            let data = { ...experienceRef.data(), id: experienceRef.id };
            setExperience({ ...data });
        }

        if (query.id) {
            fetchExperience(query.id);
        }
    }, [])

    React.useEffect(() => {
        const fetchCategoryInfo = async () => {
            let categoryRef;
            if (experience.id_category) {
                categoryRef = await db.collection("category").doc(experience.id_category).get();
                let data = { ...categoryRef.data(), id: categoryRef.id }
                setCategory(data);
            }
        }
        if (experience) {
            fetchCategoryInfo();
        }
    }, [experience])

    // Get subject information
    React.useEffect(() => {
        const fetchSubjectInfo = async () => {
            let subjectRef = await db.collection("subject").doc(category.id_subject).get();
            let data = subjectRef.data();
            setSubject(data);
        }

        if (category.id_subject) {
            fetchSubjectInfo();
        }
    }, [category])

    return (
        <Layout title={experience.name ? `My experience | ${experience.name}` : `My experience`}>
            <div className="max-w-xl mx-auto min-h-screen flex flex-col">
                <div className="w-full h-80 max-w-2xl mx-auto text-gray-400"
                    style={{
                        backgroundImage: `url(${experience.img_url})`,
                        backgroundPosition: 'center',
                        backgroundRepeat: 'no-repeat',
                        backgroundSize: 'cover'
                    }}>
                    <div className="h-full w-full bg-gray-900 opacity-75 flex items-center justify-center relative">
                        <div className="absolute cursor-pointer flex items-center left-0 max-w-md mb-1 ml-6 mt-4 top-0">
                            <button className="flex max-w-md text-gray-600 mb-1 items-center cursor-pointer bg-white rounded px-2 py-1 shadow" onClick={() => Router.back()}>
                                <div className="rounded-full bg-gray-300 p-1 flex mr-2">
                                    <FontAwesomeIcon icon="arrow-left" className="text-sm text-gray-600" />
                                </div>
                                Go back
                            </button>
                        </div>
                        <FontAwesomeIcon icon="play-circle" className="text-6xl" />
                    </div>
                </div>
                <div className="bg-white rounded-t-lg flex-grow -mt-8 z-10 py-4 px-4 mx-2">
                    <div>
                        {category && subject
                            ? <p className="text-gray-500 w-full text-xs uppercase font-medium">
                                <span className="text-gray-400">{subject.name}</span> / {category.name}
                            </p>
                            : ""
                        }
                        <h1 className="text-3xl text-gray-700 font-bold leading-tight mb-2">Experience: {experience.name}</h1>
                        <p className="text-gray-500 text-base">
                            {formatDate(experience.date)}
                        </p>
                    </div>
                    <div className="my-4">
                        <div className="flex mb-2 flex-wrap"> {
                            experience.key_words ? experience.key_words.map((word: any) => {
                                return (
                                    <div className="bg-blue-200 px-2 py-1 rounded-lg text-sm text-blue-700 mr-2 shadow text-center mb-1">
                                        {word}
                                    </div>
                                )
                            }) : ""
                        }
                        </div>
                        <div className="flex flex-wrap"> {
                            experience.emojis ? experience.emojis.map((emoji: string)  => {
                                return (
                                    <div className="bg-gray-200 px-2 py-1 rounded-lg text-blue-700 mr-2 shadow text-center mb-1">
                                        {emoji}
                                    </div>
                                )
                            }) : ""
                        }
                        </div>
                    </div>
                    <div>
                        <p className="text-gray-600 text-base mt-4">
                            {experience.description}
                        </p>
                    </div>
                    {/* <Editor
                        onChange={() => { console.log("changed") }}
                    /> */}
                </div>
            </div>
        </Layout >
    )
};

Entry.getInitialProps = async () => {
    // Example for including initial props in a Next.js function component page.
    // Don't forget to include the respective types for any props passed into
    // the component.
    console.log("@entry getInitialProps");
    return {}
};

export default withAuthorization(Entry)
