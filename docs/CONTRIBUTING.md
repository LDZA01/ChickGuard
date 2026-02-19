# Contributing to ChickGuard

Thank you for considering contributing to ChickGuard! 🐔

## 🌟 Ways to Contribute

- Report bugs
- Suggest new features
- Improve documentation
- Submit pull requests

## 🐛 Reporting Bugs

1. Check if the bug has already been reported
2. Create a detailed issue with:
   - Steps to reproduce
   - Expected behavior
   - Actual behavior
   - Screenshots (if applicable)
   - Environment details

## 💡 Suggesting Features

1. Check existing feature requests
2. Create an issue describing:
   - The problem it solves
   - Proposed solution
   - Alternative solutions considered

## 🔧 Development Setup

```bash
# Clone repository
git clone https://github.com/LDZA01/ChickGuard.git
cd ChickGuard

# Setup backend
cd backend
pip install -r requirements.txt

# Setup frontend
cd ../frontend
npm install

# Configure environment
cp .env.example .env
# Edit .env with your settings
```

## 📝 Code Style

### Python (Backend)
- Follow PEP 8
- Use type hints
- Add docstrings for functions
- Maximum line length: 100 characters

### TypeScript (Frontend)
- Use TypeScript strict mode
- Follow ESLint rules
- Use functional components with hooks
- Maximum line length: 100 characters

## 🔄 Pull Request Process

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### PR Guidelines:
- Write clear commit messages
- Update documentation if needed
- Add tests if applicable
- Ensure all tests pass
- Keep PRs focused on a single feature/fix

## 🧪 Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm test
```

## 📄 License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

<div align="center">
  <p><strong>Thank you for contributing!</strong> 🙏</p>
  <p>One Health - One Future 🐔🌍</p>
</div>
