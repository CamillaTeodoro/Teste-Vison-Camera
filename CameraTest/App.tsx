import React, {useEffect, useState} from 'react';
import {Button, StyleSheet, Text, View} from 'react-native';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

function App() {
  const {hasPermission, requestPermission} = useCameraPermission();
  const device = useCameraDevice('back');
  const [cameraActive, setCameraActive] = useState(false);
  const [barcodeData, setBarcodeData] = useState<string | null>(null);

  console.log('barcode: ', barcodeData);

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

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: codes => {
      if (codes.length > 0) {
        const value = codes[0].value;
        if (!!value) {
          setBarcodeData(value);
        }
      }
      console.log(codes);
    },
  });

  return (
    <View style={styles.container}>
      {cameraActive ? (
        device ? (
          <View style={styles.cameraContainer}>
            <Camera
              style={StyleSheet.absoluteFill}
              device={device}
              isActive={true}
              codeScanner={codeScanner}
            />
            <View style={styles.buttonContainer}>
              <Button onPress={onPressCloseCamera} title="Fechar Câmera" />
            </View>
          </View>
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
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraContainer: {
    width: '100%',
    height: '60%',
    position: 'relative',
  },
});

export default App;
