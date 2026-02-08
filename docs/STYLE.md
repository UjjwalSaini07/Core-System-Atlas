# Code Style Guide

## Table of Contents
1. [General Rules](#general-rules)
2. [JavaScript Style](#javascript-style)
3. [React/JSX Style](#reactjsx-style)
4. [CSS/Styling](#cssstyling)
5. [File Organization](#file-organization)
6. [Naming Conventions](#naming-conventions)


## General Rules

### Golden Rules

1. **Readability over cleverness**
   ```javascript
   // Good - clear intent
   const isAdult = age >= 18;
   
   // Avoid - overly clever
   const isAdult = !(age < 18);
   ```

2. **DRY (Don't Repeat Yourself)**
   ```javascript
   // Good
   function formatCurrency(amount) {
     return new Intl.NumberFormat('en-US', {
       style: 'currency',
       currency: 'USD'
     }).format(amount);
   }
   
   // Avoid - repeated code
   const price1 = '$' + price1.toFixed(2);
   const price2 = '$' + price2.toFixed(2);
   ```

3. **Single Responsibility**
   ```javascript
   // Good - one function does one thing
   function validateEmail(email) {
     return email.includes('@');
   }
   
   // Bad - multiple responsibilities
   function validateAndSaveEmail(email) {
     if (!email.includes('@')) return false;
     return saveToDatabase(email);
   }
   ```

4. **Avoid Magic Numbers**
   ```javascript
   // Good
   const MAX_RETRY_COUNT = 3;
   const DEFAULT_TIMEOUT = 5000;
   
   // Avoid
   if (retries > 3) { ... }
   setTimeout(..., 5000);
   ```


## JavaScript Style

### Variables

```javascript
// Use const by default
const name = 'John';
const items = ['a', 'b', 'c'];

// Use let when reassignment is needed
let count = 0;
count += 1;

// Avoid var
```

### Functions

```javascript
// Arrow functions for short functions
const add = (a, b) => a + b;

// Traditional functions for methods
class Calculator {
  add(a, b) {
    return a + b;
  }
}

// Named exports for utilities
export function formatDate(date) {
  return date.toISOString();
}

// Default parameters
function greet(name = 'Guest') {
  return `Hello, ${name}!`;
}

// Rest parameters
function sum(...numbers) {
  return numbers.reduce((a, b) => a + b, 0);
}
```

### Objects

```javascript
// Shorthand for properties
const name = 'John';
const user = { name };  // { name: 'John' }

// Method shorthand
const obj = {
  greet() {
    return 'Hello';
  }
};

// Spread operator
const a = { x: 1, y: 2 };
const b = { ...a, z: 3 };  // { x: 1, y: 2, z: 3 }

// Destructuring
const { firstName, lastName } = user;
const [first, second] = array;
```

### Arrays

```javascript
// Array methods over loops
const numbers = [1, 2, 3, 4, 5];

// map
const doubled = numbers.map(n => n * 2);

// filter
const evens = numbers.filter(n => n % 2 === 0);

// reduce
const sum = numbers.reduce((acc, n) => acc + n, 0);

// find
const found = numbers.find(n => n > 2);

// Avoid for loops when possible
```

### Strings

```javascript
// Template literals over concatenation
const message = `Hello, ${name}!`;

// Multi-line strings
const html = `
  <div>
    <p>${message}</p>
  </div>
`;

// Avoid
const msg = 'Hello, ' + name + '!';
```

### Equality

```javascript
// Use === for comparison
if (value === 'test') { ... }

// Use !== for inequality
if (value !== null) { ... }

// Avoid ==
if (value == '5') { ... }  // Unexpected coercion
```

### Async/Await

```javascript
// Good
async function fetchData() {
  try {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Failed:', error);
    throw error;
  }
}

// Avoid callback hell
fetchData(url, (err, data) => {
  if (err) { ... }
});
```

## React/JSX Style

### Components

```jsx
// Small, focused components
function UserAvatar({ src, alt, size = 40 }) {
  return (
    <img
      src={src}
      alt={alt}
      className={`avatar avatar-${size}`}
    />
  );
}

// Props validation
UserAvatar.propTypes = {
  src: PropTypes.string.isRequired,
  alt: PropTypes.string,
  size: PropTypes.number
};

// Default props
UserAvatar.defaultProps = {
  alt: 'User avatar',
  size: 40
};
```

### Hooks

```jsx
// Custom hooks for reusable logic
function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });
  
  const setStoredValue = (newValue) => {
    try {
      setValue(newValue);
      window.localStorage.setItem(key, JSON.stringify(newValue));
    } catch (error) {
      console.error(error);
    }
  };
  
  return [value, setStoredValue];
}

// Use hooks at top level
function MyComponent() {
  const [count, setCount] = useState(0);
  
  // Effect with cleanup
  useEffect(() => {
    const handler = () => { ... };
    window.addEventListener('resize', handler);
    return () => window.removeEventListener('resize', handler);
  }, []);
  
  return <button onClick={() => setCount(c => c + 1)}>{count}</button>;
}
```

### Conditionals

```jsx
// Ternary for simple conditions
<div>{isLoggedIn ? <UserMenu /> : <LoginButton />}</div>

// && for rendering on truthy
{showMessage && <Alert message={message} />}

// Early return for conditional components
function AdminPanel({ user }) {
  if (!user.isAdmin) {
    return null;
  }
  
  return <div>Admin Content</div>;
}

// Avoid
{isLoading ? <Loading /> : null}
```

### Lists

```jsx
// Map over arrays
{items.map(item => (
  <ListItem key={item.id} {...item} />
))}

// Avoid index as key if order changes
{items.map((item, index) => (
  <ListItem key={item.id} {...item} />  // Good
))}
```

### Events

```jsx
// Arrow function for inline handlers
<button onClick={() => handleClick(item.id)}>
  Delete
</button>

// Named function for complex handlers
function handleDragStart(event) {
  event.dataTransfer.setData('text/plain', id);
}
<div draggable onDragStart={handleDragStart} />
```

## CSS/Styling

### Tailwind CSS

```jsx
// Use utility classes
<div className="flex items-center justify-between p-4 bg-white rounded-lg shadow">

// Conditional classes
<div className={`
  p-4 rounded-lg
  ${isActive ? 'bg-blue-500' : 'bg-gray-200'}
`}

// Combine with object (for dynamic)
<div className={clsx('base-class', {
  'active-class': isActive
})} />
```

### Custom CSS

```css
/* BEM naming convention */
.block { }
.block__element { }
.block--modifier { }

/* Example */
.card { }
.card__header { }
.card--featured { }
```

### CSS Variables

```css
:root {
  --color-primary: #0891B2;
  --color-secondary: #F97316;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --radius-sm: 0.25rem;
}
```

## File Organization

### Project Structure

```
src/
├── components/
│   ├── ui/              # Base components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   └── Input.jsx
│   ├── features/        # Feature components
│   │   ├── Dashboard/
│   │   │   ├── StatsCard.jsx
│   │   │   └── ActivityFeed.jsx
│   │   └── Visualizer/
│   │       ├── GraphView.jsx
│   │       └── Controls.jsx
│   └── layout/
│       ├── Header.jsx
│       └── Sidebar.jsx
├── hooks/               # Custom hooks
├── utils/               # Utility functions
├── services/            # API services
├── constants/           # Constants
└── styles/              # Global styles
```

### File Naming

| Content | Convention | Example |
|---------|------------|---------|
| Component | PascalCase | `UserCard.jsx` |
| Hook | camelCase + use prefix | `useLocalStorage.js` |
| Utility | camelCase | `formatDate.js` |
| Constant | UPPER_SNAKE_CASE | `API_ENDPOINTS.js` |
| Style | kebab-case | `global-styles.css` |
| Test | filename.test.js | `UserCard.test.jsx` |

### Export Patterns

```javascript
// Default export (one per file)
export default function UserCard() { }

// Named exports (multiple per file)
export function formatUser() { }
export function validateUser() { }

// Barrel exports (index.js)
export { UserCard } from './UserCard';
export { formatUser, validateUser } from './user-utils';
```


## Naming Conventions

### General Rules

| Type | Convention | Example |
|------|------------|---------|
| Variables | camelCase | `userName`, `isActive` |
| Constants | UPPER_SNAKE_CASE | `MAX_SIZE`, `API_URL` |
| Functions | camelCase | `getUser()`, `calculateTotal()` |
| Classes | PascalCase | `UserService`, `GraphVisualizer` |
| Components | PascalCase | `UserCard`, `DataGrid` |
| Hooks | camelCase + use prefix | `useState`, `useLocalStorage` |
| Files | kebab-case | `user-card.jsx`, `api-service.js` |

### Specific Names

```javascript
// Booleans - is/has/can/should prefix
const isLoading = true;
const hasError = false;
const canSubmit = true;
const shouldUpdate = false;

// Collections - plural or 'List'/'Array' suffix
const users = [];
const userList = [];
const itemArray = [];

// Functions - verb + noun
getUser()
fetchData()
calculateTotal()
validateInput()

// Events - on + event
onClick()
onChange()
onSubmit()
onHover()

// Callbacks - handle + event
handleClick()
handleChange()
handleSubmit()

// Constants - descriptive
const MAX_RETRY_COUNT = 3;
const DEFAULT_TIMEOUT_MS = 5000;
const API_BASE_URL = 'https://api.example.com';
```


## Tools

### ESLint Configuration

```json
{
  "extends": [
    "next/core-web-vitals",
    "plugin:react/recommended",
    "prettier"
  ],
  "rules": {
    "react/prop-types": "off",
    "no-unused-vars": "warn",
    "prefer-const": "error"
  }
}
```

### Prettier Configuration

```json
{
  "semi": true,
  "singleQuote": true,
  "tabWidth": 2,
  "trailingComma": "es5",
  "printWidth": 100,
  "bracketSpacing": true,
  "arrowParens": "avoid"
}
```

## Quick Reference

### ✅ Do

- Use `const` by default, `let` when needed
- Use descriptive names
- Write small, focused functions
- Use template literals
- Use array methods (map, filter, reduce)
- Use early returns
- Add comments for complex logic
- Format code with Prettier

### ❌ Don't

- Use `var`
- Use `==` for comparison
- Leave commented-out code
- Use magic numbers
- Create long functions (> 50 lines)
- Nest conditionals too deeply
- Use `index` as key in dynamic lists
- Commit directly to main


## 👨‍💻 Author

Designed and developed with a focus on clean architecture, performance, and developer experience.

<div align="center">

**Ujjwal Saini**  
_Full-Stack Developer_

🌐 [ujjwalsaini.dev](https://www.ujjwalsaini.dev/) · 🐙 [GitHub](https://github.com/UjjwalSaini07)

</div>

<div align="center">
    <a href="#top">
        <img src="https://img.shields.io/badge/Back%20to%20Top-000000?style=for-the-badge&logo=github&logoColor=white" alt="Back to Top">
    </a>
</div>