import {IconProps} from 'react-native-vector-icons/Icon';
import IonIcon from 'react-native-vector-icons/Ionicons';

type IP = Omit<IconProps, 'name'>;

export const LocationIcon = (p: IP) =>
  reducedIcon('navigate-circle-outline', p);
export const DateIcon = (p: IP) => reducedIcon('calendar-outline', p);
export const ImageIcon = (p: IP) => reducedIcon('image-outline', p);
export const VideoIcon = (p: IP) => reducedIcon('aperture-outline', p);
export const PeopleIcon = (p: IP) => reducedIcon('people-outline', p);
export const MemoryIcon = (p: IP) => reducedIcon('heart-outline', p);
export const TagsIcon = (p: IP) =>
  reducedIcon('pricetags-outline', {
    ...p,
    style: [{marginRight: 5, transform: [{rotateY: '180deg'}]}, p.style],
  });

const reducedIcon = (name: string, props: IP) => {
  return <IonIcon name={name} {...props} />;
};
