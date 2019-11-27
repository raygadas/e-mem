import * as React from 'react'
import Layout from '../components/Layout'
import { NextPage } from 'next'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Router, { useRouter } from 'next/router'
import withAuthorization from "./withAuthorization";
import FirebaseService from 'services/firebase';
import { useEffect, useState } from 'react'
import Link from 'next/link';
import { formatDate } from '../utils';
import FriendshipImg from '../public/images/friendship.jsx';
type CardProps = {
  experience: any
}

const Tags: React.FunctionComponent<any> = ({ experience }) => {
  return (
    <React.Fragment>
      {
        experience.emojis && experience.emojis.length > 0
          ? experience.emojis.slice(0, 5).map((emoji: any) => {
            return (
              <div className="bg-gray-200 px-2 py-1 rounded-lg text-blue-700 mr-2 shadow mb-1">
                {emoji}
              </div>
            )
          })
          : (
            experience.key_words && experience.key_words.length > 0
              ? experience.key_words.slice(0, 2).map((word: any) => {
                return (
                  <div className="bg-blue-200 px-2 py-1 rounded-lg text-sm text-blue-700 mr-2 shadow text-center mb-1">
                    {word}
                  </div>
                )
              })
              : experience.key_words
            )
        }
    </React.Fragment>
  )
}

const Card: React.FunctionComponent<CardProps> = ({ experience }) => {
  const date_options = {
    year: "numeric",
    month: "long",
    day: "numeric"
  }
  let date = new Date(experience.date.toDate());
  return (
    <Link href={{ pathname: '/entry', query: { id: experience.id } }} as={`/entry/${experience.id}`} key={experience.id}>
      <a>
        <div className="w-full md:w-1/2 px-2">
          <div className="my-2 flex py-4 px-2 justify-between max-w-sm mx-auto">
            <div className="flex items-center">
              <div className="h-24 w-24 rounded-lg shadow-xl"
                style={{
                  backgroundImage: `url(${experience.img_url})`,
                  backgroundPosition: 'center',
                  backgroundRepeat: 'no-repeat',
                  backgroundSize: 'cover'
                }}>
                <div className="rounded-lg h-full w-full bg-gray-900 opacity-50">
                </div>
              </div>
            </div>
            <div className="ml-4 flex-grow flex items-center flex-wrap">
              <div className="mb-2">
                <p className="text-gray-500 text-sm">{formatDate(experience.date)}</p>
                {/* <h1 className="text-gray-600 text-lg">Experience: <span className="italic text-gray-700">{experience.name}</span></h1> */}
                <h1 className="text-gray-600 text-lg">{experience.name}</h1>
              </div>
              <div className="flex flex-wrap">
                <Tags experience={experience} />
              </div>
              <div className="underline w-full text-blue-500">
                See experience <FontAwesomeIcon icon="arrow-right" className="text-xs" />
              </div>
            </div>
          </div>
        </div>
      </a>
    </Link>
  )
};

type TypesProps = {
  types: Array<Object>,
  selected: string,
  setSelected: any
}

const Types: React.FunctionComponent<TypesProps> = ({ types, selected, setSelected }) => {
  return (
    <React.Fragment>
      {types.map((type: any) => {
        return (
          <div onClick={() => setSelected(type.id)}>
            <div className={"bg-gray-100 rounded px-4 my-2 shadow-md mr-4 font-bold uppercase text-gray-600 text-xs text-center h-10 flex items-center " + (selected === type.id ? " bg-blue-500 text-blue-100" : "")}>
              {type.name}
            </div>
          </div>
        )
      })}
      {
        types.length < 6
          ? <button className={"bg-gray-100 rounded px-4 h-10 my-2 shadow-md mr-4 font-bold uppercase text-gray-600 text-xs text-center flex items-center"}>
            Add type
            <div className="rounded-full bg-gray-200 p-1 flex ml-2">
              <FontAwesomeIcon icon="plus" className="text-sm text-gray-500" />
            </div>
          </button>
          : ""
      }
    </React.Fragment>
  )
};

type CategoryProps = {
  firebase: FirebaseService,
  user: firebase.User
}

const Category: NextPage<CategoryProps, {}> = ({ firebase, user }) => {
  const router = useRouter();
  const { query } = router;
  const [category, setCategory] = useState(Object)
  const [subject, setSubject] = useState(Object)
  const [experiences, setExperiences] = useState(Array);
  const [types, setTypes] = useState([{ name: 'All', id: 'all' }]);
  const [selectedType, setSelectedType] = useState('all');
  const { db } = firebase;

  // Get category information
  useEffect(() => {
    const fetchCategoryInfo = async () => {
      let categoryRef;
      if (query.id instanceof Array) {
        categoryRef = await db.collection("category").doc(query.id[0]).get();
      } else {
        categoryRef = await db.collection("category").doc(query.id).get();
      }

      let data = { ...categoryRef.data(), id: categoryRef.id }
      setCategory(data);
    }

    fetchCategoryInfo();
    if (query.type) {
      setSelectedType(query.type)
    }
  }, [])

  // Get experiences
  useEffect(() => {
    const fetchExperiences = async () => {
      let getExperiences = async () => {
        let experiencesRef;

        if (selectedType != 'all') {
          experiencesRef = await db.collection('users').doc(user.uid).collection('experiences')
            .where('id_category', '==', category.id)
            .where('id_type', '==', selectedType)
            .get();
        } else {
          experiencesRef = await db.collection('users').doc(user.uid).collection('experiences').where('id_category', '==', category.id).get();
        }

        return experiencesRef.docs.map(experience => {
          return { ...experience.data(), id: experience.id };
        })
      }

      let data = await getExperiences();
      setExperiences([...data]);
    }

    if (category.id) {
      fetchExperiences();
    }
  }, [category, selectedType])

  // Get types
  useEffect(() => {
    const fetchTypes = async () => {
      let getTypes = async () => {
        let typesRef = await db.collection('users').doc(user.uid).collection('types').where('id_category', '==', category.id).get();
        return typesRef.docs.map(type => {
          return { ...type.data(), id: type.id }
        })
      }

      let data = await getTypes();
      setTypes([...types, ...data]);
    }

    if (category.id) {
      fetchTypes();
    }
  }, [category])

  useEffect(() => {
    console.log("types", types);
  }, [types])

  // Get subject information
  useEffect(() => {
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
    <Layout title={subject.name && category.name ? `${subject.name} | ${category.name}` : ``}>
      <style jsx>{`
                .default-bg { 
                    background: #12c2e9;
                    background: -webkit-linear-gradient(45deg, #2D6DE9, #12c2e9);
                    background: linear-gradient(45deg, #2D6DE9, #12c2e9);
                 }
                 .default-bg2 { 
                   background: #ff7e5f;
                   background: -webkit-linear-gradient(45deg, #ff7e5f, #feb47b);
                   background: linear-gradient(45deg, #ff7e5f, #feb47b);
                 }
            `}</style>
      <div className={"h-24 w-full default-bg hidden"}>
      </div>
      <div className="max-w-2xl mx-auto min-h-screen flex flex-col">
        <div className="w-full max-w-2xl min-h-full mx-auto py-4 px-4 mb-3">
          <div className="flex">
            <button className="flex max-w-md text-gray-500 mb-1 items-center cursor-pointer bg-white rounded px-2 py-1 shadow" onClick={() => Router.back()}>
              <div className="rounded-full bg-gray-200 p-1 flex mr-2">
                <FontAwesomeIcon icon="arrow-left" className="text-sm text-gray-500" />
              </div>
              Go back
            </button>
          </div>
          <div className="mt-4 mb-4">
            <p className="text-gray-500 w-full text-sm uppercase font-bold ">
              {subject.name} /
            </p>
            <h1 className="text-3xl font-medium text-gray-700">
              {category.name} {category.emoji} 
            </h1>
            <p className="text-gray-600 w-full text-sm">
              {category.description}
            </p>
          </div>
          <div className="flex px-1 flex-wrap">
            <Types types={types} selected={selectedType} setSelected={(type_id: React.SetStateAction<string>) => setSelectedType(type_id)} />
          </div>
        </div>

        <div className="flex flex-wrap bg-white rounded-t-lg flex-grow shadow-lg">
          <div className="block w-full">
            { experiences && experiences.length > 0
              ?
                experiences.map((experience: any) => {
                return <Card experience={experience} key={experience.id} />
              })
              : ""
              // : (
              //   <div className="w-full flex px-2 flex-wrap py-8">
              //     <p className="text-gray-500 text-xl text-center w-full">This section is empty 😕</p>
              //     <p className="text-gray-600 text-3xl text-center w-full mb-4">Feel free to add experiences!</p>
              //     <div className="mx-auto max-w-md w-full">
              //       <FriendshipImg />
              //     </div>
              //   </div>
              // )
            }
          </div>
        </div>
      </div>
    </Layout>
  )
};

Category.getInitialProps = async () => {
  console.log("@category getInitialProps");
  return {}
};

export default withAuthorization(Category);
