import {connect} from 'react-redux';

import {NoWrapContainer, Wrapper} from '../views/View';

import {Timeline} from './Timeline';
import {Footer} from './Footer';

const HomeScreen = () => (
  <Wrapper>
    <NoWrapContainer>
      <Timeline />
    </NoWrapContainer>
    <Footer active="HomeScreen" />
  </Wrapper>
);

const mapStateToProps = (state: any) => ({user: state.user});

export default connect(mapStateToProps)(HomeScreen);
export {HomeScreen};
