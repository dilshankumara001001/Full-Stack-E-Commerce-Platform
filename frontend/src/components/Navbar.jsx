import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Navbar, Nav, Container, Badge, Button } from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export default function AppNavbar() {
  const { count } = useCart();
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => location.pathname === path;

  return (
    <Navbar
      expand="lg"
      sticky="top"
      className={`navbar-custom shadow-sm ${scrolled ? 'navbar-scrolled' : ''}`}
    >
      <Container>
        <Navbar.Brand as={Link} to="/" className="fw-bold fs-4">
          <span style={{ fontSize: '1.5rem' }}>🛒</span> ShopLK
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" className="border-light" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center">
            <Nav.Link
              as={Link}
              to="/"
              className={`text-white nav-item-custom ${isActive('/') ? 'active-link' : ''}`}
            >
              🏠 Home
            </Nav.Link>
            <Nav.Link
              as={Link}
              to="/cart"
              className={`text-white nav-item-custom ${isActive('/cart') ? 'active-link' : ''}`}
            >
              🛍️ Cart {count > 0 && <Badge bg="danger" pill className="ms-1">{count}</Badge>}
            </Nav.Link>
            {user && (
              <Nav.Link
                as={Link}
                to="/orders"
                className={`text-white nav-item-custom ${isActive('/orders') ? 'active-link' : ''}`}
              >
                📦 Orders
              </Nav.Link>
            )}
            {user?.role === 'admin' && (
              <Nav.Link
                as={Link}
                to="/admin"
                className={`text-warning fw-bold nav-item-custom ${isActive('/admin') ? 'active-link' : ''}`}
              >
                👨‍💼 Admin
              </Nav.Link>
            )}
            {user ? (
              <>
                <Nav.Link disabled className={user.role === 'admin' ? 'text-warning' : 'text-info'}>
                  {user.role === 'admin' ? '👨‍💼 Admin' : '👤 User'} {user.name}
                </Nav.Link>
                <Button
                  size="sm"
                  variant="outline-light"
                  className="ms-2 btn-logout"
                  onClick={handleLogout}
                >
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login" className="text-white nav-item-custom">
                  Login
                </Nav.Link>
                <Button
                  as={Link}
                  to="/register"
                  size="sm"
                  variant="warning"
                  className="ms-2 fw-bold btn-register"
                >
                  Register
                </Button>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}