import { useReducer } from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTrash} from "@fortawesome/free-solid-svg-icons"; 
import './App.css'

const ADD_LINK = "ADD_LINK";
const ADD_SUBJECT = "ADD_SUBJECT";
const ADD_NOTES = "ADD_NOTES";
const MESSAGE = "MESSAGE";
const DELETE_LINK = "DELETE";
//initialsTATE

const initialValue = {
  url: [],
  subject: "",
  notes: "",
  message: "",
};

const reducer = (state, action) => {
  switch (action.type) {
    case ADD_LINK: {
      return { ...state, url: [...state.url, action.payload], message: "" };
    }
    case DELETE_LINK: {
      return {
        ...state,
        url: state.url.filter((link, idx) => idx !== action.payload),
      };
    }
    case ADD_NOTES: {
      return { ...state, notes: action.payload };
    }
    case ADD_SUBJECT: {
      return { ...state, subject: action.payload };
    }
    case MESSAGE: {
      return { ...state, message: action.payload };
    }
    default:
      return state;
  }
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialValue);

  const onChange = ({ target: { name, value } }) => {
    dispatch({
      type: name === "subject" ? ADD_SUBJECT : ADD_NOTES,
      payload: value,
    });
    console.log("button clicked");
  };

  const onSubmit = (evt) => {
    evt.preventDefault();
    console.log("button clicked");
    const newUrl = evt.target.elements.url.value.trim();

    if (!newUrl) {
      dispatch({ type: MESSAGE, payload: "You must add a link" });
      return;
    }
    dispatch({ type: ADD_LINK, payload: newUrl });
    evt.target.elements.url.value = "";
  };
  return (
    <form onSubmit={onSubmit}>
      <div className="container">
      <h1 className="text-3xl font-bold mb-4 text-violet-950 text-center ">Note X</h1>
        <div className="mb-4">
          <input
            name="subject"
            placeholder="Title"
            type="text"
            onChange={onChange}
            value={state.subject}
             className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold"
          />

          <input
            name="notes"
            placeholder="Notes"
            type="text"
            onChange={onChange}
            value={state.notes}
            className="w-full p-2 mb-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            
          />
          <div className="flex items-center">
            <input 
            name="url" 
            placeholder="Add a link" 
            type="text" 
            className="w-full p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"/>
            
            <button type="submit" className="ml-2 text-white bg-violet-950 hover:text-green-200 ">+</button>
          
          {state.message && (
            <div className="text-red-500 mt-2">
              {state.message}
            </div>
          )}
          </div>
          <div>
            <ul className="list-disc pl-5">
              {state.url.map((link, idx) => {
                return (
                  <li key={idx} className="flex justify-between items-center mb-2">
                 <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-500 underline">{link}</a> 
                    <button onClick={() => {dispatch({ type: DELETE_LINK, payload: idx });
                      }}  className="ml-2 text-red-500 bg-violet-950 hover:text-red-700">
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </form>
  );
}

export default App;
