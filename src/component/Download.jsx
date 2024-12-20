import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faDownload } from "@fortawesome/free-solid-svg-icons";


function Download({downloadNotes, downloadError, state, dispatch}) {



return(
<div className="absolute top-1 right-1 flex justify-between items-center mb-4">
<button
  onClick={() => downloadNotes(state, dispatch)}
  className=" text-sm border border-gray-300 rounded dark:bg-input-dark-bg"
>
  <FontAwesomeIcon icon={faDownload} />
</button>
</div>


)}


export default Download




