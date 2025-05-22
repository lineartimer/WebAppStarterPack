// This file is automatically run when tests are run
import '@testing-library/jest-dom';

// This is needed otherwise TextEncoder won't be found by react-router
import { TextEncoder, TextDecoder } from 'util';

global.TextEncoder = TextEncoder;
global.TextDecoder = TextDecoder;
