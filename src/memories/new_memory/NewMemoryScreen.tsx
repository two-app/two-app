import {useRef, useState} from 'react';
import {Input, NonEditableInput} from '../../forms/Input';
import {PrimaryButton} from '../../forms/SubmitButton';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {Text, TouchableOpacity} from 'react-native';
import {useDispatch} from 'react-redux';
import {v4 as uuid} from 'uuid';
import {Heading} from '../../home/Heading';
import type {ErrorResponse} from '../../http/Response';
import {SelectTag} from '../../tags/SelectTag';
import {ScrollContainer} from '../../views/View';
import {createMemory, getMemory} from '../MemoryService';
import type {Memory, MemoryMeta} from '../MemoryModels';
import {insertMemory} from '../store';

import Colors from '../../Colors';
import {Screen} from '../../navigation/NavigationUtilities';
import F, {Form} from '../../forms/Form';
import {DateInputModal, DateInputModalHandle} from './DateInput';
import moment from 'moment';

type MemoryForm = {
  title: string;
  location: string;
  occurredAt?: Date;
  tid?: string;
};

export const NewMemoryScreen = ({navigation}: Screen<'NewMemoryScreen'>) => {
  const [form, setForm] = useState<Form<MemoryForm>>({
    title: F.str,
    location: F.str,
    occurredAt: [undefined, true],
    tid: [undefined, true],
  });
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const dispatch = useDispatch();

  // Date selection, e.g Februrary 23, 2022, 6:37 PM
  const datePicker = useRef<DateInputModalHandle>();
  const [_date, _] = form.occurredAt;
  const date = _date == null ? undefined : moment(_date).format('LLL');

  const storeAndNavigate = (m: Memory): void => {
    dispatch(insertMemory(m));
    navigation.reset({
      index: 1,
      routes: [
        {name: 'HomeScreen'},
        {
          name: 'MemoryScreen',
          params: {mid: m.mid},
        },
      ],
    });
  };

  const createNewMemory = () => {
    setSubmitted(true);
    const onError = (e: ErrorResponse) => {
      setSubmitted(false);
      setError(e.reason);
    };

    const data = F.data(form);
    const meta: MemoryMeta = {
      ...data,
      occurredAt: data.occurredAt ?? new Date(),
      mid: uuid(),
    };

    createMemory(meta)
      .then(storeAndNavigate)
      .catch((e: ErrorResponse) => {
        if (e.status === 409) {
          // Memory already  exists, perform reset
          getMemory(meta.mid).then(storeAndNavigate).catch(onError);
        } else {
          onError(e);
        }
      });
  };

  return (
    <ScrollContainer keyboardShouldPersistTaps="handled">
      <Heading>New Memory</Heading>

      <Input
        placeholder="Title of your new memory"
        isValid={title => title.length > 0}
        onEmit={title => setForm({...form, title})}
        blurOnSubmit={false}
        autoCapitalize="words"
        accessibilityLabel="Enter Memory Title"
        icon={{provider: IonIcon, name: 'brush-outline'}}
        containerStyle={{marginTop: 20}}
      />

      <Input
        placeholder="Where it took place"
        isValid={location => location.length > 0}
        onEmit={location => setForm({...form, location})}
        blurOnSubmit={true}
        autoCapitalize="words"
        accessibilityLabel="Enter Memory Location"
        icon={{provider: IonIcon, name: 'location-outline'}}
        containerStyle={{marginTop: 20}}
      />

      <TouchableOpacity
        onPress={() => datePicker.current?.openDatePicker()}
        style={{marginTop: 20, zIndex: 999}}>
        <NonEditableInput
          editable={false}
          placeholder="When it took place"
          icon={{provider: IonIcon, name: 'calendar-outline'}}
          value={date}
        />
      </TouchableOpacity>

      <DateInputModal
        initialValue={new Date()}
        maximumDate={new Date()}
        onSelected={date => setForm({...form, occurredAt: [date, true]})}
        // @ts-ignore
        ref={datePicker}
      />

      <SelectTag
        style={{marginTop: 20}}
        onTagChange={t => setForm({...form, tid: [t?.tid, true]})}
      />

      <PrimaryButton
        accessibilityLabel="Create a new Memory"
        onPress={createNewMemory}
        loading={submitted}
        disabled={F.isInvalid(form)}
        style={{marginTop: 20}}>
        Create Memory
      </PrimaryButton>

      {error != '' && (
        <Text
          style={{color: Colors.DARK_SALMON}}
          accessibilityHint={error}
          accessibilityLabel="Something went wrong creating your memory.">
          {error}
        </Text>
      )}
    </ScrollContainer>
  );
};
