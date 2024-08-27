import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
} from 'react-native-vision-camera';
import {useBarcodeScanner} from 'react-native-vision-camera-barcodes-scanner';
import {ScanBarcodeOptions} from 'react-native-vision-camera-barcodes-scanner/lib/typescript/src/types';

function App() {
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const options: ScanBarcodeOptions = ['ean_13'];
  const {scanBarcodes} = useBarcodeScanner(options);
  const [cameraActive, setCameraActive] = useState(false);

  const frameProcessor = useFrameProcessor(frame => {
    'worklet';
    const data = scanBarcodes(frame);
    console.log(data, 'data');
  }, []);

  useEffect(() => {
    if (cameraActive) {
      (async () => {
        const permission = await requestPermission();
        if (permission) {
          console.log('Camera permission granted');
        } else {
          console.log('Camera permission not granted');
          setCameraActive(false);
        }
      })();
    }
  }, [cameraActive]);

  const onPressOpenCamera = () => {
    setCameraActive(true);
  };

  const onPressCloseCamera = () => {
    setCameraActive(false);
  };

  return (
    <View style={{flex: 1}}>
      {cameraActive ? (
        device ? (
          <>
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={cameraActive}
              frameProcessor={frameProcessor}
            />
            <View style={styles.buttonContainer}>
              <Button onPress={onPressCloseCamera} title="Fechar Câmera" />
            </View>
          </>
        ) : (
          <Text>No camera device available</Text>
        )
      ) : (
        <Button onPress={onPressOpenCamera} title="Abrir Câmera" />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    alignSelf: 'center',
  },
});

export default App;
