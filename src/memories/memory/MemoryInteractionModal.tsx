import {Text, View, StyleSheet} from 'react-native';
import {useState, useEffect} from 'react';
import NativeModal from 'react-native-modal';
import {useDispatch} from 'react-redux';
import {PayloadAction} from 'typesafe-actions';

import {
  setMemoryDisplayPicture,
  deleteContent,
} from '../../content/ContentService';
import {ButtonStyles, Button} from '../../forms/Button';
import Colors from '../../Colors';
import {ErrorResponse} from '../../http/Response';
import {updateMemory, deleteContent as deleteContentReducer} from '../store';
import {Memory} from '../MemoryModels';
import {Content} from '../../content/ContentModels';

import {ImageCell} from './Grid';

type MemoryInteractionModalProps = {
  memory: Memory;
  onClose: () => void;
  content?: Content;
};

type ModalData = {
  content?: Content;
  isVisible: boolean;
  afterCloseFn?: () => void;
};

type ButtonLoading = {
  setDisplayPicture: boolean;
  deleteContent: boolean;
};

const noLoading: ButtonLoading = {
  setDisplayPicture: false,
  deleteContent: false,
};

export const MemoryInteractionModal = ({
  memory,
  content,
  onClose,
}: MemoryInteractionModalProps) => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState<ButtonLoading>(noLoading);
  const [error, setError] = useState<string>('');
  const [modal, setModal] = useState<ModalData>({
    content,
    isVisible: false,
  });

  useEffect(() => setModal({content, isVisible: content != null}), [content]);

  const closeModal = () => {
    setModal({...modal, isVisible: false});
    setLoading(noLoading);
  };

  const dispatchAfterClosed = (action: PayloadAction<string, any>) => {
    setModal({
      ...modal,
      isVisible: false,
      afterCloseFn: () => dispatch(action),
    });
  };

  const updateDisplayPicture = (contentId: number) => {
    setLoading({...loading, setDisplayPicture: true});
    setMemoryDisplayPicture(memory.id, contentId)
      .then((updatedMemory: Memory) =>
        dispatchAfterClosed(
          updateMemory({mid: memory.id, memory: updatedMemory}),
        ),
      )
      .catch((e: ErrorResponse) => setError(e.reason))
      .finally(() => setLoading(noLoading));
  };

  const deleteContentThenUpdate = (contentId: number) => {
    setLoading({...loading, deleteContent: true});
    deleteContent(memory.id, contentId)
      .then(() =>
        dispatchAfterClosed(deleteContentReducer({mid: memory.id, contentId})),
      )
      .catch((e: ErrorResponse) => setError(e.reason))
      .finally(() => setLoading(noLoading));
  };

  return (
    <NativeModal
      accessibilityState={{expanded: modal.isVisible}}
      accessibilityHint="This modal provides options to modify or remove a piece of content."
      accessibilityLabel="Content options modal."
      isVisible={modal.isVisible}
      onSwipeComplete={closeModal}
      onBackdropPress={closeModal}
      backdropTransitionOutTiming={0}
      onBackButtonPress={closeModal}
      onModalHide={() => {
        if (modal.afterCloseFn != null) {
          modal.afterCloseFn();
          setModal({...modal, afterCloseFn: undefined});
        }

        onClose();
      }}
      testID="interaction-modal"
    >
      {modal.content != null && (
        <Modal
          content={modal.content}
          onUpdateDisplayPicture={id => updateDisplayPicture(id)}
          onDelete={id => deleteContentThenUpdate(id)}
          loading={loading}
          error={error}
        />
      )}
    </NativeModal>
  );
};

type ModalType = {
  content: Content;
  onUpdateDisplayPicture: (contentId: number) => void;
  onDelete: (contentId: number) => void;
  loading: ButtonLoading;
  error?: string;
};

const Modal = ({
  content,
  onUpdateDisplayPicture,
  onDelete,
  loading,
  error,
}: ModalType) => {
  return (
    <View style={styles.modal}>
      <View style={{width: 100, height: 100, marginBottom: 20}}>
        <ImageCell item={content} />
      </View>

      <Button
        text="Set as Display Picture"
        onPress={() => onUpdateDisplayPicture(content.contentId)}
        accessibilityHint="Sets the display picture to this content"
        accessibilityLabel="Set the Display Picture"
        style={{marginBottom: 10, width: '100%'}}
        loading={loading.setDisplayPicture}
      />

      <Button
        text="Delete Content"
        onPress={() => onDelete(content.contentId)}
        buttonStyle={ButtonStyles.red}
        pressedButtonStyle={ButtonStyles.redPressed}
        accessibilityHint="Deletes this content from the memory."
        accessibilityLabel="Delete this content."
        style={{width: '100%'}}
        loading={loading.deleteContent}
      />

      <Text
        style={styles.errorText}
        accessibilityLabel="Resulting error from your action."
      >
        {error}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  modal: {
    backgroundColor: 'white',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  errorText: {
    color: Colors.DARK_SALMON,
    marginTop: 15,
  },
});
