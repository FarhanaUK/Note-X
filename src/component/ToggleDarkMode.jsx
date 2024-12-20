import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from '@fortawesome/free-solid-svg-icons';



function ToggleDarkMode({ darkModeOn, toggleDarkMode }) {

return (

<div>
     
         <div className="flex justify-between items-center mb-4">
        <label className="flex items-center cursor-pointer">

          <input
            type="checkbox"
            className="sr-only peer"
            checked={darkModeOn}
            onChange={toggleDarkMode}
          />
          <div className="top-0 w-14 h-6 bg-gray-300 dark:bg-gray-800 rounded-full relative peer-focus:ring-2 peer-focus:ring-blue-500 peer-checked:bg-gray-800 transition duration-200">
            <div
              className={`absolute top-0 left-1 w-6 h-6 bg-white rounded-full flex items-center justify-center transition-transform duration-200 ${
                darkModeOn ? "transform translate-x-6" : ""
              }`}
            >
              {darkModeOn ? (
                <FontAwesomeIcon
                  icon={faMoon}
                  style={{ color: "#291c62", fontSize: "16px" }}
                />
              ) : (
                <FontAwesomeIcon
                  icon={faSun}
                  style={{ color: "#e4e5f1", fontSize: "16px" }}
                />
              )}
            </div>
          </div>
        </label>
        
      </div>

      </div>




)
}

export default ToggleDarkMode