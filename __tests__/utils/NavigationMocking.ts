export type MockNavigation = {
  navigate: jest.Mock;
  dispatch: jest.Mock;
};

export type MockRoute = {
  params: Record<string, any>;
};

export const mockRoute: MockRoute = {
  params: {},
};

export const mockNavigation: MockNavigation = {
  navigate: jest.fn().mockName('navigation function'),
  dispatch: jest.fn().mockName('dispatch function'),
};

export const resetMockNavigation = () => {
  mockNavigation.navigate.mockReset().mockName('navigation function');
  mockNavigation.dispatch.mockReset().mockName('dispatch function');
};

export const setupMockNavigation = () => {
  jest.mock('@react-navigation/native', () => {
    return {
      ...(jest.requireActual('@react-navigation/native') as any),
      useNavigation: () => ({
        navigate: mockNavigation.navigate,
        dispatch: mockNavigation.dispatch,
      }),
      useRoute: () => ({...mockRoute}),
    };
  });
};
