import { useReducer, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrash, faDownload } from "@fortawesome/free-solid-svg-icons";
import validator from "validator";
import "./App.css";

// Constants
const ADD_LINK = "ADD_LINK";
const DELETE_LINK = "DELETE_LINK";
const ADD_NEW_SECTION = "ADD_NEW_SECTION";
const DELETE_SECTION = "DELETE_SECTION";
const UPDATE_SECTION = "UPDATE_SECTION";
const MESSAGE = "MESSAGE";
const DARK_MODE = "DARK_MODE";
const TOGGLE_SECTION = "TOGGLE_SECTION";
const DOWNLOAD_ERROR = "DOWNLOAD_ERROR";
const UPDATE_SECTIONS = "UPDATE_SECTIONS";

// Initial state
const initialState = {
  sections: [
    {
      subject: "",
      notes: "",
      url: [],
      openSection: true,
      darkModeOn: false,
      message: "",
    },
  ],
  downloadError: "",
};

// Reducer function
const reducer = (state, action) => {
  switch (action.type) {
    case ADD_NEW_SECTION:
      return {
        ...state,
        sections: [
          ...state.sections,
          { subject: "", notes: "", url: [], message: "", highlight: false },
        ],
      };
    case UPDATE_SECTIONS:
      return {
        ...state,
        sections: action.payload.sections,
      };
    case UPDATE_SECTION: {
      const { idx, field, value } = action.payload;
      return {
        ...state,
        sections: state.sections.map((section, i) =>
          i === idx ? { ...section, [field]: value, highlight: false } : section
        ),
      };
    }

    case ADD_LINK: {
      const { idx: sectionIdx, url: newUrl } = action.payload;
      return {
        ...state,
        sections: state.sections.map((section, i) =>
          i === sectionIdx
            ? { ...section, url: [...section.url, newUrl], message: "" }
            : section
        ),
      };
    }

    case DELETE_LINK: {
      const { sectionIdx: delSectionIdx, urlIdx } = action.payload;
      return {
        ...state,
        sections: state.sections.map((section, i) =>
          i === delSectionIdx
            ? {
                ...section,
                url: section.url.filter((_, index) => index !== urlIdx),
              }
            : section
        ),
      };
    }

    case DELETE_SECTION: {
      const updatedSections = state.sections.filter(
        (_, i) => i !== action.payload
      );
      const allTitlesFilled = updatedSections.every(
        (section) => section.subject.trim() !== ""
      );

      return {
        ...state,
        sections: updatedSections, // Return the updated sections
        downloadError: allTitlesFilled ? "" : state.downloadError, // Only clear error if all titles are filled
      };
    }

    case MESSAGE: {
      const { sectionIdx: msgSectionIdx, text } = action.payload;
      return {
        ...state,
        sections: state.sections.map((section, i) =>
          i === msgSectionIdx ? { ...section, message: text } : section
        ),
      };
    }

    case TOGGLE_SECTION: {
      const sectionIdx = action.payload;
      return {
        ...state,
        sections: state.sections.map((section, i) =>
          i === sectionIdx
            ? { ...section, openSection: !section.openSection }
            : section
        ),
      };
    }

    case DARK_MODE: {
      return { ...state, darkModeOn: !state.darkModeOn };
    }

    case DOWNLOAD_ERROR: {
      return { ...state, downloadError: action.payload };
    }

    default:
      return state;
  }
};

// Load state from localStorage
const loadState = () => {
  try {
    const savedState = localStorage.getItem("notesState");
    return savedState ? JSON.parse(savedState) : initialState;
  } catch {
    return initialState;
  }
};

const isValidURL = (url) => validator.isURL(url);

const extractDomain = (url) => {
  try {
    const { hostname } = new URL(url);
    const protocol = url.startsWith("https") ? "https://" : "http://";
    return `${protocol}${hostname}`;
  } catch {
    return "";
  }
};

const downloadNotes = (state, dispatch) => {
  const sectionsWithEmptySubject = state.sections.map((section) => {
    return section.subject.trim() === ""
      ? { ...section, highlight: true } // Mark sections with empty subjects
      : { ...section, highlight: false }; // Reset highlight for sections with subjects
  });

  const emptySectionsExist = sectionsWithEmptySubject.some(
    (section) => section.highlight
  );

  if (emptySectionsExist) {
    dispatch({
      type: UPDATE_SECTIONS,
      payload: { sections: sectionsWithEmptySubject }, // Dispatch the updated sections array
    });
    dispatch({
      type: DOWNLOAD_ERROR,
      payload: "One or more sections are missing a Title.",
    });
    return;
  }

  dispatch({ type: DOWNLOAD_ERROR, payload: "" });

  const textContent = state.sections
    .map((section, index) => {
      return `Section ${index + 1}:\nTitle: ${section.subject}\nNotes: ${
        section.notes
      }\nLinks:\n${section.url
        .map((link) => `- ${extractDomain(link)} (${link})`)
        .join("\n")}\n\n`;
    })
    .join("");

  const blob = new Blob([textContent], { type: "text/plain" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "notes.json";
  document.body.appendChild(a);
  a.click();

  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

function App() {
  const [state, dispatch] = useReducer(reducer, loadState());

  useEffect(() => {
    localStorage.setItem("notesState", JSON.stringify(state));
  }, [state]);

  const addSection = () => {
    dispatch({ type: ADD_NEW_SECTION });
  };

  const onChange = (idx, e) => {
    const value = e.target.value;
    const field = e.target.name;

    dispatch({
      type: UPDATE_SECTION,
      payload: { idx, field, value },
    });

    // Check if the current field is 'subject' and all sections have titles
    if (field === "subject") {
      const updatedSections = state.sections.map((section, i) =>
        i === idx ? { ...section, subject: value.trim() } : section
      );

      const allTitlesFilled = updatedSections.every(
        (section) => section.subject.trim() !== ""
      );

      if (allTitlesFilled) {
        dispatch({
          type: DOWNLOAD_ERROR,
          payload: "",
        });
      }
    }
  };

  const onSubmit = (e, idx) => {
    e.preventDefault();

    const url = e.target.elements.url.value.trim();

    if (!url) {
      dispatch({
        type: MESSAGE,
        payload: { sectionIdx: idx, text: "You must add a link" },
      });
      return;
    }

    if (!isValidURL(url)) {
      dispatch({
        type: MESSAGE,
        payload: { sectionIdx: idx, text: "Please enter a valid URL" },
      });
      return;
    }

    dispatch({ type: ADD_LINK, payload: { idx, url } });
    e.target.elements.url.value = "";
  };

  const toggleDarkMode = () => {
    dispatch({ type: DARK_MODE });
  };

  const toggleSection = (sectionidx) => {
    dispatch({ type: TOGGLE_SECTION, payload: sectionidx });
  };

  return (
    <div
      className={`container max-w-screen-lg mx-auto p-2 ${
        state.darkModeOn ? "dark" : ""
      }`}
    >
      <div className="flex justify-between items-center mb-4">
        <button
          onClick={toggleDarkMode}
          className=" flex justify-start mb-4 ml-2 mt-1 border border-gray-300 rounded bg-gray-100 bg-button-light dark:bg-button-dark hover:bg-gray-200 p-1 text-xs"
        >
          {state.darkModeOn ? "Light Mode" : "Dark Mode"}
        </button>
        <button
          onClick={() => downloadNotes(state, dispatch)}
          className=" text-sm border border-gray-300 rounded dark:bg-input-dark-bg"
        >
          <FontAwesomeIcon icon={faDownload} />
        </button>
      </div>

      <h1 className="text-3xl font-bold mb-2 text-blue-950 dark:text-text-dark text-center mt-4">
        Note X
      </h1>

      {state.downloadError && (
        <div className="text-red-500 mb-4 text-center">
          {state.downloadError}
        </div>
      )}

      <div className="flex justify-center mb-4 sticky dark:bg-input-dark-bg top-0 bg-gray-100 z-10 shadow-md">
        <button
          onClick={addSection}
          className="border border-gray-300 rounded bg-button-light dark:bg-button-dark hover:bg-blue-200 p-2"
        >
          Add New
        </button>
      </div>

      {state.sections.map((section, sectionIdx) => (
        <div
          key={sectionIdx}
          className="mb-2 p-2 border border-gray-500 rounded grid grid-cols-[auto_1fr] gap-2"
        >
          <div className="flex items-center justify-between">
            <input
              name="subject"
              placeholder="Title"
              type="text"
              onChange={(e) => onChange(sectionIdx, e)}
              value={section.subject}
              className={`w-full p-2 mb-2 border dark:bg-input-dark-bg-1 border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 font-bold ${
                section.highlight ? "bg-red-700 dark:bg-red-700" : ""
              }`}
            />
            <button
              onClick={() => toggleSection(sectionIdx)}
              className="mb-2 text-blue hover:text-blue-200"
              style={{
                cursor: "pointer",
                backgroundColor: "transparent",
                border: "none",
                outline: "none",
              }}
            >
              {section.openSection ? "▲" : "▼"}
            </button>
            <button
              onClick={() =>
                dispatch({ type: DELETE_SECTION, payload: sectionIdx })
              }
              className="mb-2 -mr-2 text-white bg-blue-950 hover:bg-red-800 "
            >
              Remove
            </button>
          </div>
          {section.openSection && (
            <div className="col-span-2">
              <textarea
                name="notes"
                placeholder="Notes"
                type="text"
                onChange={(e) => onChange(sectionIdx, e)}
                value={section.notes}
                className="w-full h-24 p-2 mb-2 dark:bg-input-dark-bg-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              />

              <form onSubmit={(e) => onSubmit(e, sectionIdx)}>
                <div className="flex items-center">
                  <input
                    name="url"
                    placeholder="Add a link"
                    type="text"
                    className="w-full p-2 dark:bg-input-dark-bg-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <button
                    type="submit"
                    className="ml-2 text-white bg-blue-950 hover:bg-blue-900"
                  >
                    +
                  </button>
                </div>

                {section.message && (
                  <div className="text-red-500 mt-2">{section.message}</div>
                )}
              </form>

              {section.url && section.url.length > 0 && (
                <div className="flex flex-col border border-gray-300 dark:bg-input-dark-bg-1 rounded bg-gray-100 mt-2">
                  <ul className="space-y-2">
                    {section.url.map((link, urlIdx) => (
                      <li
                        key={urlIdx}
                        className="flex justify-between items-center mt-2 mb-2 border border-gray-400 rounded bg-gray-300 dark:bg-input-dark-bg-2  hover:bg-gray-400 p-2 break-all"
                      >
                        <a
                          href={link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 dark:text-text-dark hover:text-blue-600 hover:underline ml-1"
                        >
                          {extractDomain(link)}
                        </a>

                        <button
                          onClick={() =>
                            dispatch({
                              type: DELETE_LINK,
                              payload: { sectionIdx, urlIdx },
                            })
                          }
                          className="ml-2 text-red-500 bg-blue-950 hover:text-red-700"
                          aria-label="Delete"
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default App;
