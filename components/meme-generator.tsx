import React, { useState, useRef, useEffect } from "react";
import Draggable from "react-draggable";

const MemeGenerator = () => {
  const [template, setTemplate] = useState("/templates/template1.webp");
  const [textInputs, setTextInputs] = useState([
    { id: 1, text: "Top Text", x: 50, y: 50 },
  ]);
  const canvasRef = useRef(null);

  const templates = [
    { id: "template1", url: "/templates/template1.webp" },
    { id: "template2", url: "/templates/template2.jpg" },
    { id: "template3", url: "/templates/template3.jpg" },
    { id: "template4", url: "/templates/template4.png" },
  ];

  const drawCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.src = template;

    img.onload = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      textInputs.forEach(({ x, y, text }) => {
        ctx.font = "24px Arial";
        ctx.fillStyle = "white";
        ctx.strokeStyle = "black";
        ctx.lineWidth = 2;
        ctx.fillText(text, x, y);
        ctx.strokeText(text, x, y);
      });
    };
  };

  // Redraw the canvas whenever the template or text changes
  useEffect(() => {
    drawCanvas();
  }, [template, textInputs]);

  const addText = () => {
    setTextInputs([
      ...textInputs,
      { id: Date.now(), text: "New Text", x: 50, y: 50 },
    ]);
  };

  const handleDrag = (e, data, id) => {
    const updatedTexts = textInputs.map((input) =>
      input.id === id ? { ...input, x: data.x, y: data.y } : input
    );
    setTextInputs(updatedTexts);
  };

  const handleTextChange = (id, newText) => {
    const updatedTexts = textInputs.map((input) =>
      input.id === id ? { ...input, text: newText } : input
    );
    setTextInputs(updatedTexts);
  };

  const downloadMeme = () => {
    drawCanvas(); // Ensure the canvas is redrawn with the latest text before downloading
    const canvas = canvasRef.current;
    const link = document.createElement("a");
    link.download = "meme.png";
    link.href = canvas.toDataURL();
    link.click();
  };

  return (
    <div style={{ textAlign: "center", color: "#fff", backgroundColor: "#1a1a1a", padding: "20px" }}>
      <h2>Meme Generator</h2>

      {/* Template Selector */}
      <select
        value={template}
        onChange={(e) => setTemplate(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px" }}
      >
        {templates.map((t) => (
          <option key={t.id} value={t.url}>
            {t.id}
          </option>
        ))}
      </select>

      {/* Canvas */}
      <div style={{ position: "relative", display: "inline-block" }}>
        <canvas ref={canvasRef} width={500} height={500} style={{ border: "1px solid #444" }} />
        {textInputs.map((input) => (
          <Draggable
            key={input.id}
            defaultPosition={{ x: input.x, y: input.y }}
            onStop={(e, data) => handleDrag(e, data, input.id)}
          >
            <div
              style={{
                position: "absolute",
                color: "white",
                textShadow: "2px 2px black",
                cursor: "move",
                fontSize: "20px",
                outline: "none",
              }}
              contentEditable
              suppressContentEditableWarning
              onInput={(e) => handleTextChange(input.id, e.currentTarget.textContent)}
              onClick={(e) => {
                // Enable triple click for selecting all text in the text box
                if (e.detail === 3) {
                  document.execCommand("selectAll", false, null);
                }
              }}
            >
              {input.text}
            </div>
          </Draggable>
        ))}
      </div>

      {/* Controls */}
      <div style={{ marginTop: "10px" }}>
        <button onClick={addText} style={{ margin: "5px", padding: "10px" }}>Add Text</button>
        <button onClick={downloadMeme} style={{ margin: "5px", padding: "10px" }}>Download Meme</button>
      </div>
    </div>
  );
};

export default MemeGenerator;
