// import { useTestExecution } from '../../../contexts/TestExecutionContext';
// import ActiveTestsList from './ActiveTestList';
// import TestRunDetailPopup from './TestDetailPopup';

// export default function GlobalTestMonitoring() {
//   const {
//     activeTests,
//     selectedTestId,
//     handleTestClick,
//     handleMinimize,
//     handleClose,
//     stopTest,
//     stopAllTests,
//     minimizedTests
//   } = useTestExecution();

//   const selectedTest = activeTests.find(t => t.id === selectedTestId);

//   return (
//     <>
//       <ActiveTestsList
//         tests={activeTests}
//         onTestClick={handleTestClick}
//         onStopTest={stopTest}
//         onStopAllTests={stopAllTests}
//         selectedTestId={selectedTestId}
//       />

//       {activeTests.map(test => (
//         selectedTestId === test.id && (
//           <TestRunDetailPopup
//             key={test.id}
//             test={test}
//             onClose={() => handleClose(test.id)}
//             onMinimize={() => handleMinimize(test.id)}
//             onStop={stopTest}
//             isMinimized={minimizedTests.has(test.id)}
//           />
//         )
//       ))}
//     </>
//   );
// }

import { useTestExecution } from '../../../contexts/TestExecutionContext';
import ActiveTestsList from './ActiveTestList';
import TestRunDetailPopup from './TestDetailPopup';
import { useAuth } from '../../../contexts/AuthContext';

export default function GlobalTestMonitoring() {
  const {
    activeTests,
    selectedTestId,
    handleTestClick,
    handleMinimize,
    handleClose,
    stopTest,
    stopAllTests,
    minimizedTests
  } = useTestExecution();

  const { user } = useAuth();

  // Don't render anything if user is not logged in
  if (!user) {
    return null;
  }

  const selectedTest = activeTests.find(t => t.id === selectedTestId);

  return (
    <>
      <ActiveTestsList
        tests={activeTests}
        onTestClick={handleTestClick}
        onStopTest={stopTest}
        onStopAllTests={stopAllTests}
        selectedTestId={selectedTestId}
      />

      {activeTests.map(test => (
        selectedTestId === test.id && (
          <TestRunDetailPopup
            key={test.id}
            test={test}
            onClose={() => handleClose(test.id)}
            onMinimize={() => handleMinimize(test.id)}
            onStop={stopTest}
            isMinimized={minimizedTests.has(test.id)}
          />
        )
      ))}
    </>
  );
}