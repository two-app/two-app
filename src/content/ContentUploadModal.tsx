import {useEffect} from 'react';
import {
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Modal from 'react-native-modal';
import IonIcon from 'react-native-vector-icons/Ionicons';
import Colors from '../Colors';
import {InProgressUpload, useUploadStore} from './UploadStore';

type ContentUploadModalProps = {
  mid: string;
};

/**
 * The ContentUploadModal is a simple modal display that previews the
 * data in the UploadStore. It does not perform any HTTP requests itself.
 * @see ContentPicker for the upload logic.
 */
export const ContentUploadModal = ({mid}: ContentUploadModalProps) => {
  const uploadStore = useUploadStore();
  const isVisible = uploadStore.uploads?.mid === mid;

  useEffect(() => {
    uploadStore.setUploads('', {});
  }, []);

  return (
    <Modal
      isVisible={isVisible}
      style={s.modal}
      animationIn="slideInUp"
      animationOut="slideOutDown">
      {isVisible && <_ContentUploadModal />}
    </Modal>
  );
};

type CancelMode = 'Cancel' | 'Close';

const _ContentUploadModal = () => {
  const uploadStore = useUploadStore();

  const inProgress = uploadStore.uploads!.inProgress;
  const total = Object.keys(inProgress).length;

  const {processing, uploading, succeeded, failed} =
    uploadStore.groupByStatus();
  const complete = succeeded.length + failed.length === total;
  const cancelMode: CancelMode = failed.length > 0 ? 'Close' : 'Cancel';

  useEffect(() => {
    if (succeeded.length === total) uploadStore.clear();
  }, [complete]);

  const onCancel = () => {
    if (cancelMode === 'Cancel') {
      uploading.forEach(u => u.controller?.abort());
    }

    uploadStore.clear();
  };

  return (
    <View style={s.modalContainer}>
      {/* title & loading spinner while uploads are in flight */}
      <View style={s.spacedRow}>
        <Text style={s.title}>In Progress Upload</Text>
        {complete || <ActivityIndicator size="small" color="black" />}
      </View>

      {processing.length > 0 && (
        <InProgressDisplay inProgress={processing}>
          Processing
        </InProgressDisplay>
      )}

      {uploading.length > 0 && (
        <InProgressDisplay inProgress={uploading}>Uploading</InProgressDisplay>
      )}

      {succeeded.length > 0 && (
        <InProgressDisplay inProgress={succeeded}>Completed</InProgressDisplay>
      )}

      {failed.length > 0 && (
        <InProgressDisplay inProgress={failed}>Failed</InProgressDisplay>
      )}

      {/* num completed/failed progress indicator */}
      <View
        style={{
          flexDirection: 'row',
          marginVertical: 5,
          justifyContent: 'center',
        }}>
        <Text style={{color: Colors.REGULAR, fontSize: 13}}>
          {succeeded.length}/{total} Uploaded
        </Text>
        {failed.length > 0 && (
          <Text
            style={{color: Colors.DARK_SALMON, fontSize: 13, marginLeft: 10}}>
            {failed.length}/{total} Failed
          </Text>
        )}
      </View>

      <TouchableOpacity style={s.close} onPress={onCancel}>
        <Text style={{color: Colors.REGULAR}}>{cancelMode}</Text>
      </TouchableOpacity>
    </View>
  );
};

const InProgressDisplay = ({
  inProgress,
  children,
}: {
  inProgress: InProgressUpload[];
  children: string;
}) => {
  return (
    <View>
      <Text style={{fontWeight: '500', marginTop: 10}}>{children}</Text>
      <FlatList
        data={inProgress}
        horizontal={true}
        renderItem={({item}) => (
          <ImageBackground
            source={{uri: item.fileURI, cache: 'only-if-cached'}}
            onError={e => console.error(e.nativeEvent.error)}>
            <View style={s.image}>
              {item.status === 'failed' && (
                <IonIcon name="close-outline" color="white" size={40} />
              )}
            </View>
          </ImageBackground>
        )}
        ItemSeparatorComponent={Separator}
        style={{marginVertical: 10}}
      />
    </View>
  );
};

const s = StyleSheet.create({
  modal: {
    justifyContent: 'flex-end',
    margin: 0,
  },
  modalContainer: {
    backgroundColor: 'white',
    paddingVertical: 22,
    paddingHorizontal: 30,
    justifyContent: 'center',
    borderRadius: 5,
    borderColor: 'rgba(0, 0, 0, 0.1)',
  },
  spacedRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  title: {
    color: Colors.VERY_DARK,
    fontSize: 15,
    fontFamily: 'Montserrat-Medium',
  },
  image: {
    width: 60,
    height: 60,
    alignItems: 'center',
    justifyContent: 'center',
  },
  close: {
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 5,
    padding: 15,
    alignItems: 'center',
    marginVertical: 10,
  },
});

const Separator = () => <View style={{width: 10, height: 60}} />;
