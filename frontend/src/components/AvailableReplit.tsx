import { useNavigate } from "react-router-dom";
import useFetchAvailableReplit from "../hooks/useFetchAvailableReplit";
import "../Folder.css";

const AvailableReplit = () => {
  const navigate = useNavigate();
  
  const availableReplit = useFetchAvailableReplit();

  return (
    <div className="container">
      <h1>Available Folders</h1>
      <table className="folder-table">
        <thead>
          <tr>
            <th>Name</th>
          </tr>
        </thead>
        <tbody>
          {availableReplit.map((folder) => {
            const modifiedString = folder.Prefix.replace(/^code\/|\/$/g, "");
            return (
              <tr
                key={modifiedString}
                onClick={() => navigate(`/coding/?replId=${modifiedString}`)}
              >
                <td>{modifiedString}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default AvailableReplit;
