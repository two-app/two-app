import {Memory} from './MemoryModels';

export const getMemories = (): Promise<Memory[]> => Promise.resolve([
    {
        id: 1,
        title: 'Burger Date Night',
        date: 'Today',
        location: 'Brighton, UK',
        tag: {
            name: 'Anniversary',
            color: 'red'
        },
        pictureCount: 8,
        videoCount: 2,
        content: [{
            type: 'image',
            url: 'https://images.pexels.com/photos/1639557/pexels-photo-1639557.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        }]
    },
    {
        id: 2,
        title: 'Hiking Holiday Day 4',
        date: '01/11/2019',
        location: 'Santiago de Compostela, Spain',
        pictureCount: 22,
        videoCount: 3,
        content: [{
            type: 'image',
            url: 'https://images.pexels.com/photos/361104/pexels-photo-361104.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        }]
    },
    {
        id: 3,
        title: 'Laurens Birthday',
        date: '14/02/2018',
        location: 'London, UK',
        pictureCount: 39,
        videoCount: 5,
        content: [{
            type: 'image',
            url: 'https://images.pexels.com/photos/989711/pexels-photo-989711.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        }]
    },
    {
        id: 4,
        title: 'Hiking Holiday Day 3',
        date: '01/11/2019',
        location: 'Santiago de Compostela, Spain',
        pictureCount: 3,
        videoCount: 0,
        content: [{
            type: 'image',
            url: 'https://images.pexels.com/photos/1576937/pexels-photo-1576937.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        }]
    },
    {
        id: 5,
        title: 'Hiking Holiday Day 2',
        date: '01/11/2019',
        location: 'Santiago de Compostela, Spain',
        pictureCount: 12,
        videoCount: 7,
        content: [{
            type: 'image',
            url: 'https://images.pexels.com/photos/701016/pexels-photo-701016.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        }]
    },
    {
        id: 6,
        title: 'Hiking Holiday Day 1',
        date: '01/11/2019',
        location: 'Santiago de Compostela, Spain',
        pictureCount: 0,
        videoCount: 1,
        content: [{
            type: 'image',
            url: 'https://images.pexels.com/photos/1047966/pexels-photo-1047966.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260'
        }]
    },
]);