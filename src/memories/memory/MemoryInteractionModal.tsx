import {Text, View, StyleSheet} from 'react-native';
import {useState, useEffect} from 'react';
import NativeModal from 'react-native-modal';

import {
  setMemoryDisplayPicture,
  deleteContent,
} from '../../content/ContentService';
import {ButtonStyles, Button} from '../../forms/Button';
import Colors from '../../Colors';
import {ErrorResponse} from '../../http/Response';
import {Memory} from '../MemoryModels';
import {Content} from '../../content/ContentModels';

import {ImageCell} from './Grid';
import {useMemoryStore} from '../MemoryStore';
import {useContentStore} from '../../content/ContentStore';

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
  const [loading, setLoading] = useState<ButtonLoading>(noLoading);
  const [error, setError] = useState<string>('');
  const [modal, setModal] = useState<ModalData>({
    content,
    isVisible: false,
  });

  useEffect(() => setModal({content, isVisible: content != null}), [content]);
  const memoryStore = useMemoryStore();
  const contentStore = useContentStore();

  const closeModal = () => {
    setModal({...modal, isVisible: false});
    setLoading(noLoading);
  };

  const dispatchAfterClosed = (action: () => void) => {
    setModal({
      ...modal,
      isVisible: false,
      afterCloseFn: action,
    });
  };

  const updateDisplayPicture = (contentId: string) => {
    setLoading({...loading, setDisplayPicture: true});
    setMemoryDisplayPicture(memory.mid, contentId)
      .then((updatedMemory: Memory) =>
        dispatchAfterClosed(() => memoryStore.update(updatedMemory)),
      )
      .catch((e: ErrorResponse) => setError(e.reason))
      .finally(() => setLoading(noLoading));
  };

  const deleteContentThenUpdate = (contentId: string) => {
    setLoading({...loading, deleteContent: true});
    deleteContent(memory.mid, contentId)
      .then(() =>
        dispatchAfterClosed(() => contentStore.delete(memory.mid, contentId)),
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
      }}>
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
  onUpdateDisplayPicture: (contentId: string) => void;
  onDelete: (contentId: string) => void;
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
        accessibilityLabel="Resulting error from your action.">
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
