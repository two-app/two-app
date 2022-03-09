import {ActivityIndicator, Text, View} from 'react-native';
import Modal from 'react-native-modal';
import Colors from '../Colors';
import {useUploadStore} from './UploadStore';

type ContentUploadModalProps = {
  mid: string;
};

export const ContentUploadModal = ({mid}: ContentUploadModalProps) => {
  const uploadStore = useUploadStore();

  if (uploadStore.uploads == null || uploadStore.uploads.mid !== mid) {
    return null;
  }

  const inProgress = uploadStore.uploads.inProgress;
  const contentIds = Object.keys(inProgress);
  const total = contentIds.length;
  const complete = contentIds.reduce(
    (acc, id) => (inProgress[id].finished ? acc + 1 : acc),
    0,
  );

  console.log(uploadStore);
  console.log(uploadStore.uploads);

  return (
    <Modal
      isVisible={true}
      animationIn="slideInUp"
      style={{
        justifyContent: 'flex-end',
        margin: 0,
      }}>
      <View
        style={{
          backgroundColor: 'white',
          paddingVertical: 22,
          paddingHorizontal: 30,
          justifyContent: 'center',
          borderRadius: 4,
          borderColor: 'rgba(0, 0, 0, 0.1)',
        }}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text
            style={{
              color: Colors.VERY_DARK,
              fontSize: 15,
              fontFamily: 'Montserrat-Medium',
            }}>
            In Progress Upload
          </Text>

          <ActivityIndicator size="small" color="black" />
        </View>

        <Text
          style={{
            color: Colors.REGULAR,
            fontSize: 13,
            paddingTop: 5,
          }}>
          {complete}/{total} Complete
        </Text>
      </View>
    </Modal>
  );
};
