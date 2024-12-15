const reducer = (state, action) => {
  const { type, value, field } = action;

  if (field === 'file') {
    switch (type) {
      case 'file:preview': {
        return {
          ...state,
          [field]: {
            ...state[field],
            [type]: value,
          },
        };
      }

      case 'file:download': {
        return {
          ...state,
          [field]: {
            ...state[field],
            [type]: value,
          },
        };
      }

      default:
        throw new Error('Invalid type');
    }
  }

  throw new Error(`invalid field of ${field}`);
};

const reducerState = {
  file: {
    'file:share': {
      id: null,
      on: false,
    },
    'file:preview': {
      id: null,
      on: false,
    },
    'file:download': {
      id: null,
      on: false,
    },
    'file:delete': {
      id: null,
      on: false,
    },
  },
};

export { reducer, reducerState };
