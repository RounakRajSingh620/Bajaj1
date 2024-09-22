import "./App.css";
import { useState } from "react";

function App() {
  const [formData, setFormData] = useState("json data here");
  const [myData, setMyData] = useState({});
  const [selectedKeys, setSelectedKeys] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let resdata;
    try {
      resdata = await fetch("http://localhost:3001/bfhl", {
        // Corrected the URL string
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ data: formData }), // Ensure formData is a valid JSON string
      });

      if (!resdata.ok) {
        throw new Error("Network response was not ok");
      }

      const resjson = await resdata.json();
      setMyData(resjson);
    } catch (error) {
      console.error("Failed to save data:", error);
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <div>
          <label>API Input</label>
          <input
            type="text"
            value={formData}
            onChange={(e) => setFormData(e.target.value)}
          />
        </div>
        <button type="submit">Submit</button>
        <FilterComponent
          data={myData}
          selectedKeys={selectedKeys}
          setSelectedKeys={setSelectedKeys}
        />
        <DisplayComponent data={myData} selectedKeys={selectedKeys} />
      </form>
    </>
  );
}

const FilterComponent = ({ data, selectedKeys, setSelectedKeys }) => {
  const keys = Object.keys(data);

  const handleCheckboxChange = (key) => {
    setSelectedKeys((prevKeys) =>
      prevKeys.includes(key)
        ? prevKeys.filter((k) => k !== key)
        : [...prevKeys, key]
    );
  };

  return (
    <div>
      <h3>Select Keys to Display:</h3>
      {keys.map((key) => (
        <div key={key}>
          <input
            type="checkbox"
            checked={selectedKeys.includes(key)}
            onChange={() => handleCheckboxChange(key)}
          />
          <label>{key}</label>
        </div>
      ))}
    </div>
  );
};

const DisplayComponent = ({ data, selectedKeys }) => {
  return (
    <div>
      <h3>Selected Data:</h3>
      <pre>
        {JSON.stringify(
          Object.fromEntries(
            Object.entries(data).filter(([key]) => selectedKeys.includes(key))
          ),
          null,
          2
        )}
      </pre>
    </div>
  );
};

export default App;
