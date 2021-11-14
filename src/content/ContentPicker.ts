import ImagePicker, {Image, Options} from 'react-native-image-crop-picker';
import uuidv4 from 'uuidv4';

export type PickedContent = Image & {
  contentId: string;
};

export class ContentPicker {
  static open = (
    onClose: () => void,
    onPickedContent: (content: PickedContent[]) => void,
  ) => {
    const options: Options = {
      multiple: true,
      compressImageMaxWidth: 2400,
      compressImageMaxHeight: 2400,
    };

    ImagePicker.openPicker(options)
      .then((value: Image | Image[]) => {
        const images = Array.isArray(value) ? value : [value];
        const content = images.map(image => ({
          ...image,
          contentId: uuidv4(),
        }));
        onPickedContent(content);
      })
      .catch(e => {
        console.log('Failed to select media.', e);
        onClose();
      });
  };
}
