import ACTION_STRING from "../actions/actionStrings";

const initialState = {
  isError: false,
  isLoading: false,
  isFulfilled: false,
  error: null,
  token: null,
  profile: {
    id: '',
    role: '',
    full_name: '',
    phone_number: '',
    email: '',
    image: 'https://www.certificate.digital/images/theme/resize/cropping.webp',
    gender: '',
    location: '',
    address: '',
    no_rekening: '',
    image_identity: '',
    no_identity: '',
    bank_name: '',
  },
};

const authReducer = (prevState = initialState, { type, payload }) => {
  const { login, profile, pending, reset, ktp, rejected, fulfilled } = ACTION_STRING;

  switch (type) {
    case login + pending:
      return {
        ...prevState,
        isLoading: true,
        isFulfilled: false,
        isError: false,
        error: null,
      };

    case login + rejected:
      return {
        ...prevState,
        isLoading: false,
        isError: true,
        isFulfilled: false,
        error: payload,
      };

    case login + fulfilled:
      return {
        ...prevState,
        isLoading: false,
        isError: false,
        isFulfilled: true,
        token: payload,
        error: null,
      };

    case profile + pending:
      return {
        ...prevState,
        isLoading: true,
        isError: false,
        isFulfilled: false,
        error: null,
      };
    case profile + rejected:
      return {
        ...prevState,
        isLoading: false,
        isError: true,
        isFulfilled: false,
        // error: payload.error.response.data.msg,
      };
    case profile + fulfilled:
      return {
        ...prevState,
        isError: false,
        isFulfilled: true,
        isLoading: false,
        error: null,
        profile: {
          id: payload.id,
          role: payload.role,
          full_name: payload.full_name,
          phone_number: payload.phone_number,
          email: payload.email,
          image: payload.image || 'https://www.certificate.digital/images/theme/resize/cropping.webp',
          gender: payload.gender,
          location: payload.location,
          address: payload.address,
          no_rekening: payload.no_rekening,
          image_identity: payload.image_identity || 'https://www.certificate.digital/images/theme/resize/cropping.webp',
          no_identity: payload.no_identity,
          bank_name: payload.bank_name,
        },
      };

      case ktp + pending:
      return {
        ...prevState,
        isLoading: true,
        isError: false,
        isFulfilled: false,
        error: null,
      };
    case ktp + rejected:
      return {
        ...prevState,
        isLoading: false,
        isError: true,
        isFulfilled: false,
        // error: payload.error.response.data.msg,
      };
    case ktp + fulfilled:
      return {
        ...prevState,
        isError: false,
        isFulfilled: true,
        isLoading: false,
        error: null,
        profile: {
          ...prevState.profile,
          image_identity: payload || 'https://www.certificate.digital/images/theme/resize/cropping.webp',
        },
      };
      
      case reset :
        return initialState
        
    default:
      return initialState;
  }
};

export default authReducer;
