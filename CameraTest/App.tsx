import React from 'react';
import { StyleSheet } from "react-native";
import {
  Camera,
  useCameraDevice,
  useFrameProcessor,
} from "react-native-vision-camera";
import { useBarcodeScanner } from "react-native-vision-camera-barcodes-scanner";
import { ScanBarcodeOptions } from 'react-native-vision-camera-barcodes-scanner/lib/typescript/src/types';

function App() {
  const device = useCameraDevice('back');
  const options: ScanBarcodeOptions = ["qr"]
  const {scanBarcodes} = useBarcodeScanner(options)
  const frameProcessor = useFrameProcessor((frame) => {
    'worklet'
    const data = scanBarcodes(frame)
	console.log(data, 'data')
  }, [])
  return (
      <>
      {!!device && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive
          frameProcessor={frameProcessor}
        />
      )}
      </>
  );
}
export default App;