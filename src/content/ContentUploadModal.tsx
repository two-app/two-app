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
import {useUploadStore} from './UploadStore';

type ContentUploadModalProps = {
  mid: string;
};

export const ContentUploadModal = ({mid}: ContentUploadModalProps) => {
  const uploadStore = useUploadStore();
  const isVisible = uploadStore.uploads?.mid === mid;

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
  const uploads = Object.keys(inProgress).map(id => inProgress[id]);

  const total = uploads.length;
  const complete: boolean = uploads.every(u => u.finished);
  const succeeded = uploads.reduce(
    (acc, u) => (u.finished && u.succeeded ? acc + 1 : acc),
    0,
  );
  const failed = uploads.reduce(
    (acc, u) => (u.finished && !u.succeeded ? acc + 1 : acc),
    0,
  );

  const cancelMode: CancelMode = failed > 0 ? 'Close' : 'Cancel';

  useEffect(() => {
    if (complete && succeeded === total) {
      // Upload succeeded, clear the upload queue
      uploadStore.clear();
    }
  }, [complete]);

  const onCancel = () => {
    if (cancelMode === 'Cancel') {
      // iterate over the unfinished uploads & cancel them
      uploads.filter(u => !u.finished).forEach(u => u.controller.abort());
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

      {/* num completed/failed progress indicator */}
      <View style={{flexDirection: 'row', marginTop: 5}}>
        <Text style={{color: Colors.REGULAR, fontSize: 13}}>
          {succeeded}/{total} Complete
        </Text>
        {failed > 0 && (
          <Text
            style={{color: Colors.DARK_SALMON, fontSize: 13, marginLeft: 10}}>
            {failed}/{total} Failed
          </Text>
        )}
      </View>

      {/* in progress upload thumbnails & close/cancel button */}
      <View style={[s.spacedRow, {alignItems: 'center'}]}>
        <FlatList
          data={uploads}
          horizontal={true}
          renderItem={({item}) => (
            <ImageBackground
              source={{uri: item.fileURI, cache: 'only-if-cached'}}
              style={{backgroundColor: item.finished ? 'black' : 'white'}}
              imageStyle={{
                opacity: item.finished && item.succeeded ? 1 : 0.7,
              }}>
              <View style={s.image}>
                {item.finished && !item.succeeded && (
                  <IonIcon name="close-outline" color="white" size={40} />
                )}
              </View>
            </ImageBackground>
          )}
          ItemSeparatorComponent={Separator}
          style={{marginVertical: 20}}
        />

        <TouchableOpacity style={s.close} onPress={onCancel}>
          <Text style={{color: Colors.REGULAR}}>{cancelMode}</Text>
        </TouchableOpacity>
      </View>
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
    padding: 10,
    borderRadius: 5,
    marginLeft: 10,
  },
});

const Separator = () => <View style={{width: 10, height: 60}} />;
