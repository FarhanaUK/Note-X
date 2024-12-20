import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";

// eslint-disable-next-line react/prop-types
function Download({downloadNotes, state, dispatch}) { 



return(
<div className="absolute top-1 right-1 flex justify-between items-center mb-4 mr-2">
<button
  onClick={() => downloadNotes(state, dispatch)}
  className=" text-sm border border-gray-300 rounded dark:bg-input-dark-bg"
>
  <FontAwesomeIcon icon={faDownload} />
</button>
</div>


)}


export default Download




