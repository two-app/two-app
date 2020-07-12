import ImagePicker, {Image, Options} from 'react-native-image-crop-picker';

export type PickedContent = Image;

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
      .then((value: Image | Image[]) =>
        Array.isArray(value)
          ? onPickedContent(value)
          : onPickedContent([value]),
      )
      .catch((e) => {
        console.log('Failed to select media.', e)
        onClose();
      });
  };
}