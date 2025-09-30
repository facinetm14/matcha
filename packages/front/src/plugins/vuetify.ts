/**
 * plugins/vuetify.ts
 *
 * Framework documentation: https://vuetifyjs.com`
 */

// Composables
import { createVuetify } from 'vuetify'
// Styles
import '@mdi/font/css/materialdesignicons.css'

import 'vuetify/styles'

const myCustomLightTheme = {
  dark: false,
  colors: {
    background: '#c9cec5ff',
    surface: '#dbe1d7ff',
    'surface-bright': '#FFFFFF',
    //'surface-light': '#cbd7c4ff',
    'surface-light': '#d6dfd0ff',
    'surface-variant': '#424242',
    'on-surface-variant': '#EEEEEE',
    primary: '#B98389',
    'primary-darken-1': '#DB2955',
    secondary: '#48A9A6',
    'secondary-darken-1': '#018786',
    error: '#DB2955',
    info: '#B98389',
    success: '#B98389',
    warning: '#DB2955',
  },
  variables: {
    'border-color': '#000000',
    'border-opacity': 0.12,
    'high-emphasis-opacity': 0.87,
    'medium-emphasis-opacity': 0.60,
    'disabled-opacity': 0.38,
    'idle-opacity': 0.04,
    'hover-opacity': 0.04,
    'focus-opacity': 0.12,
    'selected-opacity': 0.08,
    'activated-opacity': 0.12,
    'pressed-opacity': 0.12,
    'dragged-opacity': 0.08,
    'theme-kbd': '#212529',
    'theme-on-kbd': '#FFFFFF',
    'theme-code': '#F5F5F5',
    'theme-on-code': '#000000',
  }
}

export default createVuetify({
  theme: {
    defaultTheme: 'myCustomLightTheme',
    themes: {
      myCustomLightTheme,
    },
  },
})
