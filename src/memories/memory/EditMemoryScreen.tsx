import {useRef, useState} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';
import {useDispatch, useSelector} from 'react-redux';
import IonIcon from 'react-native-vector-icons/Ionicons';

import {Memory} from '../MemoryModels';
import {ScrollContainer} from '../../views/View';
import {Heading} from '../../home/Heading';
import {PrimaryButton} from '../../forms/SubmitButton';
import {DateInputModal, DateInputModalHandle} from '../new_memory/DateInput';
import {SelectTag} from '../../tags/SelectTag';
import {updateMemory as updateMemoryRequest} from '../MemoryService';
import {ErrorResponse} from '../../http/Response';
import {TwoState} from '../../state/reducers';
import {selectMemory, updateMemory} from '../store';
import {Screen} from '../../navigation/NavigationUtilities';
import F, {useForm} from '../../forms/Form';
import {Input, NonEditableInput} from '../../forms/Input';
import moment from 'moment';

type EditMemoryForm = {
  title: string;
  location: string;
  occurredAt: Date;
  tid?: string;
};

export const EditMemoryScreen = ({
  navigation,
  route,
}: Screen<'EditMemoryScreen'>) => {
  const memory: Memory = useSelector<TwoState, Memory>(state =>
    selectMemory(state.memories, route.params.mid),
  );

  const [form, data, , updForm] = useForm<EditMemoryForm>({
    title: [memory.title, true],
    location: [memory.location, true],
    occurredAt: [memory.occurredAt, true],
    tid: [memory.tag?.tid, true],
  });

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Date selection, e.g Februrary 23, 2022, 6:37 PM
  const datePicker = useRef<DateInputModalHandle>();
  const [_date] = form.occurredAt;
  const date = _date == null ? undefined : moment(_date).format('LLL');

  const dispatch = useDispatch();

  const submitEdit = () => {
    setSubmitted(true);

    updateMemoryRequest({...data, mid: memory.mid})
      .then((updatedMemory: Memory) => {
        dispatch(updateMemory({mid: memory.mid, memory: updatedMemory}));
        navigation.goBack();
      })
      .catch((e: ErrorResponse) => {
        setError(e.reason);
        setSubmitted(false);
      });
  };

  return (
    <ScrollContainer>
      <Heading>Edit Memory</Heading>

      <Input
        placeholder="Title of your new memory"
        initialValue={data.title}
        isValid={title => title.length > 0}
        onEmit={title => updForm({title})}
        blurOnSubmit={false}
        autoCapitalize="words"
        accessibilityLabel="Enter Memory Title"
        icon={{provider: IonIcon, name: 'brush-outline'}}
        containerStyle={{marginTop: 20}}
      />

      <Input
        placeholder="Where it took place"
        initialValue={data.location}
        isValid={location => location.length > 0}
        onEmit={location => updForm({location})}
        blurOnSubmit={true}
        autoCapitalize="words"
        accessibilityLabel="Enter Memory Location"
        icon={{provider: IonIcon, name: 'location-outline'}}
        containerStyle={{marginTop: 20}}
      />

      <TouchableOpacity
        onPress={() => datePicker.current?.openDatePicker()}
        style={{marginTop: 20}}>
        <NonEditableInput
          placeholder="When it took place"
          icon={{provider: IonIcon, name: 'calendar-outline'}}
          value={date}
          isValid={() => true}
        />
      </TouchableOpacity>

      <DateInputModal
        initialValue={new Date()}
        maximumDate={new Date()}
        onSelected={date => updForm({occurredAt: [date, true]})}
        // @ts-ignore
        ref={datePicker}
      />

      <SelectTag
        style={{marginTop: 20}}
        onTagChange={t => updForm({tid: [t?.tid, true]})}
        initialValue={memory.tag}
      />

      <PrimaryButton
        accessibilityLabel="Update Memory"
        onPress={submitEdit}
        disabled={F.isInvalid(form)}
        loading={submitted}
        style={{marginTop: 20}}>
        Update Memory
      </PrimaryButton>

      <Text
        style={{color: Colors.DARK_SALMON}}
        accessibilityHint="The error encountered with the edit.">
        {error}
      </Text>
    </ScrollContainer>
  );
};
