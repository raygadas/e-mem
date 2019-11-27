import * as React from 'react'
import Layout from '../components/Layout'
import Link from 'next/link';
import { NextPage } from 'next'
import { Group } from '../interfaces';
import withAuthorization from "./withAuthorization";
import FirebaseService from 'services/firebase';
import Router, { useRouter } from 'next/router';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

type Props = {
    data: Array<any>
}

const Categories: React.FunctionComponent<Props> = ({ data }) => {
    return (
        <React.Fragment>
            {data.map(category => (
                <Link href={{ pathname: '/category', query: { id: category.id, id_subject: category.id_subject, type: 'all' } }} as={`/subject/${category.id_subject}/category/${category.id}`} key={category.id}>
                    <div className="w-full rounded-lg mb-4 max-w-sm px-4 py-4 bg-blue-500">
                        <span className="text-2xl bg-blue-100 rounded-full h-10 w-10 flex justify-center items-center">
                            {category.emoji}    
                        </span>
                        <div className="flex">
                            <h1 className="text-xl text-blue-100 w-full font-medium">
                                {category.name}
                            </h1>
                        </div>
                        <p className="text-lg text-blue-200 w-full">
                            {category.description}
                        </p>
                        <div className="flex justify-end mt-2">
                            <div className="text-blue-700 bg-blue-100 rounded shadow px-2 py-1 flex items-center">
                                See experiences
                                <div className="rounded-full bg-blue-200 p-1 flex ml-2">
                                    <FontAwesomeIcon icon="arrow-right" className="text-sm text-blue-600" />
                                </div>
                            </div>
                        </div>
                    </div>
                </Link>)
            )}
        </React.Fragment>
    );
};

type TabsProps = {
    data: Object
    selected: string
}

const Tabs: React.FunctionComponent<TabsProps> = ({ data, selected }): any => {
    const selectedStyle = 'text-blue-500 bg-white shadow-md rounded font-bold';
    let description = "";
    return (
        <React.Fragment>
            <div className="max-w-md text-gray-500 mx-auto bg-gray-200 py-2 rounded shadow-inner mb-2 px-2">
                <div className="flex">
                    {Object.values(data).map(subject => {
                        description = (selected === subject.id ? subject.description : description)
                        return (
                            <Link href={`/?subject=${subject.id}`} key={subject.id}>
                                <div className={"py-2 w-1/3 text-center sm:mr-6 px-1 text-gray-500 font-medium " + (selected === subject.id ? selectedStyle : "")}>
                                    <a>{subject.name}</a>
                                </div>
                            </Link>
                        )
                    })}
                </div>
                <div className="py-4 text-blue-500 text-lg px-2 bg-white rounded shadow-md -mt-2 mx-2">
                    {description}
                </div>
            </div>
        </React.Fragment>
    )
}

type HomePage = {
    allGroups?: Group[],
    firebase: FirebaseService,
    user: firebase.User
}

const HomePage: NextPage<HomePage, {}> = ({ firebase, user }) => {
    const [subjects, setSubjects] = React.useState(Object);
    const [categories, setCategories] = React.useState(Array);
    const [selectedSubject, setSelectedSubject] = React.useState("");
    const { db } = firebase;

    const router = useRouter();
    const { query } = router;

    React.useEffect(() => {
        const getSubjectCategories = async (given_id: string) => {
            let category_collection = await db
                .collection('category')
                .where('id_subject', '==', given_id)
                .get()

            return category_collection.docs.map(categ => {
                return { ...categ.data(), id: categ.id }
            });
        }

        const fetchSubjects = async () => {
            let subject_collection = await db.collection('subject').get();

            let getSubjects = async () => {
                let subjects : {[id: string]: any}= {}
                await Promise.all(subject_collection.docs.map(async (subject) => {
                    let data = subject.data()
                    let id = subject.id;
                    let categories = await getSubjectCategories(subject.id)
                    subjects[id] = {
                        ...data,
                        id,
                        categories
                    }
                    return;
                }))

                return subjects;
            }

            let data = await getSubjects();
            setSubjects({ ...data });
        }


        if (!query.subject) {
            Router.push(`/?subject=me`);
        }

        fetchSubjects();
    }, [])

    React.useEffect(
        () => {
            if (subjects[selectedSubject]) {
                setCategories([...subjects[selectedSubject].categories])
            }
            console.log(subjects);
        }, [subjects, selectedSubject]
    )

    React.useEffect(
        () => {
            if (query.subject instanceof Array) {
                setSelectedSubject(query.subject[0])
            } else {
                setSelectedSubject(query.subject)
            }
        }, [query.subject]
    )

    return (
        <Layout title="Home">
            <div className={"h-48 w-full default-bg hidden"}>
            </div>
            <div className="max-w-xl mx-auto min-h-screen flex flex-col">
                <div className="px-4 pt-8 pb-4 mx-auto w-full">
                    <div className="flex items-center justify-between">
                        <div className="rounded-full h-16 w-16 bg-gray-400 mb-1 shadow-inner"
                            style={{
                                backgroundImage: `url(${user.photoURL})`,
                                backgroundPosition: 'center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: 'cover'
                            }}
                        />
                        <button className="text-gray-500 bg-white rounded shadow px-2 py-1 flex items-center" onClick={firebase.doSignOut}>
                            Sign out
                            <div className="rounded-full bg-gray-200 p-1 flex ml-2">
                                <FontAwesomeIcon icon="power-off" className="text-sm text-gray-500" />
                            </div>
                        </button>
                    </div>
                    <div className="mt-3">
                        <h1 className="text-lg text-gray-600">
                        {
                            user.displayName
                            ? <React.Fragment>Welcome back, {user.displayName}!</React.Fragment>
                            : <React.Fragment>Welcome back!</React.Fragment>
                        }
                        </h1>
                        <p className="text-gray-700 text-2xl">Save, organize and view your experiences 📽</p>
                        {/* <div className="flex flex-wrap mt-4">
                            <div className="h-16 w-16 rounded bg-white text-3xl items-center justify-center flex shadow-md">
                                📽
                            </div>
                        </div> */}
                    </div>
                </div>
                <div className="bg-white w-full max-w-xl min-h-full mx-auto py-4 rounded-t-lg shadow-lg px-4 flex-grow">
                    <Tabs data={subjects} selected={selectedSubject} />
                    <Categories data={categories} />
                </div>
            </div>
        </Layout>
    )
};

HomePage.getInitialProps = async () => {
    console.log("@home getInitialProps");
    return {}
};

export default withAuthorization(HomePage);
