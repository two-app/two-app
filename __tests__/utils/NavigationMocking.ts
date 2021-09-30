export type MockNavigation = {
  navigate: jest.Mock;
  dispatch: jest.Mock;
  reset: jest.Mock;
};

export type MockRoute = {
  params: Record<string, any>;
};

export const mockRoute: MockRoute = {
  params: {},
};

export const mockNavigation: MockNavigation = {
  navigate: jest.fn().mockName("navigation function"),
  dispatch: jest.fn().mockName("dispatch function"),
  reset: jest.fn().mockName("reset function"),
};

export const resetMockNavigation = () => {
  mockNavigation.navigate.mockReset().mockName("navigation function");
  mockNavigation.dispatch.mockReset().mockName("dispatch function");
  mockNavigation.reset.mockReset().mockName("reset function");
};

export const setupMockNavigation = () => {
  jest.mock("@react-navigation/native", () => {
    return {
      ...(jest.requireActual("@react-navigation/native") as any),
      useNavigation: () => ({ ...mockNavigation }),
      useRoute: () => ({ ...mockRoute }),
    };
  });
};
