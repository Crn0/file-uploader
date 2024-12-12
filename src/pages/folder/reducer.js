const reducer = (state, action) => {
  const { type, value, field } = action;

  if (field === 'file') {
    switch (type) {
      case 'file:share': {
        return {
          ...state,
          [field]: {
            ...state[field],
            [type]: value,
          },
        };
      }

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

      case 'file:delete': {
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

  if (field === 'folder') {
    switch (type) {
      case 'folder:share': {
        return {
          ...state,
          [field]: {
            ...state[field],
            [type]: value,
          },
        };
      }

      case 'folder:delete': {
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
  folder: {
    'folder:share': {
      id: null,
      on: false,
    },
    'folder:delete': {
      id: null,
      on: false,
    },
  },
};

export { reducer, reducerState };
