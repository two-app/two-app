import React, { useState } from 'react';
import { FormStyle } from '../memories/new_memory/FormStyles';
import Modal from 'react-native-modal';
import { View, Text, StyleSheet } from 'react-native';
import { InputCardButton } from '../forms/InputCardButton';
import AntIcon from 'react-native-vector-icons/AntDesign';
import Colors from '../Colors';
import { useNavigation } from '@react-navigation/native';
import { Tag } from './Tag';
import { TouchableOpacity } from 'react-native-gesture-handler';

export const NewTagButton = ({ onCreated }: { onCreated: (tag: Tag) => void }) => {
  const { navigate } = useNavigation();

  return (
    <InputCardButton style={FormStyle.card} onClick={() => navigate('NewTagScreen', { onSubmit: onCreated })}>
      <View style={FormStyle.iconContainer}>
        <AntIcon name="tago" style={{ fontSize: 13, color: Colors.REGULAR }} />
      </View>
      <Text style={{ color: Colors.REGULAR }}>
        Optional tag, e.g Anniversary or Birthday...
      </Text>
    </InputCardButton>
  );
};

export const TagCard = ({ tag, onDeselect }: { tag: Tag, onDeselect: () => void }) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <DeselectModal
        tag={tag}
        isVisible={showModal}
        onExit={() => setShowModal(false)}
        onDeselect={onDeselect}
      />
      <InputCardButton style={FormStyle.card} onClick={() => setShowModal(true)}>
        <View style={FormStyle.iconContainer}>
          <AntIcon name="tago" style={{ fontSize: 13, color: Colors.REGULAR }} />
        </View>
        <Text style={{ color: Colors.DARK }}>
          {tag.name}
        </Text>
      </InputCardButton>
    </>
  );
};

type DeselectModalProps = {
  tag: Tag,
  isVisible: boolean,
  onExit: () => void,
  onDeselect: () => void
}

const DeselectModal = ({ tag, isVisible, onExit, onDeselect }: DeselectModalProps) => (
  <Modal
    isVisible={isVisible}
    onSwipeComplete={() => onExit()}
    onBackdropPress={() => onExit()}
    onBackButtonPress={() => onExit()}
    swipeDirection={['up', 'left', 'right', 'down']}
    style={{ justifyContent: "flex-end", margin: 0 }}
    backdropOpacity={0.5}
  >
    <TouchableOpacity style={styles.content} onPress={() => {
      onExit()
      onDeselect();
    }}>
      <Text>Remove <Text style={{ color: tag.color }}>{tag.name}</Text> Tag</Text>
    </TouchableOpacity>
  </Modal>
)

const styles = StyleSheet.create({
  content: {
    backgroundColor: 'white',
    padding: 20,
    paddingBottom: 30,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  contentTitle: {
    fontSize: 20,
    marginBottom: 12,
  },
});