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
  message: [],
  sections: [
    { subject: "", notes: "", url: [] }  
  ],
};

const reducer = (state, action) => {
  let newState;

  switch (action.type) {
    case ADD_NEW_SECTION: 
      newState = {
        ...state,
        sections: [...state.sections, { subject: "", notes: "", url: [] }],
        message: [...state.message, ""] // Add an empty message corresponding to the new section
      };
      break;
    
    
    case UPDATE_SECTION: {
      const { idx, field, value } = action.payload;
      const updatedSectionsAfterUpdate = state.sections.map((section, i) => i === idx ? { ...section, [field]: value } : section);
      newState = { ...state, sections: updatedSectionsAfterUpdate };
    }
      break;
   
    case ADD_LINK: {
      const { idx: sectionIdx, url: newUrl } = action.payload;
      const updatedSectionAfterLinkAdd = state.sections.map((section, i) => i === sectionIdx ? { ...section, url: [...section.url, newUrl] } : section);
      newState = { ...state, sections: updatedSectionAfterLinkAdd, message: "" };
    }
      break;
    
    case DELETE_LINK: {
      const { sectionIdx: delSectionIdx, urlIdx } = action.payload;
      const updatedSectionsAfterDelete = state.sections.map((section, i) => i === delSectionIdx ? { ...section, url: section.url.filter((_, index) => index !== urlIdx) } : section);
      newState = { ...state, sections: updatedSectionsAfterDelete };
    }
      break;
    
      case DELETE_SECTION:
        newState = { 
          ...state, 
          sections: state.sections.filter((_, i) => i !== action.payload),
          message: state.message.filter((_, i) => i !== action.payload) // Remove the corresponding message
        };
        break;

    case MESSAGE: {
    const {sectionIdx, message} = action.payload;
    const updatedMessage = [...state.message]
    updatedMessage[sectionIdx] = message
    newState = { ...state, message: updatedMessage };
    break;
    }
      
    
    default:
      newState = state;
  }

  // Save the updated state to localStorage
  localStorage.setItem('notesState', JSON.stringify(newState));

  return newState;
};

  const loadState = () => {
    const savedState = localStorage.getItem('notesState')
    return savedState ? JSON.parse(savedState) : initialValue
  }

function App() {
  const [state, dispatch] = useReducer(reducer, loadState());

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
      dispatch({ type: MESSAGE, payload: { sectionIdx: idx, message: "You must add a link" }});
      return;
    }

    dispatch({type: MESSAGE, payload: {sectionIdx: idx, message: ""}})

    dispatch({ type: ADD_LINK, payload: {idx, url} });
    e.target.elements.url.value = "";
  };
  return (
  
      <div className="container max-w-screen-lg mx-auto p-2">
       
        <h1 className="text-3xl font-bold mb-2 text-blue-950 text-center mt-4">Note X</h1>

        <div className="flex justify-center mb-4 sticky top-0 bg-white z-10 shadow-md">
          <button onClick={addSection} className="border border-gray-300 rounded bg-blue-100 hover:bg-blue-200 p-2">
            Add New
          </button>
      </div>
      
    {state.sections.map((section, sectionIdx) => (
      <div key={sectionIdx} className="mb-2 p-2 border border-gray-500 rounded "> 
      <button onClick={() => dispatch({type: DELETE_SECTION, payload: sectionIdx})}
      className="ml-2 mb-2 text-white bg-blue-950 hover:bg-red-800 mt-2">Remove</button>
      
   
          <input
            name="subject"
            placeholder="Title"
            type="text"
            onChange={(e) => onChange(sectionIdx, e)}
            value={section.subject}
            className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
           
          />

          <textarea
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
              className="ml-2  text-white bg-blue-950 hover:bg-blue-900 "
            >
              +
            </button>
          </div>
          {state.message[sectionIdx] && (
            <p className='text-red-500 mt-1'>{state.message[sectionIdx]}</p>

          )}



          </form>

          {section.url.length > 0 && (
            <div className='flex flex-col border border-gray-300 rounded bg-gray-100 mt-2'>
            <ul className="space-y-2">
              {section.url.map((link, urlIdx) => 
                 (<li
                    key={urlIdx}
                    className="flex justify-between items-center mb-2 border border-gray-400 rounded bg-gray-300 hover:bg-gray-400 p-2 break-all"
                  >
                    <a
                      href={link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-600 hover:underline ml-1"
                    >
                      {link}
                    </a>
                   
                    <button
                      onClick={() => {
                        dispatch({ type: DELETE_LINK, payload: { sectionIdx, urlIdx } });
                      }}
                      className="ml-2 text-red-500 bg-blue-950 hover:text-red-700 "
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button></li>)
                  
                 )}
                
            </ul>
            
            </div>
            )}
          </div>
        
  ))}
  
</div>

  );
}

export default App;
