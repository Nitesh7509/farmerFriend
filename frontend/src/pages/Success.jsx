import { useNavigate, useLocation } from 'react-router-dom';

const Success = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const successMessage = location.state?.message || 'Operation completed successfully!';
  const redirectPath = location.state?.redirectPath || '/home';

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md text-center max-w-md">
        <div className="text-6xl mb-4">✅</div>
        <h1 className="text-3xl font-bold text-green-600 mb-4">Success!</h1>
        <p className="text-gray-700 mb-6">{successMessage}</p>
        <button
          onClick={() => navigate(redirectPath)}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default Success;
