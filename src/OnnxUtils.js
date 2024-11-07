import * as ort from "onnxruntime-web";

function softmax(arr) {
  return arr.map(function(value,index) { 
    return Math.exp(value) / arr.map( function(y /*value*/){ return Math.exp(y) } ).reduce( function(a,b){ return a+b })
  })
}

const reduceFlatten = (array) => {
  const reducer = (accumulator, currentValue) =>
    accumulator.concat(currentValue);
  return array.reduce(reducer, []);
};

export const changeArrayToTensor = (array) => {
  const flatArray = reduceFlatten(array);
  const data = Float32Array.from(flatArray);

  const tensor = new ort.Tensor("float32", data, [1, 1, 28, 28]);
  return tensor;
};

export async function runSqueezenetModel(preprocessedData) {
  const session = await ort.InferenceSession.create("./recognizeNumbers.onnx");
  const result = await session.run({ input: preprocessedData });
  return softmax(result["24"].cpuData)
}
