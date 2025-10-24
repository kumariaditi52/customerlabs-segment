import React, { useState } from "react";
import "./App.css";

function App() {
  const [showModal, setShowModal] = useState(false);
  const [segmentName, setSegmentName] = useState("");
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [tempSchema, setTempSchema] = useState("");
  const [responseData, setResponseData] = useState(null);

  const schemaOptions = [
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" },
  ];

  const handleAddSchema = () => {
    if (tempSchema && !selectedSchemas.includes(tempSchema)) {
      setSelectedSchemas([...selectedSchemas, tempSchema]);
      setTempSchema("");
    }
  };

  const handleSchemaChange = (index, newSchema) => {
    const updated = [...selectedSchemas];
    updated[index] = newSchema;
    setSelectedSchemas(updated);
  };

  const handleSubmit = async () => {
    const payload = {
      segment_name: segmentName,
      schema: selectedSchemas.map((s) => {
        const label = schemaOptions.find((o) => o.value === s)?.label || s;
        return { [s]: label };
      }),
    };

    // data below modal
    setResponseData(payload);

    try {
      const res = await fetch("https://webhook.site/your-webhook-url", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) alert("Segment saved successfully!");
      else alert("Failed to save segment.");
    } catch (err) {
      alert(" sending data!");
      console.error(err);
    }

    setShowModal(false);
  };

  return (
    <div className="app">
      <button className="save-btn" onClick={() => setShowModal(true)}>
        Save segment
      </button>

      {/* Popup Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Save Segment</h2>

            <input
              type="text"
              placeholder="Enter segment name"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              className="segment-input"
            />

            <div className="blue-box">
              {selectedSchemas.map((schema, index) => (
                <select
                  key={index}
                  value={schema}
                  onChange={(e) => handleSchemaChange(index, e.target.value)}
                  className="schema-dropdown"
                >
                  <option value="">Select schema</option>
                  {schemaOptions
                    .filter(
                      (opt) =>
                        !selectedSchemas.includes(opt.value) ||
                        opt.value === schema
                    )
                    .map((opt) => (
                      <option key={opt.value} value={opt.value}>
                        {opt.label}
                      </option>
                    ))}
                </select>
              ))}
            </div>

            {/* Add new schema dropdown */}
            <select
              value={tempSchema}
              onChange={(e) => setTempSchema(e.target.value)}
              className="schema-dropdown"
            >
              <option value="">Add schema to segment</option>
              {schemaOptions
                .filter((opt) => !selectedSchemas.includes(opt.value))
                .map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
            </select>

            <button className="add-link" onClick={handleAddSchema}>
              + Add new schema
            </button>

            <div className="modal-actions">
              <button className="cancel-btn" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="submit-btn" onClick={handleSubmit}>
                Save the segment
              </button>
            </div>
          </div>
        </div>
      )}

      {/*sent data below modal */}
      {responseData && (
        <div className="response-box">
          <h3>Data sent to server:</h3>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
