// import { Routes, Route, Navigate } from 'react-router-dom'
// import DashboardLayout from './layouts/DashboardLayout.jsx'
// import Home from './pages/Home.jsx'
// import Login from './pages/Login.jsx'
// import PublicDashboard from './pages/PublicDashboard.jsx'
// import OfficerDashboard from './pages/OfficerDashboard.jsx'
// import EmergencyDashboard from './pages/EmergencyDashboard.jsx'
// import Settings from './pages/Settings.jsx'
// import ComingSoon from './pages/ComingSoon.jsx'

// export default function App() {
//   return (
//     <Routes>
//       <Route path="/" element={<Home />} />
//       <Route path="/login/:role" element={<Login />} />

//       {/* Public (no login) */}
//       <Route path="/public" element={<DashboardLayout role="public" />}>
//         <Route index element={<PublicDashboard />} />
//         <Route path="settings" element={<Settings />} />
//       </Route>

//       {/* Traffic officer */}
//       <Route path="/officer" element={<DashboardLayout role="officer" />}>
//         <Route index element={<Navigate to="dashboard" replace />} />
//         <Route path="dashboard" element={<OfficerDashboard />} />
//         <Route path="ev-tracking" element={<ComingSoon title="EV Tracking" />} />
//         <Route path="settings" element={<Settings />} />
//       </Route>

//       {/* Emergency services */}
//       <Route path="/emergency" element={<DashboardLayout role="emergency" />}>
//         <Route index element={<Navigate to="dashboard" replace />} />
//         <Route path="dashboard" element={<EmergencyDashboard />} />
//         <Route path="hospitals" element={<ComingSoon title="Hospitals" />} />
//         <Route path="settings" element={<Settings />} />
//       </Route>

//       <Route path="*" element={<Navigate to="/" replace />} />
//     </Routes>
//   )
// }


import { Routes, Route, Navigate } from 'react-router-dom'

import DashboardLayout from './layouts/DashboardLayout.jsx'
import Home from './pages/Home.jsx'
import Login from './pages/Login.jsx'
import PublicDashboard from './pages/PublicDashboard.jsx'
import OfficerDashboard from './pages/OfficerDashboard.jsx'
import EmergencyDashboard from './pages/EmergencyDashboard.jsx'
import Settings from './pages/Settings.jsx'
import ComingSoon from './pages/ComingSoon.jsx'

export default function App() {
  return (
    <Routes>

      {/* Home */}
      <Route path="/" element={<Home />} />

      {/* Login */}
      <Route path="/login/:role" element={<Login />} />


      {/* ================= PUBLIC ================= */}
      <Route path="/public" element={<DashboardLayout role="public" />}>
        <Route index element={<PublicDashboard />} />
        <Route path="settings" element={<Settings />} />
      </Route>


      {/* ================= TRAFFIC OFFICER ================= */}
      <Route path="/officer" element={<DashboardLayout role="officer" />}>

        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<OfficerDashboard />}
        />

        <Route
          path="ev-tracking"
          element={<ComingSoon title="EV Tracking" />}
        />

        <Route
          path="settings"
          element={<Settings />}
        />

      </Route>


      {/* ================= EMERGENCY SERVICES ================= */}
      <Route
        path="/emergency"
        element={<DashboardLayout role="emergency" />}
      >

        <Route
          index
          element={<Navigate to="dashboard" replace />}
        />

        <Route
          path="dashboard"
          element={<EmergencyDashboard />}
        />

        <Route
          path="hospitals"
          element={<ComingSoon title="Hospitals" />}
        />

        <Route
          path="settings"
          element={<Settings />}
        />

      </Route>


      {/* ================= 404 / UNKNOWN ROUTE ================= */}
      <Route
        path="*"
        element={<Navigate to="/" replace />}
      />

    </Routes>
  )
}