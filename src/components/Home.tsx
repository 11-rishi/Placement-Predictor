import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleSelectFiles = () => {
    navigate('/select-files');
  };

  return (
    <div>
      {/* ... existing home page content ... */}
      <button 
        onClick={handleSelectFiles}
        className
    </div>
  );
}

export default Home; 