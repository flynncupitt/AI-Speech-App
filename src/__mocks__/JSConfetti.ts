jest.mock('https://cdn.jsdelivr.net/npm/js-confetti@latest/dist/js-confetti.browser.js', () => {
    return jest.fn().mockImplementation(() => {
      return {
        addConfetti: jest.fn(),
      };
    });
  });
  