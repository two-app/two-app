import {useState} from 'react';
import Modal from 'react-native-modal';
import {View, Text} from 'react-native';
import AntIcon from 'react-native-vector-icons/AntDesign';

import {FormStyle} from '../memories/new_memory/FormStyles';
import Colors from '../Colors';
import {TouchableCard} from '../forms/Card';
import {Button, ButtonStyles} from '../forms/Button';

import type {Tag} from './Tag';
import {useNavigation} from '@react-navigation/native';
import {Routes} from '../navigation/NavigationUtilities';

type NewTagButtonProps = {
  onCreated: (tag: Tag) => void;
  placeholder: string;
};

export const NewTagButton = ({onCreated, placeholder}: NewTagButtonProps) => {
  const {navigate} = useNavigation<Routes>();
  return (
    <TouchableCard
      style={FormStyle.card}
      onPress={() => navigate('TagManagementScreen', {
        onSubmit: onCreated,
      })}
      a11={{ accessibilityLabel: 'Tap to create a new tag' }}>
      <View style={FormStyle.iconContainer}>
        <AntIcon name="tago" style={{ fontSize: 13, color: Colors.REGULAR }} />
      </View>
      <Text style={{ color: Colors.REGULAR }}>{placeholder}</Text>
    </TouchableCard>
  );
};

NewTagButton.defaultProps = {
  placeholder: 'Optional tag, e.g Anniversary or Birthday...',
};

type TagCardProps = {
  tag: Tag;
  onDeselect: () => void;
};

export const TagCard = ({tag, onDeselect}: TagCardProps) => {
  const [showModal, setShowModal] = useState(false);
  return (
    <>
      <DeselectModal
        tag={tag}
        isVisible={showModal}
        onExit={() => setShowModal(false)}
        onDeselect={onDeselect}
      />
      <TouchableCard style={FormStyle.card} onPress={() => setShowModal(true)}>
        <View style={FormStyle.iconContainer}>
          <AntIcon name="tago" style={{fontSize: 13, color: Colors.REGULAR}} />
        </View>
        <Text style={{color: Colors.DARK}}>{tag.name}</Text>
      </TouchableCard>
    </>
  );
};

type DeselectModalProps = {
  tag: Tag;
  isVisible: boolean;
  onExit: () => void;
  onDeselect: () => void;
};

const DeselectModal = ({
  tag,
  isVisible,
  onExit,
  onDeselect,
}: DeselectModalProps) => {
  const [shouldDeselect, setShouldDeselect] = useState(false);
  const onModalHide = () => shouldDeselect && onDeselect();

  return (
    <Modal
      isVisible={isVisible}
      onSwipeComplete={onExit}
      onBackdropPress={onExit}
      onBackButtonPress={onExit}
      onModalHide={onModalHide}
      accessibilityLabel="Tap to deselect tag"
      accessibilityHint="Tap to deselect tag"
      swipeDirection={['up', 'down']}
      style={{justifyContent: 'center', margin: 0}}
      backdropOpacity={0.8}>
      <View style={{margin: 20}}>
        <Button
          onPress={() => {
            setShouldDeselect(true);
            onExit();
          }}
          text={`Deselect ${tag.name} Tag`}
          buttonStyle={ButtonStyles.light}
          pressedButtonStyle={ButtonStyles.lightPressed}
        />
      </View>
    </Modal>
  );
};
