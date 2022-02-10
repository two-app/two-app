import * as React from 'react';
import {
  View,
  TouchableOpacity,
  ImageBackground,
  AccessibilityProps,
} from 'react-native';
import Image from 'react-native-fast-image';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome';

import Colors from '../../Colors';
import {Content, contentUrl} from '../../content/ContentModels';

/**
 * Chunks the content into rows.
 * Rows with empty cells are padded with null such that
 * each row has the exact number of columns supplied.
 * @param content to chunk
 * @param numColumns per row
 */
export function chunkToRows<T>(
  content: T[],
  numColumns: number,
): (T | null)[][] {
  if (content.length === 0) {
    return [];
  }
  if (content.length === numColumns) {
    return [content];
  }
  if (content.length % numColumns === 0) {
    return _.chunk(content, numColumns);
  }

  const numFullRows: number = Math.floor(content.length / numColumns);
  const lastRowColumnCount: number = content.length - numFullRows * numColumns;
  const ghostColumnCount: number = numColumns - lastRowColumnCount;

  const rows: any[][] = _.chunk(content, numColumns);
  const last: number = rows.length - 1;
  rows[last] = rows[last].concat(new Array(ghostColumnCount).fill(null));

  return rows;
}

type GridRowProps<T> = {
  content: (T | null)[];
  renderCell: (content: T, cellIndex: number) => React.ReactNode;
};

/**
 * Render a row, replacing null elements with an Empty Cell.
 * Default margin of -5 on the row view.
 */
export const GridRow = <T extends unknown>({
  content,
  renderCell,
}: GridRowProps<T>) => (
  <View style={{flexDirection: 'row', flex: 1, margin: -5}}>
    {content.map((cell, index) =>
      cell === null ? <EmptyCell key={index} /> : renderCell(cell, index),
    )}
  </View>
);

type CellProps = {
  item: Content;
  onClick: () => void;
  onLongPress: () => void;
};

export const EmptyCell = () => <Cell />;

export const TouchableImageCell = ({item, onClick, onLongPress}: CellProps) => (
  <Cell key={item.contentId}>
    <TouchableOpacity
      style={{width: '100%', height: '100%'}}
      onPress={onClick}
      onLongPress={onLongPress}>
      <Image
        source={{uri: contentUrl(item, 'thumbnail')}}
        style={{flex: 1, backgroundColor: Colors.DARK}}
      />
    </TouchableOpacity>
  </Cell>
);

export const ImageCell = ({item}: {item: Content}) => (
  <Cell
    key={item.contentId}
    a11={{accessibilityLabel: 'A preview of selected content.'}}>
    <Image
      source={{uri: contentUrl(item, 'thumbnail')}}
      style={{flex: 1, backgroundColor: Colors.DARK}}
    />
  </Cell>
);

export const TouchableVideoCell = ({item, onClick, onLongPress}: CellProps) => (
  <Cell key={item.contentId}>
    <TouchableOpacity
      style={{width: '100%', height: '100%'}}
      onPress={onClick}
      onLongPress={onLongPress}>
      <ImageBackground
        source={{uri: contentUrl(item, 'thumbnail')}}
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: Colors.DARK,
        }}>
        <Icon name="play-circle" color="white" size={30} />
      </ImageBackground>
    </TouchableOpacity>
  </Cell>
);

type BaseCellProps = {
  children?: React.ReactNode;
  a11?: AccessibilityProps;
};

export const Cell = ({children, a11}: BaseCellProps) => (
  <View style={{flex: 1, aspectRatio: 1, padding: 5, marginTop: 10}} {...a11}>
    {children}
  </View>
);
