import React from 'react';
import {View, TouchableOpacity, Image, Text, ImageBackground} from 'react-native';
import {Content} from '../MemoryModels';
import _ from 'lodash';
import Icon from 'react-native-vector-icons/FontAwesome'
import { buildContentURI } from '../MemoryService';

/**
 * Chunks the content into rows.
 * Rows with empty cells are padded with null such that
 * each row has the exact number of columns supplied.
 * @param content to chunk
 * @param numColumns per row
 */
export const chunkContentToRows = (
  content: Content[],
  numColumns: number,
): (Content | null)[][] => {
  if (content.length === 0) return [];
  if (content.length === numColumns) return [content];

  const numFullRows: number = Math.floor(content.length / numColumns);
  const lastRowColumnCount: number = content.length - numFullRows * numColumns;
  const ghostColumnCount: number = numColumns - lastRowColumnCount;

  const rows: any[][] = _.chunk(content, numColumns);
  const last: number = rows.length - 1;
  rows[last] = rows[last].concat(new Array(ghostColumnCount).fill(null));

  return rows;
};

type GridRowProps = {
  content: (Content | null)[];
  renderCell: (content: Content, cellIndex: number) => React.ReactNode;
};

/**
 * Render a row, replacing null elements with an Empty Cell.
 * Default margin of -5 on the row view.
 */
export const GridRow = ({content, renderCell}: GridRowProps) => (
  <View style={{flexDirection: 'row', flex: 1, margin: -5}}>
    {content.map((cell, index) =>
      cell === null ? <EmptyCell key={index} /> : renderCell(cell, index),
    )}
  </View>
);

type CellProps = {
  item: Content;
  onClick: () => void;
};

export const EmptyCell = () => <Cell />;

export const ImageCell = ({item, onClick}: CellProps) => (
  <Cell key={item.fileKey}>
    <TouchableOpacity style={{width: '100%', height: '100%'}} onPress={onClick}>
      <Image
        source={{uri: buildContentURI(item.fileKey, item.thumbnail)}}
        style={{flex: 1}}
      />
    </TouchableOpacity>
  </Cell>
);

export const VideoCell = ({item, onClick}: CellProps) => (
  <Cell key={item.fileKey}>
    <TouchableOpacity style={{width: '100%', height: '100%'}} onPress={onClick}>
      <ImageBackground
        source={{uri: buildContentURI(item.fileKey, item.thumbnail)}}
        style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}
      >
        <Icon name="play-circle" color="white" size={30}/>
      </ImageBackground>
    </TouchableOpacity>
  </Cell>
);

export const Cell = ({children}: {children?: React.ReactNode}) => (
  <View style={{flex: 1, aspectRatio: 1, padding: 5, marginTop: 10}}>
    {children}
  </View>
);
