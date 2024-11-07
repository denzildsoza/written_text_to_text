import { useEffect } from "react";

const useDraw = (image, scratchPadRef, canvasWidth, canvasHeight) => {
  useEffect(() => {
    let prevXPos = null;
    let prevYPos = null;
    let mouseDown = 0;
    const { offsetTop, offsetLeft } = scratchPadRef.current;

    const context = scratchPadRef.current.getContext("2d");
    context.lineWidth = 20;
    context.lineCap = "round";
    const begin = (x, y) => {
      context.beginPath();
      context.moveTo(x, y);
      const dx = Math.round(x / Math.round(canvasWidth / 28));
      const dy = Math.round(y / Math.round(canvasHeight / 28));


      image[dy][dx] = 255;
      image[dy + 1][dx - 1] = 170;
      image[dy - 1][dx + 1] = 180;
      image[dy + 1][dx + 1] = 210;
      image[dy - 1][dx - 1] = 190;
      image[dy + 1][dx] = 255;
      image[dy - 1][dx] = 255;
      image[dy][dx - 1] = 255;
      image[dy][dx + 1] = 255;
    };

    const conclude = (x, y) => {
      context.lineTo(x, y);
      context.stroke();
    };

    const onUp = () => {
      ++mouseDown;
    };
    const onDown = () => {
      --mouseDown;
      prevXPos = null;
      prevYPos = null;
    };

    const onMouseMove = (e) => {
      if (!mouseDown) return;
      const { clientX, clientY } = e;

      const xPos = clientX - offsetLeft;
      const yPos = clientY - offsetTop;

      if (!prevXPos) {
        begin(xPos, yPos);
      } else {
        begin(prevXPos, prevYPos);
        conclude(xPos, yPos);
      }
      prevXPos = xPos;
      prevYPos = yPos;
    };

    const mouseLeave = () => {
      prevXPos = null;
      prevYPos = null;
    };

    window.addEventListener("mouseup", onUp);
    window.addEventListener("mousedown", onDown);
    window.addEventListener("mouseout", mouseLeave);
    scratchPadRef.current.addEventListener("mousemove", onMouseMove);

    return () => {
      scratchPadRef.current.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onUp);
      window.removeEventListener("mousedown", onDown);
      window.removeEventListener("mouseout", mouseLeave);
    };
  }, [canvasWidth, canvasHeight]);
};

export default useDraw;
