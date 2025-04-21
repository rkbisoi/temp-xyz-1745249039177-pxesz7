// // // import { Toaster } from 'react-hot-toast';
// // // import { AuthProvider } from './contexts/AuthContext';
// // // import AppContent from './components/AppContent';

// // // function App() {
// // //   return (
// // //     <AuthProvider>
// // //       <Toaster position="top-right" />
// // //       <AppContent />
// // //     </AuthProvider>
// // //   );
// // // }

// // // export default App;

// // import { Toaster } from 'react-hot-toast';
// // import { AuthProvider } from './contexts/AuthContext';
// // import AppContent from './components/AppContent';
// // import { BrowserRouter, Routes, Route } from 'react-router-dom';
// // import RegisterPage from './components/auth/RegisterPage';
// // import { DialogProvider } from './components/shared/DialogProvider';
// // import { useEffect } from 'react';
// // import { API_URL } from './data';
// // import ProfilePage from './components/profile/ProfilePage';

// // function App() {

// //   const fetchData = async () => {
// //     try {
// //       const response = await fetch(`${API_URL}/refresh`, {
// //         method: "GET",
// //         headers: {
// //           "Content-Type": "application/json",
// //         },
// //         credentials: "include",
// //       });
  
// //       if (!response.ok) {
// //         throw new Error(`HTTP error! Status: ${response.status}`);
// //       }
  
// //     } catch (error) {
// //       console.error("Failed to fetch data:", error);
// //     }
// //   };
  
// //   useEffect(() => {
// //     fetchData();
  
// //     const intervalId = setInterval(fetchData, 1680000);
  
// //     return () => clearInterval(intervalId);
// //   }, []);

// //   return (
// //     <AuthProvider>
// //       <DialogProvider>
// //       <BrowserRouter>
// //         <Toaster position="top-right" />
// //         <Routes>
// //           <Route path="/register" element={<RegisterPage />} />
// //           <Route path="/profile" element={<ProfilePage />} />
// //           <Route path="/*" element={<AppContent />} />
// //         </Routes>
// //       </BrowserRouter>
// //       </DialogProvider>
// //     </AuthProvider>
// //   );
// // }

// // export default App;


// import { Toaster } from 'react-hot-toast';
// import { AuthProvider } from './contexts/AuthContext';
// import { DialogProvider } from './components/shared/DialogProvider';
// import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import AppContent from './components/AppContent';
// import RegisterPage from './components/auth/RegisterPage';
// import ProfilePage from './components/profile/ProfilePage';
// import { TestExecutionProvider } from './contexts/TestExecutionContext';
// import GlobalTestMonitoring from './components/test/testInterface/GlobalTestMonitoring';
// import { useEffect } from 'react';
// import { API_URL } from './data';

// function App() {
//   const fetchData = async () => {
//     try {
//       const response = await fetch(`${API_URL}/refresh`, {
//         method: "GET",
//         headers: {
//           "Content-Type": "application/json",
//         },
//         credentials: "include",
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! Status: ${response.status}`);
//       }
//     } catch (error) {
//       console.error("Failed to fetch data:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//     const intervalId = setInterval(fetchData, 1680000);
//     return () => clearInterval(intervalId);
//   }, []);

//   return (
//     <AuthProvider>
//       <TestExecutionProvider>
//         <DialogProvider>
//           <BrowserRouter>
//             <Toaster position="top-right" />
//             <Routes>
//               <Route path="/register" element={<RegisterPage />} />
//               <Route path="/profile" element={<ProfilePage />} />
//               <Route path="/*" element={<AppContent />} />
//             </Routes>
//             <GlobalTestMonitoring />
//           </BrowserRouter>
//         </DialogProvider>
//       </TestExecutionProvider>
//     </AuthProvider>
//   );
// }

// export default App;


import { Toaster } from "react-hot-toast";
import { AuthProvider } from "./contexts/AuthContext";
import { DialogProvider } from "./components/shared/DialogProvider";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppContent from "./components/AppContent";
import RegisterPage from "./components/auth/RegisterPage";
import ProfilePage from "./components/profile/ProfilePage";
import { TestExecutionProvider } from "./contexts/TestExecutionContext";
import GlobalTestMonitoring from "./components/test/testInterface/GlobalTestMonitoring";
import { useEffect } from "react";
import { API_URL } from "./data";
// import FloatingChat from "./components/chat/FloatingChat"; 
import FloatingChat from "./components/chat/FloatingChat2";
function App() {
  const fetchData = async () => {
    try {
      const response = await fetch(`${API_URL}/refresh`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
    } catch (error) {
      console.error("Failed to fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
    const intervalId = setInterval(fetchData, 1680000);
    return () => clearInterval(intervalId);
  }, []);

  return (
    <AuthProvider>
      <TestExecutionProvider>
        <DialogProvider>
          <BrowserRouter>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/*" element={<AppContent />} />
            </Routes>
            <GlobalTestMonitoring />
            <FloatingChat />
          </BrowserRouter>
        </DialogProvider>
      </TestExecutionProvider>
    </AuthProvider>
  );
}

export default App;
