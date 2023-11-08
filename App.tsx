/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

/* eslint-disable no-use-before-define */

import {
  Canvas,
  Circle,
  Group,
  Path,
  SkFont,
  Skia,
  Text,
  matchFont,
  notifyChange,
  useFonts,
} from '@shopify/react-native-skia';
import React, {useEffect} from 'react';
import {Dimensions, View} from 'react-native';
import {
  useDerivedValue,
  useSharedValue,
  withRepeat,
  withSpring,
} from 'react-native-reanimated';

const Element = ({labelFont, idx}: {idx: number; labelFont: SkFont}) => {
  const {width, height} = Dimensions.get('window');

  const initialX = width / 4;
  const initialY = height / 4;

  const x = useSharedValue(initialX);
  const y = useSharedValue(initialY);

  useEffect(() => {
    const radius = (idx / 10 + 1) * 30;
    const angle = idx;

    const coordX = radius * Math.cos(angle);
    const coordY = radius * Math.sin(angle);

    x.value = withRepeat(
      withSpring(initialX + coordX, {dampingRatio: 0.7}),
      -1,
      true,
    );
    y.value = withRepeat(
      withSpring(initialY + coordY, {dampingRatio: 0.7}),
      -1,
      true,
    );
  }, []);

  const transformMatrix = useSharedValue(Skia.Matrix());

  useDerivedValue(() => {
    transformMatrix.value.translate(x.value, y.value);
    notifyChange(transformMatrix);
  });

  const path = Skia.Path.Make();
  path.moveTo(initialX, initialY);
  path.addCircle(initialX, initialY, 15);
  path.simplify();

  return (
    <Group matrix={transformMatrix}>
      <Circle cx={initialX} cy={initialY} r={15} color={'gray'} />
      <Path path={path} style="stroke" strokeWidth={2} color={'pink'} />
      <Path
        path={path}
        style="stroke"
        strokeWidth={2}
        color={'yellow'}
        end={0.5}
      />
      <Text
        x={initialX}
        y={initialY}
        text={'text'}
        font={labelFont}
        color={'#515053'}
      />
    </Group>
  );
};

function App(): JSX.Element {
  const {width, height} = Dimensions.get('window');

  const fontManager = useFonts({helvetica: [require('./Helvetica.ttf')]});

  if (!fontManager) return <></>;

  const labelFont = matchFont(
    {fontFamily: 'helvetica', fontSize: 12},
    fontManager,
  );

  return (
    <View style={{flex: 1, backgroundColor: '#000000'}}>
      <Canvas style={{width, height}}>
        {Array.from(Array(43).keys()).map((_, idx) => (
          <Element key={idx} idx={idx} labelFont={labelFont} />
        ))}
      </Canvas>
    </View>
  );
}

export default App;
