import { createGlobalStyle } from 'styled-components';
import sfBackground from './images/foodtrucks.jpg';

const GlobalStyle = createGlobalStyle`
  body {
    background: url(${sfBackground}) no-repeat center center fixed;
    background-size: cover;
    color: ${({ theme }) => theme.colors.text};
    font-family: ${({ theme }) => theme.fonts.main};
    margin: 0;
    padding: 0;
    min-height: 100vh;
  }

  a {
    color: ${({ theme }) => theme.colors.accent};
    text-decoration: none;

    &:hover {
      color: ${({ theme }) => theme.colors.highlight};
    }
  }

  input {
    background-color: ${({ theme }) => theme.colors.secondary};
    color: ${({ theme }) => theme.colors.text};
    border: 1px solid ${({ theme }) => theme.colors.border};
    padding: 8px;
    border-radius: 4px;

    &:focus {
      border-color: ${({ theme }) => theme.colors.primary};
    }
  }

  button {
    background-color: ${({ theme }) => theme.colors.primary};
    color: ${({ theme }) => theme.colors.accent};
    border: none;
    padding: 10px 20px;
    border-radius: 4px;
    cursor: pointer;

    &:hover {
      background-color: ${({ theme }) => theme.colors.highlight};
    }
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: ${({ theme }) => theme.fonts.accent};
  }
`;

export default GlobalStyle;
