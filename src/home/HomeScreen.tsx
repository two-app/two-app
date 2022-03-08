import {Timeline} from './Timeline';
import {Container} from '../views/View';

export const HomeScreen = () => {
  console.log('Hello, Home Screen');
  return (
    <>
      <Container footer="HomeScreen">
        <Timeline />
      </Container>
    </>
  );
};
