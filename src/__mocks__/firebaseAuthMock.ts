// __mocks__/firebaseAuthMock.ts
export const getAuth = jest.fn(() => ({
    currentUser: null,
  }));
  export const signInWithEmailAndPassword = jest.fn();
  export const sendPasswordResetEmail = jest.fn();
  