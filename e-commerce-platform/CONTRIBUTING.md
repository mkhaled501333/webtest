# Contributing to StyleHub

Thank you for your interest in contributing to StyleHub! This document provides comprehensive guidelines for contributing to our advanced e-commerce platform.

## 📋 Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Project Structure](#project-structure)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing Guidelines](#testing-guidelines)
- [Performance Guidelines](#performance-guidelines)
- [Accessibility Guidelines](#accessibility-guidelines)
- [Pull Request Process](#pull-request-process)
- [Issue Guidelines](#issue-guidelines)
- [Security](#security)
- [Documentation](#documentation)
- [Community](#community)

## 🤝 Code of Conduct

This project and everyone participating in it is governed by our [Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code.

### Our Standards

- **Be respectful** and inclusive of differing viewpoints and experiences
- **Be collaborative** and help others learn and grow
- **Be professional** in all interactions
- **Focus on constructive feedback** rather than personal criticism
- **Respect privacy** and confidentiality

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- **Node.js 18+** and npm installed
- **Git** for version control
- A modern browser with **WebGL support** for testing 3D/AR features
- Basic knowledge of **React**, **TypeScript**, and **Three.js**

### Fork and Clone

1. **Fork** the repository on GitHub
2. **Clone** your fork locally:
   ```bash
   git clone https://github.com/your-username/stylehub.git
   cd stylehub
   ```
3. **Add upstream** remote:
   ```bash
   git remote add upstream https://github.com/original-owner/stylehub.git
   ```

## 💻 Development Setup

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# In another terminal, run tests in watch mode
npm run test:watch
```

### Environment Configuration

1. Copy the environment template:
   ```bash
   cp .env.example .env.local
   ```

2. Update the variables in `.env.local` with your local settings

### Verify Setup

- **Frontend**: http://localhost:5173
- **Tests**: `npm run test`
- **Linting**: `npm run lint`
- **Type checking**: `npm run type-check`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── ui/             # Basic UI components (Button, Input, etc.)
│   ├── layout/         # Layout components (Header, Footer)
│   ├── product/        # Product-specific components
│   ├── cart/           # Shopping cart components
│   ├── auth/           # Authentication components
│   └── performance/    # Performance monitoring components
├── pages/              # Page components
├── store/              # Zustand state management
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
├── data/               # Mock data and constants
└── assets/             # Static assets
```

### Component Guidelines

- **One component per file** with clear naming
- **Co-locate related files** (component, styles, tests)
- **Use TypeScript interfaces** for all props
- **Export components as default** and types as named exports

## 🔄 Development Workflow

### Branch Strategy

We use **GitFlow** branching strategy:

- `main` - Production-ready code
- `develop` - Integration branch for features
- `feature/*` - New features
- `bugfix/*` - Bug fixes
- `hotfix/*` - Critical production fixes
- `release/*` - Release preparation

### Creating a Feature Branch

```bash
# Update your local develop branch
git checkout develop
git pull upstream develop

# Create a new feature branch
git checkout -b feature/your-feature-name

# Make your changes and commit
git add .
git commit -m "feat: add amazing new feature"

# Push to your fork
git push origin feature/your-feature-name
```

### Commit Message Convention

We follow the **Conventional Commits** specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types:**
- `feat`: New features
- `fix`: Bug fixes
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `perf`: Performance improvements
- `test`: Adding or updating tests
- `ci`: CI/CD changes
- `chore`: Maintenance tasks

**Examples:**
```bash
feat(cart): add quantity selector component
fix(auth): resolve login redirect issue
docs(api): update authentication endpoints
perf(3d): optimize texture loading for mobile
test(components): add unit tests for Button component
```

## 📏 Coding Standards

### TypeScript

- **Strict mode enabled** - no `any` types unless absolutely necessary
- **Explicit return types** for all functions
- **Interface over type** for object definitions
- **Consistent naming conventions**:
  - PascalCase for components and interfaces
  - camelCase for functions and variables
  - UPPER_CASE for constants

```typescript
// ✅ Good
interface UserProps {
  id: string;
  name: string;
  isActive: boolean;
}

const UserCard: React.FC<UserProps> = ({ id, name, isActive }) => {
  return <div>...</div>;
};

// ❌ Bad
const userCard = (props: any) => {
  return <div>...</div>;
};
```

### React Best Practices

- **Functional components** with hooks
- **Custom hooks** for reusable logic
- **Proper dependency arrays** in useEffect
- **Memoization** for expensive calculations
- **Error boundaries** for component error handling

```typescript
// ✅ Good
const ProductList: React.FC<ProductListProps> = ({ category }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  const filteredProducts = useMemo(() => 
    products.filter(p => p.category === category),
    [products, category]
  );

  useEffect(() => {
    fetchProducts();
  }, [category]);

  return <div>...</div>;
};
```

### CSS/Styling

- **Tailwind CSS** for styling
- **Responsive design** with mobile-first approach
- **Consistent spacing** using Tailwind's spacing scale
- **Accessibility-friendly** colors and contrast
- **Dark mode support** (when applicable)

```typescript
// ✅ Good
<button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
  Add to Cart
</button>
```

### Performance Guidelines

- **Lazy load** components and routes
- **Optimize images** with proper formats and sizes
- **Bundle splitting** for efficient loading
- **Memoize expensive calculations**
- **Virtualize long lists**

```typescript
// ✅ Lazy loading
const ProductDetail = lazy(() => import('../pages/ProductDetail'));

// ✅ Image optimization
<img 
  src={optimizedImageUrl} 
  srcSet={`${mobileImage} 480w, ${desktopImage} 1200w`}
  sizes="(max-width: 768px) 100vw, 50vw"
  loading="lazy"
  alt={product.name}
/>
```

## 🧪 Testing Guidelines

### Test Structure

- **Unit tests** for components and utilities
- **Integration tests** for feature workflows
- **E2E tests** for critical user journeys
- **Performance tests** for 3D/AR features

### Writing Tests

```typescript
// Component test example
import { render, screen, fireEvent } from '@testing-library/react';
import { Button } from './Button';

describe('Button', () => {
  it('should render with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });

  it('should call onClick when clicked', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Click me</Button>);
    
    fireEvent.click(screen.getByText('Click me'));
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
```

### Test Commands

```bash
# Run all tests
npm run test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Run E2E tests
npm run test:e2e

# Run specific test file
npm run test Button.test.tsx
```

### Coverage Requirements

- **Minimum 70% code coverage** for new features
- **Critical components require 90%+ coverage**
- **All public API functions must be tested**

## ♿ Accessibility Guidelines

### WCAG 2.1 AA Compliance

- **Semantic HTML** elements
- **Proper ARIA labels** and roles
- **Keyboard navigation** support
- **Screen reader** compatibility
- **Color contrast** ratios of 4.5:1 minimum

```typescript
// ✅ Accessible component
<button
  aria-label={`Add ${product.name} to cart`}
  aria-describedby="cart-help"
  className="focus:outline-none focus:ring-2 focus:ring-blue-500"
  onClick={handleAddToCart}
>
  <ShoppingCartIcon aria-hidden="true" />
  Add to Cart
</button>
```

### Testing Accessibility

```bash
# Run accessibility tests
npm run test:a11y

# Manual testing with screen readers
# - Use NVDA (Windows) or VoiceOver (macOS)
# - Test keyboard navigation
# - Verify color contrast
```

## 📝 Pull Request Process

### Before Submitting

1. **Sync with upstream**:
   ```bash
   git checkout develop
   git pull upstream develop
   git checkout feature/your-feature
   git rebase develop
   ```

2. **Run all checks**:
   ```bash
   npm run lint
   npm run type-check
   npm run test
   npm run test:e2e
   ```

3. **Build successfully**:
   ```bash
   npm run build
   ```

### PR Template

When creating a PR, use this template:

```markdown
## Description
Brief description of the changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Unit tests pass
- [ ] E2E tests pass
- [ ] Manual testing completed
- [ ] Accessibility tested

## Screenshots/Videos
(If applicable)

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console errors or warnings
```

### Review Process

1. **Automated checks** must pass
2. **Two approvals** required from maintainers
3. **No merge conflicts**
4. **All conversations resolved**

## 🐛 Issue Guidelines

### Bug Reports

Use the bug report template and include:

- **Environment details** (OS, browser, versions)
- **Steps to reproduce**
- **Expected vs actual behavior**
- **Screenshots/videos** if applicable
- **Console errors**
- **Network logs** if relevant

### Feature Requests

Use the feature request template and include:

- **Clear problem statement**
- **Proposed solution**
- **Alternative solutions considered**
- **User stories** and acceptance criteria
- **Mockups/wireframes** if applicable

### Labels

- `bug` - Something isn't working
- `enhancement` - New feature or request
- `documentation` - Improvements to docs
- `good first issue` - Good for newcomers
- `help wanted` - Extra attention needed
- `priority:high` - High priority
- `3d/ar` - Related to 3D/AR features
- `performance` - Performance related
- `accessibility` - A11y related

## 🔒 Security

### Reporting Security Issues

**DO NOT** create public issues for security vulnerabilities. Instead:

1. Email security@stylehub.com
2. Include detailed description
3. Provide steps to reproduce
4. Wait for acknowledgment before disclosure

### Security Best Practices

- **Validate all inputs** on client and server
- **Sanitize user content** before display
- **Use HTTPS** for all requests
- **Implement proper authentication**
- **Follow OWASP guidelines**

## 📚 Documentation

### Code Documentation

- **JSDoc comments** for all public functions
- **README files** for each major module
- **Inline comments** for complex logic
- **Architecture decisions** documented in ADRs

```typescript
/**
 * Calculates optimal product recommendations based on user behavior
 * @param userId - Unique identifier for the user
 * @param preferences - User's shopping preferences
 * @param limit - Maximum number of recommendations to return
 * @returns Promise resolving to recommended products
 * @example
 * ```typescript
 * const recommendations = await getRecommendations('user123', { category: 'clothing' }, 10);
 * ```
 */
async function getRecommendations(
  userId: string,
  preferences: UserPreferences,
  limit: number = 10
): Promise<Product[]> {
  // Implementation
}
```

### Component Documentation

Use Storybook for component documentation:

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { Button } from './Button';

const meta: Meta<typeof Button> = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component: 'A versatile button component with multiple variants and sizes.',
      },
    },
  },
};

export default meta;
```

## 👥 Community

### Communication Channels

- **GitHub Discussions** - General discussions and Q&A
- **Discord Server** - Real-time chat and collaboration
- **Twitter** - Updates and announcements
- **Monthly Calls** - Community sync meetings

### Getting Help

1. **Search existing issues** and discussions
2. **Check documentation** and README
3. **Ask in Discord** for quick questions
4. **Create GitHub discussion** for detailed questions
5. **Create issue** if you find a bug

### Mentorship

New contributors can request mentorship:

- **Good first issues** are labeled and documented
- **Mentors available** for guidance and code review
- **Pair programming sessions** can be arranged
- **Office hours** held weekly

## 🎯 Recognition

### Contributors

- **Contributors list** maintained in README
- **Monthly highlights** in newsletter
- **Conference speaking opportunities**
- **Maintainer pathway** for active contributors

### Contributions Types

We recognize all types of contributions:

- 💻 **Code** - Bug fixes, features, performance improvements
- 📖 **Documentation** - README, guides, tutorials
- 🐛 **Testing** - Bug reports, test improvements
- 💡 **Ideas** - Feature requests, discussions
- 🎨 **Design** - UI/UX improvements, icons
- 📢 **Outreach** - Talks, blog posts, tutorials
- 🔧 **Tools** - Developer experience improvements

## 📊 Project Metrics

We track and share:

- **Code coverage** percentage
- **Performance metrics** (bundle size, load times)
- **Accessibility score**
- **Contributor statistics**
- **Issue resolution time**

## 🚀 Release Process

### Version Strategy

We follow **Semantic Versioning** (SemVer):

- **MAJOR**: Breaking changes
- **MINOR**: New features, backwards compatible
- **PATCH**: Bug fixes, backwards compatible

### Release Schedule

- **Patch releases**: Weekly (as needed)
- **Minor releases**: Monthly
- **Major releases**: Quarterly

### Changelog

All notable changes are documented in [CHANGELOG.md](CHANGELOG.md) following the [Keep a Changelog](https://keepachangelog.com/) format.

---

## 🙏 Thank You

Thank you for contributing to StyleHub! Your efforts help make e-commerce more immersive and accessible for everyone.

**Questions?** Reach out to the maintainers or join our [Discord server](https://discord.gg/stylehub).

**Happy coding!** 🎉 