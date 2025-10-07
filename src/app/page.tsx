export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'linear-gradient(135deg, #F6F1E6 0%, #E8DCC8 100%)'
    }}>
      <div style={{ textAlign: 'center', padding: '2rem' }}>
        <h1 style={{
          fontSize: '4rem',
          fontWeight: 'bold',
          color: '#0B0B0B',
          marginBottom: '1rem'
        }}>
          Hub4Estate
        </h1>
        <p style={{
          fontSize: '1.5rem',
          color: '#B8860B',
          marginBottom: '2rem'
        }}>
          Real Estate Platform
        </p>
        <p style={{
          fontSize: '1rem',
          color: 'rgba(11, 11, 11, 0.7)'
        }}>
          Welcome to your royal-themed real estate experience
        </p>
      </div>
    </div>
  );
}