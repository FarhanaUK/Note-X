import { useReducer } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons"; 
import './App.css'

const ADD_LINK = "ADD_LINK";
const DELETE_LINK = "DELETE_LINK";
const ADD_NEW_SECTION = "ADD_NEW_SECTION";
const DELETE_SECTION = "DELETE_SECTION";
const UPDATE_SECTION = "UPDATE_SECTION";
const MESSAGE = "MESSAGE";


//initialsTATE

const initialValue = {
  message: "",
  sections: [
    { subject: "", notes: "", url: [] }  
  ],
};

const reducer = (state, action) => {
  switch (action.type) {
    case ADD_NEW_SECTION: {
      return {...state, sections: [...state.sections, { subject: "",notes: "", url: []} ]}
    }
    case UPDATE_SECTION: {
      const {idx, field, value} = action.payload;
      const updatedSection = state.sections.map((section, i) => i === idx ? {...section, [field]: value} : section)
      return {...state, sections: updatedSection}
    }

    case ADD_LINK: {
    const {idx, url} = action.payload
    const updatedSections = state.sections.map((section, i)=> i === idx ? {...section, url: [...section.url, url]} : section)
      return {...state, sections: updatedSections, message: ""}
    }
    case DELETE_LINK: {
      const {sectionIdx, urlIdx} = action.payload
      const updatedSections = state.sections.map((section, i)=> i === sectionIdx ? {...section, url: section.url.filter((_, index)=> index !== urlIdx)} : section)
      return {...state, sections: updatedSections};
    }
    case DELETE_SECTION:

      return {...state, sections: state.sections.filter((_, i)=> i !== action.payload)}
    case MESSAGE: {
      return { ...state, message: action.payload };
    }
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialValue);

  const addSection = () => {
    dispatch({ type: ADD_NEW_SECTION})
  }

  const onChange = (idx, e) => {
    dispatch({type: UPDATE_SECTION, payload: { idx, field: e.target.name, value: e.target.value}});
 
  };

  const onSubmit = (e, idx) => {
    e.preventDefault();

    const url = e.target.elements.url.value.trim();

    if (!url) {
      dispatch({ type: MESSAGE, payload: "You must add a link" });
      return;
    }
    dispatch({ type: ADD_LINK, payload: {idx, url} });
    e.target.elements.url.value = "";
  };
  return (
  
      <div className="container">
        <h1 className="text-3xl font-bold mb-4 text-violet-950 text-center ">Note X</h1>

        <button onClick={addSection} className="mb-4 p-4 border border-gray-300 rounded">Add</button>
      
    {state.sections.map((section, sectionIdx) => (
      <div key={sectionIdx} className="mb-4 p-4 border border-gray-300 rounded"> 
      <button onClick={() => dispatch({type: DELETE_SECTION, payload: sectionIdx})}
      className="ml-2 text-white bg-violet-950 hover:text-green-200">Remove</button>
      
   
          <input
            name="subject"
            placeholder="Title"
            type="text"
            onChange={(e) => onChange(sectionIdx, e)}
            value={section.subject}
            className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
          />

          <input
            name="notes"
            placeholder="Notes"
            type="text"
            onChange={(e) => onChange(sectionIdx, e)}
            value={section.notes}
            className="w-full h-24 p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          
          <form onSubmit = {(e) => onSubmit(e, sectionIdx)}>
          <div className="flex items-center">
            <input
              name="url"
              placeholder="Add a link"
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="submit"
              className="ml-2 text-white bg-violet-950 hover:text-green-200 "
            >
              +
            </button>
          </div>
          </form>

          {section.url.length > 0 && (
            <ul className="list-disc pl-5">
              {section.url.map((link, urlIdx) => 
                 (<li
                    key={urlIdx}
                    className="flex justify-between items-center mb-2"
                  >
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 underline"
                    >
                      {link}
                    </a>
                    <button
                      onClick={() => {
                        dispatch({ type: DELETE_LINK, payload: { sectionIdx, urlIdx } });
                      }}
                      className="ml-2 text-red-500 bg-violet-950 hover:text-red-700"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>)
                 )}
                
            </ul>
            )}
          </div>
        
  ))}
      {state.message && (
        <div className="text-red-500 mt-2">
          {state.message}
        </div>
        )}
</div>

  );
}

export default App;
