import React from "react";
import { parse } from "papaparse";
import "./App.css";

export default function App() {
  const [highlighted, setHighlighted] = React.useState(false);
  const [contacts, setContacts] = React.useState([]);
  const [filteredContacts, setFilteredContacts] = React.useState([]);
  const [fileDelimiter, setFileDelimiter] = React.useState();
  const [delimiter, setDelimiter] = React.useState();
  const [lines, setLines] = React.useState();

  function setLimitedArray(e) {
    setLines(e.target.value);
    let newArray = contacts.filter((i, index) => ++index <= e.target.value);
    if (e.target.value) setFilteredContacts(newArray);
    else setFilteredContacts(contacts);
  }

  function handleChange(event) {
    let reader = new FileReader();
    reader.onloadend = () => {
      const text = reader.result;
      for (var i = 0; i < text.length; i++) {
        if (
          (text.charCodeAt(i) >= 33 && text.charCodeAt(i) <= 47) ||
          (text.charCodeAt(i) >= 123 && text.charCodeAt(i) <= 126)
        ) {
          setDelimiter(text.charAt(i));
          setFileDelimiter(text.charAt(i));
        }
      }
      const result = parse(text, { header: true });
      setFilteredContacts((existing) => [...existing, ...result.data]);
      setContacts((existing) => [...existing, ...result.data]);
    };
    reader.readAsText(event.target.files[0]);
  }

  return (
    <div className="main-body">
      <h1 className="text-center text-4xl">Contact Import</h1>
      <div
        className={`${highlighted ? "border-green" : "border-gray"}`}
        onDragEnter={() => {
          setHighlighted(true);
        }}
        onDragLeave={() => {
          setHighlighted(false);
        }}
        onDragOver={(e) => {
          e.preventDefault();
        }}
        onDrop={(e) => {
          e.preventDefault();
          setHighlighted(false);
          Array.from(e.dataTransfer.files).forEach(async (file) => {
            const text = await file.text();
            for (var i = 0; i < text.length; i++) {
              if (
                (text.charCodeAt(i) >= 33 && text.charCodeAt(i) <= 47) ||
                (text.charCodeAt(i) >= 123 && text.charCodeAt(i) <= 126)
              ) {
                setDelimiter(text.charAt(i));
                setFileDelimiter(text.charAt(i));
              }
            }
            const result = parse(text, { header: true });
            setFilteredContacts((existing) => [...existing, ...result.data]);
            setContacts((existing) => [...existing, ...result.data]);
          });
        }}
      >
        <span>DROP HERE or </span>
        <input type="file" className="upload-button" onChange={handleChange} />
      </div>
      <div className="input-section">
        <input
          className="border-input"
          type="text"
          placeholder="Delimiter"
          value={delimiter}
          onChange={(e) => setDelimiter(e.target.value)}
        />
        <input
          className="border-input"
          type="number"
          placeholder="No. of lines"
          value={lines}
          onChange={(e) => setLimitedArray(e)}
        />
      </div>
      {contacts.length > 0 && delimiter === fileDelimiter ? (
        <table>
          {filteredContacts.map((contact, index) => (
            <tr>
              <td>{contact.Name}</td>
              <td>{contact.Address} </td>
              <td>{contact.City} </td>
              <td>{contact.PinCode}</td>
            </tr>
          ))}
        </table>
      ) : (
        <table>
          {filteredContacts.map((contact, index) => (
            <tr>
              <td>
                {contact.Name}
                {fileDelimiter}
                {contact.Address}
                {fileDelimiter}
                {contact.City}
                {fileDelimiter}
                {contact.PinCode}
              </td>
            </tr>
          ))}
        </table>
      )}
    </div>
  );
}
