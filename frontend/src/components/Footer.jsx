import { Container, Row, Col } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const linkStyle = {
  color: '#94a3b8',
  textDecoration: 'none',
  fontSize: '0.9rem',
  display: 'inline-block',
  transition: 'all 0.3s ease',
  fontWeight: 500,
};

const contactStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '14px',
  color: '#cbd5e1',
  fontSize: '0.9rem',
  fontWeight: 500,
};

export default function Footer() {
  const handleLinkHover = (e, isEnter) => {
    e.target.style.color = isEnter ? '#ffffff' : '#94a3b8';
    e.target.style.transform = isEnter ? 'translateX(6px)' : 'translateX(0)';
  };

  const handleSocialHover = (e, isEnter) => {
    e.currentTarget.style.background = isEnter
      ? 'linear-gradient(135deg, #6366f1, #8b5cf6)'
      : 'rgba(255, 255, 255, 0.08)';
    e.currentTarget.style.transform = isEnter
      ? 'translateY(-4px) scale(1.1)'
      : 'translateY(0) scale(1)';
    e.currentTarget.style.boxShadow = isEnter
      ? '0 8px 20px rgba(99, 102, 241, 0.5)'
      : 'none';
  };

  return (
    <footer
      style={{
        background: 'linear-gradient(180deg, #1e293b 0%, #0f172a 100%)',
        padding: '60px 0 25px',
        marginTop: '60px',
        color: '#cbd5e1',
        position: 'relative',
      }}
    >
      {/* Rainbow top border */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: '3px',
          background: 'linear-gradient(90deg, #6366f1, #ec4899, #f59e0b, #10b981, #6366f1)',
          backgroundSize: '300% 100%',
          animation: 'gradientShift 6s ease infinite',
        }}
      />

      <Container style={{ position: 'relative', zIndex: 1 }}>
        <Row className="g-4">
          {/* ===== BRAND COLUMN ===== */}
          <Col md={4}>
            <h4
              style={{
                color: '#ffffff',
                fontWeight: 800,
                fontSize: '1.6rem',
                letterSpacing: '-0.02em',
                marginBottom: '16px',
                textShadow: '0 2px 10px rgba(99, 102, 241, 0.4)',
              }}
            >
              🛒 ShopLK
            </h4>
            <p
              style={{
                color: '#94a3b8',
                fontSize: '0.9rem',
                lineHeight: 1.7,
                maxWidth: '320px',
                marginBottom: '20px',
              }}
            >
              Sri Lanka's best online shopping experience.
              Quality products, fast delivery, unbeatable prices.
            </p>

            {/* Social buttons */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              {['📘', '📷', '🐦', '▶️'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    display: 'inline-flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    textDecoration: 'none',
                    fontSize: '1.1rem',
                    transition: 'all 0.3s ease',
                  }}
                  onMouseEnter={(e) => handleSocialHover(e, true)}
                  onMouseLeave={(e) => handleSocialHover(e, false)}
                >
                  {icon}
                </a>
              ))}
            </div>
          </Col>

          {/* ===== QUICK LINKS ===== */}
          <Col md={2} sm={6}>
            <h6
              style={{
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.02em',
                paddingBottom: '10px',
                position: 'relative',
                display: 'inline-block',
                marginBottom: '20px',
              }}
            >
              Quick Links
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '35px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                  borderRadius: '3px',
                }}
              />
            </h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { to: '/', label: 'Home' },
                { to: '/cart', label: 'Cart' },
                { to: '/orders', label: 'My Orders' },
                { to: '/login', label: 'Login' },
              ].map((item, i) => (
                <li key={i} style={{ marginBottom: '12px' }}>
                  <Link
                    to={item.to}
                    style={linkStyle}
                    onMouseEnter={(e) => handleLinkHover(e, true)}
                    onMouseLeave={(e) => handleLinkHover(e, false)}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* ===== CATEGORIES ===== */}
          <Col md={3} sm={6}>
            <h6
              style={{
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.02em',
                paddingBottom: '10px',
                position: 'relative',
                display: 'inline-block',
                marginBottom: '20px',
              }}
            >
              Categories
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '35px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                  borderRadius: '3px',
                }}
              />
            </h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {['Electronics', 'Clothing', 'Home & Kitchen', 'Books'].map((cat, i) => (
                <li key={i} style={{ marginBottom: '12px' }}>
                  <Link
                    to="/"
                    style={linkStyle}
                    onMouseEnter={(e) => handleLinkHover(e, true)}
                    onMouseLeave={(e) => handleLinkHover(e, false)}
                  >
                    {cat}
                  </Link>
                </li>
              ))}
            </ul>
          </Col>

          {/* ===== CONTACT ===== */}
          <Col md={3}>
            <h6
              style={{
                color: '#ffffff',
                fontWeight: 700,
                fontSize: '1rem',
                letterSpacing: '0.02em',
                paddingBottom: '10px',
                position: 'relative',
                display: 'inline-block',
                marginBottom: '20px',
              }}
            >
              Contact Us
              <span
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: '35px',
                  height: '3px',
                  background: 'linear-gradient(90deg, #6366f1, #ec4899)',
                  borderRadius: '3px',
                }}
              />
            </h6>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
              {[
                { icon: '📧', text: 'info@shoplk.lk' },
                { icon: '📞', text: '+94 11 234 5678' },
                { icon: '📍', text: 'Colombo, Sri Lanka' },
                { icon: '🕐', text: 'Mon–Sat, 9AM – 6PM' },
              ].map((item, i) => (
                <li key={i} style={contactStyle}>
                  <span
                    style={{
                      fontSize: '1rem',
                      flexShrink: 0,
                      display: 'inline-flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      width: '28px',
                      height: '28px',
                      background: 'rgba(99, 102, 241, 0.15)',
                      borderRadius: '50%',
                    }}
                  >
                    {item.icon}
                  </span>
                  <span>{item.text}</span>
                </li>
              ))}
            </ul>
          </Col>
        </Row>

        {/* Divider */}
        <hr
          style={{
            border: 'none',
            borderTop: '1px solid rgba(255, 255, 255, 0.1)',
            margin: '40px 0 20px',
          }}
        />

        {/* Bottom */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '10px',
          }}
        >
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
            © {new Date().getFullYear()}{' '}
            <strong style={{ color: '#a78bfa', fontWeight: 700 }}>ShopLK</strong>.
            All rights reserved.
          </p>
          <p style={{ color: '#64748b', fontSize: '0.85rem', margin: 0 }}>
            Made with ❤️ in Sri Lanka
          </p>
        </div>
      </Container>
    </footer>
  );
}