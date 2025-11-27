# Dark Mode Implementation Guide

This guide explains the dark mode/light mode toggle feature implementation in the Social Media Feed application.

## Features

- **Automatic Theme Detection**: Detects system preference on first load
- **Manual Toggle**: Users can switch between light and dark themes
- **Persistent Preference**: Theme choice is saved in localStorage
- **Smooth Transitions**: CSS transitions for seamless theme switching
- **Comprehensive Coverage**: All components styled for both modes

## Architecture

### 1. Theme Context (`src/context/ThemeContext.jsx`)

The `ThemeContext` provides theme state management across the entire application:

```javascript
import { useTheme } from '../../context/ThemeContext';

const { theme, toggleTheme, isDark } = useTheme();
```

**Available methods:**
- `theme`: Current theme ('light' or 'dark')
- `setTheme(newTheme)`: Set specific theme
- `toggleTheme()`: Switch between themes
- `isDark`: Boolean indicating if dark mode is active

### 2. Theme Toggle Component (`src/components/Common/ThemeToggle.jsx`)

A reusable button component that displays:
- Moon icon when in light mode (clicking activates dark mode)
- Sun icon when in dark mode (clicking activates light mode)

Usage:
```jsx
import ThemeToggle from '../Common/ThemeToggle';

<ThemeToggle />
```

### 3. Tailwind Configuration

Dark mode is configured in `tailwind.config.js`:

```javascript
{
  darkMode: 'class', // Uses class-based dark mode
  // ...
}
```

## How It Works

### 1. Initialization

When the app loads:
1. Checks localStorage for saved preference
2. If no preference, checks system preference using `prefers-color-scheme`
3. Defaults to light mode if neither is available

### 2. Theme Application

The theme is applied by adding/removing the `dark` class on the `<html>` element:

```javascript
// Light mode: <html>
// Dark mode: <html class="dark">
```

### 3. Persistence

Theme preference is automatically saved to localStorage:

```javascript
localStorage.setItem('theme', 'dark'); // or 'light'
```

## Styling Components for Dark Mode

### Basic Pattern

Use Tailwind's `dark:` variant for dark mode styles:

```jsx
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
  Content
</div>
```

### Common Patterns

#### Background Colors
```jsx
// Main backgrounds
bg-white dark:bg-gray-900

// Card/Panel backgrounds
bg-white dark:bg-gray-800

// Subtle backgrounds
bg-gray-50 dark:bg-gray-800

// Hover backgrounds
hover:bg-gray-100 dark:hover:bg-gray-700
```

#### Text Colors
```jsx
// Primary text
text-gray-900 dark:text-gray-100

// Secondary text
text-gray-600 dark:text-gray-400

// Muted text
text-gray-500 dark:text-gray-500
```

#### Borders
```jsx
border-gray-200 dark:border-gray-700
border-gray-300 dark:border-gray-600
```

#### Buttons
```jsx
// Primary button (already styled in CSS)
className="btn-primary"

// Secondary button
bg-gray-200 dark:bg-gray-700
text-gray-700 dark:text-gray-200
hover:bg-gray-300 dark:hover:bg-gray-600
```

### Global Styles

Global dark mode styles are defined in `src/index.css`:

```css
@layer components {
  .card {
    @apply bg-white dark:bg-gray-800 rounded-lg shadow-sm
           border border-gray-200 dark:border-gray-700
           transition-colors;
  }

  .input-field {
    @apply w-full px-4 py-2
           border border-gray-300 dark:border-gray-600
           bg-white dark:bg-gray-700
           text-gray-900 dark:text-gray-100
           rounded-lg focus:outline-none
           focus:ring-2 focus:ring-primary
           focus:border-transparent transition-colors;
  }
}
```

## Updated Components

The following components have been updated with dark mode support:

### Layout Components
- [x] `App.jsx` - Main app wrapper with ThemeProvider
- [x] `Header.jsx` - Navigation header with theme toggle

### Common Components
- [x] `ThemeToggle.jsx` - Theme switcher button
- [x] `Input.jsx` - Form inputs
- [x] `ErrorMessage.jsx` - Error displays

### Feed Components
- [x] `PostCard.jsx` - Post display cards

### Auth Components
- [x] `Login.jsx` - Login page
- [x] `ForgotPassword.jsx` - Password reset request
- [x] `ResetPassword.jsx` - Password reset form

### Global Styles
- [x] `index.css` - Base styles and component classes
- [x] Scrollbar styles

## Adding Dark Mode to New Components

When creating new components, follow these steps:

### 1. Identify Color Elements

Look for elements with colors:
- Backgrounds
- Text
- Borders
- Shadows
- Icons

### 2. Apply Dark Variants

Add `dark:` variants for each color:

```jsx
// Before
<div className="bg-white text-gray-900 border-gray-200">

// After
<div className="bg-white dark:bg-gray-800
                text-gray-900 dark:text-gray-100
                border-gray-200 dark:border-gray-700">
```

### 3. Add Transitions

Include `transition-colors` for smooth theme switching:

```jsx
<div className="bg-white dark:bg-gray-800 transition-colors">
```

### 4. Test Both Themes

Always test your component in both light and dark modes:
- Check contrast ratios
- Verify readability
- Test hover states
- Test focus states

## Color Palette

### Light Mode
- Background: `bg-white`, `bg-gray-50`
- Text: `text-gray-900`, `text-gray-600`
- Borders: `border-gray-200`, `border-gray-300`
- Hover: `hover:bg-gray-100`

### Dark Mode
- Background: `dark:bg-gray-900`, `dark:bg-gray-800`
- Text: `dark:text-gray-100`, `dark:text-gray-400`
- Borders: `dark:border-gray-700`, `dark:border-gray-600`
- Hover: `dark:hover:bg-gray-700`

## Accessibility

The dark mode implementation follows accessibility best practices:

1. **Contrast Ratios**: All text meets WCAG AA standards
2. **Focus Indicators**: Visible in both themes
3. **System Preference**: Respects `prefers-color-scheme`
4. **Smooth Transitions**: No jarring color changes
5. **Icon Clarity**: Theme toggle icons are clear and semantic

## Troubleshooting

### Theme Not Persisting

If the theme resets on page reload:
1. Check browser localStorage support
2. Verify no extensions are clearing localStorage
3. Check for errors in console

### Styles Not Applying

If dark mode styles don't work:
1. Verify Tailwind config has `darkMode: 'class'`
2. Check that `ThemeProvider` wraps your app
3. Ensure `dark` class is on `<html>` element
4. Run `npm run dev` to rebuild Tailwind

### Flickering on Load

If you see a flash of wrong theme:
1. Theme preference is loaded from localStorage on mount
2. This is expected behavior and very brief
3. To minimize, ensure ThemeProvider is as high as possible in component tree

## Browser Support

Dark mode works in all modern browsers:
- Chrome/Edge 76+
- Firefox 67+
- Safari 12.1+
- All browsers with CSS custom properties support

## Performance

The dark mode implementation is optimized for performance:
- Uses CSS class switching (no inline styles)
- Leverages Tailwind's built-in dark mode
- Minimal JavaScript overhead
- No external dependencies

## Future Enhancements

Potential improvements:
- [ ] Multiple theme options (e.g., high contrast)
- [ ] Automatic theme switching based on time of day
- [ ] Per-component theme customization
- [ ] Theme preview before applying
- [ ] Custom color schemes

## Resources

- [Tailwind Dark Mode Docs](https://tailwindcss.com/docs/dark-mode)
- [MDN prefers-color-scheme](https://developer.mozilla.org/en-US/docs/Web/CSS/@media/prefers-color-scheme)
- [WCAG Contrast Guidelines](https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html)
