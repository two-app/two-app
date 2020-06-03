import {StackNavigationProp} from '@react-navigation/stack';
import React from 'react';
import {connect} from 'react-redux';
import {RootStackParamList} from '../../Router';
import {User} from '../authentication/UserModel';
import {Memories} from '../memories/Memories';
import {NoWrapContainer, Wrapper} from '../views/View';
import {Footer} from './Footer';

type HomeScreenProps = {
  navigation: StackNavigationProp<RootStackParamList, 'HomeScreen'>;
  user: User;
};

const HomeScreen = ({navigation, user}: HomeScreenProps) => (
  <Wrapper>
    <NoWrapContainer>
      <Memories />
    </NoWrapContainer>
    <Footer active="HomeScreen" />
  </Wrapper>
);

const mapStateToProps = (state: any) => ({user: state['user']});

export default connect(mapStateToProps)(HomeScreen);
export {HomeScreen};
