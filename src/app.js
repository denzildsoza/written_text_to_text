import React, { useEffect, useRef, useState } from "react";
import { changeArrayToTensor, runSqueezenetModel } from "./OnnxUtils";
import useDraw from "./useDraw";

const App = () => {
  const [canvasHeight, setCanvasHeight] = useState(0);
  const [canvasWidth, setCanvasWidth] = useState(0);
  const [predictedValue, setPredictedValue] = useState(null);

  const scratchPadRef = useRef(null);
  let image = new Array(28).fill(0).map(() => new Array(28).fill(0));

  useDraw(image, scratchPadRef, canvasWidth, canvasHeight);

  const clearCanvas = () => {
    const context = scratchPadRef.current.getContext("2d");
    context.clearRect(0, 0, canvasWidth, canvasHeight);
  };

  useEffect(() => {
    setCanvasHeight(scratchPadRef.current.clientHeight);
    setCanvasWidth(scratchPadRef.current.clientWidth);
  }, []);

  return (
    <div>
      <h1 className="heading">Draw Numbers from 0-9</h1>
      <div className="body">
        <div id="left">
          <canvas
            id="scratch-pad"
            ref={scratchPadRef}
            height={canvasHeight ? canvasHeight : ""}
            width={canvasWidth ? canvasWidth : ""}
          />
          <div id="button-container">
            <button
              onClick={async () => {
                const tensor = changeArrayToTensor(image);
                const prediction = await runSqueezenetModel(tensor);
                setPredictedValue(prediction);
                clearCanvas();
                image = new Array(28).fill(0).map(() => new Array(28).fill(0));
              }}
            >
              Predict
            </button>
            <button onClick={() => clearCanvas()}>Clear</button>
          </div>
        </div>
        <div id="predictions" className="cover-all">
          <span>{predictedValue ? predictedValue : ""}</span>
        </div>
      </div>
    </div>
  );
};

export default App;
