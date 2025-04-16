import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleSelectFiles = () => {
    navigate('/select-files');
  };

  return (
    <div>
      {/* Your existing home page content */}
      <button 
        onClick={handleSelectFiles}
        className="px-4 py-2 bg 